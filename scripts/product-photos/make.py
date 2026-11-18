"""Cut the owner's product posters into two square images per active perfume:

- <slug>-card.jpg   800x800: the "STATION PERFUME" title and the five bottles
                    on the tray, centred, ending just above the coloured name
                    band. This leaves out everything at the edges and on the
                    band: the aroma bubbles, the badges, and on brand posters
                    the other brand's bottle and its "Inspired by ..." caption.
                    The product name is set in the site's own type instead.
- <slug>-detail.jpg 800x800: a close-up of the middle bottles (hover image).

Needs Python 3 with Pillow (`pip install pillow`); not part of the npm build.
Usage (from the frontend folder, see README "Product photos"):

    python3 -I scripts/product-photos/make.py \
        ../Station-parfume-backend/seed/wangian.csv ~/Documents/gambar-parfum public/products

It prints the slugs it made; keep WITH_PHOTO in
src/features/catalog/product-photos.ts in line with that list.
"""

import csv
import io
import sys
from pathlib import Path

from PIL import Image

seed_csv, poster_dir, out_dir = map(Path, sys.argv[1:4])
out_dir.mkdir(parents=True, exist_ok=True)

# The seed names the 4 Exclusive photos exclusive-baru-N.jpg, but the files in
# the folder are named after their scents.
EXCLUSIVE_FILES = {
    "exclusive-1": "exclusive: scandal screet & dorsava & aquakiss.jpeg",
    "exclusive-2": "exclusive: mykonos monaco royal & dunhil blue & bacarat.jpeg",
    "exclusive-3": "exclusive: moonlight & opus black & greekgodnes.jpeg",
    "exclusive-4": "exclusive: c2 premiere man & avril lavigne.jpeg",
}

lines = [l for l in seed_csv.read_text(encoding="utf-8").splitlines(True) if not l.startswith("#")]
groups: dict[str, dict] = {}
for row in csv.DictReader(io.StringIO("".join(lines))):
    g = groups.setdefault(row["group_code"], {"image": row["image"], "active": True})
    if row["aktif"].strip().lower() == "tidak":
        g["active"] = False

SIZE = 800
made = 0
made_slugs = []
for slug, g in groups.items():
    if not g["active"]:
        continue
    im = Image.open(poster_dir / EXCLUSIVE_FILES.get(slug, g["image"])).convert("RGB")
    W, H = im.size

    # Card: square, from just above the title (2.5%) to above the band (78%).
    top, bottom = round(0.025 * H), round(0.78 * H)
    side = bottom - top
    left = round((W - side) / 2)
    card = im.crop((left, top, left + side, bottom)).resize((SIZE, SIZE), Image.LANCZOS)
    card.save(out_dir / f"{slug}-card.jpg", quality=82, optimize=True, progressive=True)

    # Detail: a square close-up of the middle bottles and their labels.
    side = round(0.52 * H)
    left, top = round((W - side) / 2), round(0.20 * H)
    detail = im.crop((left, top, left + side, top + side)).resize((SIZE, SIZE), Image.LANCZOS)
    detail.save(out_dir / f"{slug}-detail.jpg", quality=82, optimize=True, progressive=True)
    made += 1
    made_slugs.append(slug)

print(f"made {made} products:")
print(" ".join(made_slugs))
