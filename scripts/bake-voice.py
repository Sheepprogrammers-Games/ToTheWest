#!/usr/bin/env python3
"""Pre-render story voices with edge-tts for offline / platform playback."""

from __future__ import annotations

import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
CUES = ROOT / 'scripts' / 'voice-cues.json'
OUT = ROOT / 'assets' / 'voice'
MANIFEST = OUT / 'manifest.json'


async def render(cue: dict, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    communicator = edge_tts.Communicate(
        cue['text'],
        cue['voice'],
        rate=cue['rate'],
        volume=cue['volume'],
        pitch=cue['pitch'],
    )
    await communicator.save(str(dest))


async def main() -> None:
    cues = json.loads(CUES.read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    semaphore = asyncio.Semaphore(4)
    manifest: dict[str, str] = {}
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))

    async def one(cue: dict) -> None:
        relative = f"assets/voice/{cue['id']}.mp3"
        dest = ROOT / relative
        async with semaphore:
            if dest.exists() and dest.stat().st_size > 800:
                manifest[cue['key']] = relative
                return
            for attempt in range(3):
                try:
                    await render(cue, dest)
                    if dest.stat().st_size > 800:
                        manifest[cue['key']] = relative
                        print(f"ok {cue['character']} {cue['id']} {dest.stat().st_size}")
                        return
                except Exception as error:
                    print(f"retry {cue['id']} {error}")
                    await asyncio.sleep(1.2 * (attempt + 1))
            print(f"fail {cue['id']} {cue['character']}")

    await asyncio.gather(*(one(cue) for cue in cues))
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'baked {len(manifest)}/{len(cues)} -> {MANIFEST}')


if __name__ == '__main__':
    asyncio.run(main())
