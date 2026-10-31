#!/usr/bin/env python3
"""Remove light silhouette halos, glow blobs, and checker residue from fighter sheets."""

from pathlib import Path
from PIL import Image

SHEETS = [
    'assets/minigames/fighters/wukong/great-sage/action-sheet.png',
    'assets/minigames/fighters/wukong/pilgrim-circlet/action-sheet.png',
    'assets/minigames/fighters/heaven-soldier/action-sheet.png',
    'assets/minigames/fighters/nezha/action-sheet.png',
    'assets/minigames/fighters/black-bear/action-sheet.png',
    'assets/minigames/fighters/red-boy/action-sheet.png',
    'assets/minigames/fighters/bull-demon/warrior-action-sheet.png',
    'assets/minigames/fighters/bull-demon/true-form-action-sheet.png',
]


def luma(r, g, b):
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def sat(r, g, b):
    high = max(r, g, b)
    low = min(r, g, b)
    return 0 if high == 0 else (high - low) / high


def clean(path):
    image = Image.open(path).convert('RGBA')
    width, height = image.size
    pix = image.load()
    removed = 0

    def get(x, y):
        if x < 0 or y < 0 or x >= width or y >= height:
            return (0, 0, 0, 0)
        return pix[x, y]

    def is_air(pixel):
        return pixel[3] < 18

    def is_checker(r, g, b, a):
        if a < 8:
            return False
        gray = abs(r - g) < 20 and abs(g - b) < 20 and 90 <= r <= 175
        white = r > 205 and g > 205 and b > 205 and sat(r, g, b) < 0.1
        return gray or white

    for _ in range(2):
        doomed = []
        for y in range(height):
            for x in range(width):
                r, g, b, a = pix[x, y]
                if a < 8:
                    continue
                ring = [get(x + dx, y + dy) for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1))]
                air = sum(1 for pixel in ring if is_air(pixel))
                if air == 0:
                    continue
                light = luma(r, g, b)
                chroma = sat(r, g, b)
                solid = []
                for dy in (-2, -1, 0, 1, 2):
                    for dx in (-2, -1, 0, 1, 2):
                        if dx == 0 and dy == 0:
                            continue
                        pixel = get(x + dx, y + dy)
                        if pixel[3] >= 80:
                            solid.append(pixel)
                if not solid:
                    if light >= 118 or is_checker(r, g, b, a):
                        doomed.append((x, y))
                    continue
                interior = sum(luma(sr, sg, sb) for sr, sg, sb, _ in solid) / len(solid)
                halo = light >= 120 and light >= interior + 24
                pale = chroma <= 0.16 and light >= 150
                speck = air >= 2 and light >= 190 and chroma <= 0.28
                if halo or pale or speck or is_checker(r, g, b, a):
                    doomed.append((x, y))
        for x, y in doomed:
            pix[x, y] = (0, 0, 0, 0)
            removed += 1

    # Floating checker / glow islands sitting in transparent air.
    doomed = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = pix[x, y]
            if a < 8:
                continue
            if not is_checker(r, g, b, a) and not (luma(r, g, b) >= 188 and sat(r, g, b) <= 0.12):
                continue
            nearby = [get(x + dx, y + dy) for dy in range(-2, 3) for dx in range(-2, 3)]
            empty = sum(1 for pixel in nearby if is_air(pixel))
            if empty >= 12:
                doomed.append((x, y))
    for x, y in doomed:
        pix[x, y] = (0, 0, 0, 0)
        removed += 1

    image.save(path, 'PNG')
    return removed


def main():
    root = Path(__file__).resolve().parents[1]
    for relative in SHEETS:
        path = root / relative
        removed = clean(path)
        print(f'{relative}: removed {removed} fringe pixels')


if __name__ == '__main__':
    main()
