#!/usr/bin/env python3
"""Build a playable zip: HTML at archive root, under 50 MB."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import zipfile
from pathlib import Path

from concurrent.futures import ThreadPoolExecutor, as_completed

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STAGE = Path('/tmp/tothewest-release')
ZIP_PATH = Path('/Users/sheep/Public/games/西行拾卷.zip')
ASSET_RE = re.compile(r'assets/[A-Za-z0-9_./-]+\.(?:png|jpg|jpeg|webp|mp3)')
TEXT_FILES = (
    'index.html',
    'canonical-story.js',
    'story-branches.js',
    'shadowplay-runtime.js',
    'shadowplay-minigames.js',
    'shadowplay.css',
    'shadowplay-minigames.css',
    'voice-adapter.js',
    'voice-cast.json',
    'voice_server.py',
    'requirements-voice.txt',
    'VOICE.md',
)
FONT_DIR = ROOT / 'assets' / 'fonts'
VOICE_DIR = ROOT / 'assets' / 'voice'
DIST = ROOT / 'dist'


def collect_assets() -> set[str]:
    found: set[str] = set()
    for name in TEXT_FILES:
        text = (ROOT / name).read_text(encoding='utf-8')
        found.update(ASSET_RE.findall(text))
    return found


def resize_box(size: tuple[int, int], max_w: int, max_h: int) -> tuple[int, int]:
    width, height = size
    scale = min(max_w / width, max_h / height, 1)
    return max(1, round(width * scale)), max(1, round(height * scale))


def compress_image(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    image = Image.open(src)
    relative = src.relative_to(ROOT).as_posix()
    has_alpha = image.mode in ('RGBA', 'LA') or 'transparency' in image.info
    if 'action-sheet' in relative or 'fighters/' in relative:
        image = image.convert('RGBA')
        quality = 78
    elif relative.startswith('assets/characters/'):
        image = image.convert('RGBA') if has_alpha else image.convert('RGB')
        quality = 84
    elif relative.startswith('assets/backgrounds/') or relative.startswith('assets/transitions/'):
        image = image.convert('RGB')
        has_alpha = False
        image = image.resize(resize_box(image.size, 1280, 720), Image.Resampling.LANCZOS)
        quality = 72
    elif relative.startswith('assets/minigames/'):
        image = image.convert('RGBA') if has_alpha else image.convert('RGB')
        image = image.resize(resize_box(image.size, 1400, 900), Image.Resampling.LANCZOS)
        quality = 76
    else:
        image = image.convert('RGBA') if has_alpha else image.convert('RGB')
        image = image.resize(resize_box(image.size, 768, 1152), Image.Resampling.LANCZOS)
        quality = 76
    dest = dest.with_suffix('.webp')
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, 'WEBP', quality=quality, method=4)


def compress_bgm(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ['ffmpeg', '-y', '-i', str(src), '-vn', '-ac', '1', '-ar', '44100', '-b:a', '56k', str(dest)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def copy_used_voices(dest: Path) -> None:
    cues_path = ROOT / 'scripts' / 'voice-cues.json'
    manifest_path = VOICE_DIR / 'manifest.json'
    if not cues_path.exists() or not manifest_path.exists():
        if VOICE_DIR.exists():
            shutil.copytree(VOICE_DIR, dest, dirs_exist_ok=True)
        return
    cues = json.loads(cues_path.read_text(encoding='utf-8'))
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    dest.mkdir(parents=True, exist_ok=True)
    trimmed = {}
    missing = []
    for cue in cues:
        relative = manifest.get(cue['key']) or f"assets/voice/{cue['id']}.mp3"
        src = ROOT / relative
        if not src.exists():
            missing.append(cue['id'])
            continue
        shutil.copy2(src, dest / src.name)
        trimmed[cue['key']] = relative
    if missing:
        raise SystemExit(f'missing baked voices: {", ".join(missing[:8])}')
    (dest / 'manifest.json').write_text(json.dumps(trimmed, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'voice clips {len(trimmed)}/{len(manifest)}')


def write_readme(dest: Path) -> None:
    dest.write_text(
        '西行拾卷\n\n'
        '1. 安装语音依赖（只需一次）：python3 -m pip install -r requirements-voice.txt\n'
        '2. 双击「开始游戏.command」，或在本目录执行：\n'
        '   python3 voice_server.py --bind 127.0.0.1 --port 4174\n'
        '3. 浏览器打开 http://127.0.0.1:4174/\n'
        '4. 若只看画面、不需要神经配音，也可直接用浏览器打开 index.html。\n',
        encoding='utf-8',
    )


def write_launcher(dest: Path) -> None:
    dest.write_text(
        '#!/bin/bash\n'
        'cd "$(dirname "$0")"\n'
        'python3 voice_server.py --bind 127.0.0.1 --port 4174 &\n'
        'sleep 1\n'
        'open "http://127.0.0.1:4174/"\n'
        'wait\n',
        encoding='utf-8',
    )
    dest.chmod(0o755)


def main() -> None:
    if STAGE.exists():
        shutil.rmtree(STAGE)
    STAGE.mkdir(parents=True)

    assets = sorted(item for item in collect_assets() if (ROOT / item).exists())
    skipped = sorted(item for item in collect_assets() if not (ROOT / item).exists())
    if skipped:
        print('skip missing', ', '.join(skipped))

    png_to_webp = re.compile(r'(assets/[^"\')\s]+\.)png')
    for name in TEXT_FILES:
        text = (ROOT / name).read_text(encoding='utf-8')
        if name.endswith(('.html', '.js', '.css')):
            text = png_to_webp.sub(r'\1webp', text)
        (STAGE / name).write_text(text, encoding='utf-8')
    write_readme(STAGE / '游玩说明.txt')
    write_launcher(STAGE / '开始游戏.command')
    if FONT_DIR.exists():
        shutil.copytree(FONT_DIR, STAGE / 'assets' / 'fonts', dirs_exist_ok=True)
    copy_used_voices(STAGE / 'assets' / 'voice')

    def convert(relative: str) -> str:
        src = ROOT / relative
        dest = STAGE / relative
        if relative.endswith('.mp3'):
            compress_bgm(src, dest)
        else:
            compress_image(src, dest)
        return relative

    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(convert, relative) for relative in assets]
        for index, future in enumerate(as_completed(futures), 1):
            future.result()
            if index == 1 or index % 20 == 0 or index == len(assets):
                print(f'packed {index}/{len(assets)}')

    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    with zipfile.ZipFile(ZIP_PATH, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(STAGE.rglob('*')):
            if path.is_file():
                archive.write(path, path.relative_to(STAGE).as_posix())

    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(STAGE, DIST, ignore=shutil.ignore_patterns('游玩说明.txt', '开始游戏.command', 'voice_server.py', 'requirements-voice.txt', 'VOICE.md'))

    size = ZIP_PATH.stat().st_size
    print(f'assets {len(assets)}')
    print(f'stage {sum(p.stat().st_size for p in STAGE.rglob("*") if p.is_file()) / 1024 / 1024:.2f} MB')
    print(f'zip {ZIP_PATH} {size / 1024 / 1024:.2f} MB')
    if size > 50 * 1024 * 1024:
        raise SystemExit('zip exceeds 50 MB')


if __name__ == '__main__':
    main()
