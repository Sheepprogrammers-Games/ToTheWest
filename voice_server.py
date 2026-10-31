#!/usr/bin/env python3
"""Serve the game and synthesize its fixed character cast with edge-tts."""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import importlib.metadata
import json
import threading
from collections import OrderedDict
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

import edge_tts


ROOT = Path(__file__).resolve().parent
CAST_FILE = ROOT / "voice-cast.json"
MAX_REQUEST_BYTES = 32 * 1024
MAX_TEXT_LENGTH = 1200


def load_voice_cast(path: Path = CAST_FILE) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    profiles = payload.get("characters")
    if not isinstance(profiles, dict) or not profiles:
        raise ValueError("voice-cast.json must contain a non-empty characters object")
    required = {"voice", "gender", "tone", "rate", "pitch", "volume"}
    for character, profile in profiles.items():
        if not isinstance(profile, dict) or not required.issubset(profile):
            raise ValueError(f"incomplete voice profile: {character}")
        if not str(profile["voice"]).startswith("zh-CN-"):
            raise ValueError(f"non-Mandarin voice profile: {character}")
    return payload


def resolve_profile(payload: dict[str, Any], cast: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    character = "旁白" if payload.get("narrator") is True else payload.get("character")
    if not isinstance(character, str) or character not in cast["characters"]:
        raise ValueError("unknown character voice")
    return character, cast["characters"][character]


async def synthesize(text: str, profile: dict[str, Any]) -> bytes:
    communicator = edge_tts.Communicate(
        text,
        profile["voice"],
        rate=profile["rate"],
        volume=profile["volume"],
        pitch=profile["pitch"],
    )
    chunks: list[bytes] = []
    async for chunk in communicator.stream():
        if chunk["type"] == "audio":
            chunks.append(chunk["data"])
    audio = b"".join(chunks)
    if not audio:
        raise RuntimeError("edge-tts returned no audio")
    return audio


class AudioCache:
    def __init__(self, max_entries: int = 256, max_bytes: int = 96 * 1024 * 1024) -> None:
        self.max_entries = max_entries
        self.max_bytes = max_bytes
        self._entries: OrderedDict[str, bytes] = OrderedDict()
        self._bytes = 0
        self._lock = threading.Lock()

    def get(self, key: str) -> bytes | None:
        with self._lock:
            audio = self._entries.get(key)
            if audio is not None:
                self._entries.move_to_end(key)
            return audio

    def put(self, key: str, audio: bytes) -> None:
        with self._lock:
            previous = self._entries.pop(key, None)
            if previous is not None:
                self._bytes -= len(previous)
            self._entries[key] = audio
            self._bytes += len(audio)
            while len(self._entries) > self.max_entries or self._bytes > self.max_bytes:
                _, removed = self._entries.popitem(last=False)
                self._bytes -= len(removed)

    def stats(self) -> dict[str, int]:
        with self._lock:
            return {"entries": len(self._entries), "bytes": self._bytes}


class VoiceHTTPServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, address: tuple[str, int], handler: type[SimpleHTTPRequestHandler], cast: dict[str, Any]) -> None:
        super().__init__(address, handler)
        self.cast = cast
        self.audio_cache = AudioCache()


class VoiceRequestHandler(SimpleHTTPRequestHandler):
    server_version = "ToTheWestVoice/1.0"

    @property
    def voice_server(self) -> VoiceHTTPServer:
        return self.server  # type: ignore[return-value]

    def _send_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        path = urlsplit(self.path).path
        if path == "/api/health":
            self._send_json(
                HTTPStatus.OK,
                {
                    "status": "ok",
                    "engine": "edge-tts",
                    "engineVersion": importlib.metadata.version("edge-tts"),
                    "profiles": len(self.voice_server.cast["characters"]),
                    "cache": self.voice_server.audio_cache.stats(),
                },
            )
            return
        if path == "/api/voices":
            self._send_json(
                HTTPStatus.OK,
                {
                    "engine": self.voice_server.cast.get("engine", "edge-tts"),
                    "locale": self.voice_server.cast.get("locale", "zh-CN"),
                    "characters": self.voice_server.cast["characters"],
                },
            )
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if urlsplit(self.path).path != "/api/tts":
            self._send_json(HTTPStatus.NOT_FOUND, {"error": "not_found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_REQUEST_BYTES:
            self._send_json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, {"error": "invalid_request_size"})
            return
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(HTTPStatus.BAD_REQUEST, {"error": "invalid_json"})
            return
        if not isinstance(payload, dict):
            self._send_json(HTTPStatus.BAD_REQUEST, {"error": "invalid_payload"})
            return
        text = payload.get("text")
        if not isinstance(text, str) or not text.strip() or len(text) > MAX_TEXT_LENGTH:
            self._send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"error": "invalid_text"})
            return
        try:
            character, profile = resolve_profile(payload, self.voice_server.cast)
        except ValueError as error:
            self._send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"error": str(error)})
            return

        normalized_text = " ".join(text.split())
        cache_source = json.dumps(
            [normalized_text, character, profile["voice"], profile["rate"], profile["pitch"], profile["volume"]],
            ensure_ascii=False,
            separators=(",", ":"),
        )
        cache_key = hashlib.sha256(cache_source.encode("utf-8")).hexdigest()
        audio = self.voice_server.audio_cache.get(cache_key)
        cache_status = "HIT"
        if audio is None:
            cache_status = "MISS"
            try:
                audio = asyncio.run(synthesize(normalized_text, profile))
            except Exception as error:  # Network/service errors must let the browser fall back.
                self.log_error("voice synthesis failed for %s: %s", character, error)
                self._send_json(HTTPStatus.BAD_GATEWAY, {"error": "synthesis_failed"})
                return
            self.voice_server.audio_cache.put(cache_key, audio)

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "audio/mpeg")
        self.send_header("Content-Length", str(len(audio)))
        self.send_header("Cache-Control", "private, max-age=86400")
        self.send_header("X-Voice-Name", profile["voice"])
        self.send_header("X-Voice-Gender", profile["gender"])
        self.send_header("X-Voice-Cache", cache_status)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(audio)


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve ToTheWest with fixed neural character voices.")
    parser.add_argument("--bind", default="127.0.0.1", help="address to bind (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=4174, help="port to serve (default: 4174)")
    parser.add_argument("--root", type=Path, default=ROOT, help="static project root")
    parser.add_argument("--check", action="store_true", help="validate the voice cast and exit")
    args = parser.parse_args()

    cast_path = args.root.resolve() / CAST_FILE.name
    cast = load_voice_cast(cast_path)
    if args.check:
        print(json.dumps({"status": "ok", "profiles": len(cast["characters"])}, ensure_ascii=False))
        return

    handler = partial(VoiceRequestHandler, directory=str(args.root.resolve()))
    server = VoiceHTTPServer((args.bind, args.port), handler, cast)
    print(f"ToTheWest neural voice server: http://{args.bind}:{args.port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
