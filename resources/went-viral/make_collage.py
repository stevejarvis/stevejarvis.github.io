"""Contact sheet of every repost found: thumbnail, title, channel, date, views."""
import json, re, textwrap
from PIL import Image, ImageDraw, ImageFont

reposts = json.load(open("reposts.json"))
OUT = "../../assets/images/went-viral/repost-wall.jpg"
FONT = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
f_title, f_meta = ImageFont.truetype(BOLD, 17), ImageFont.truetype(FONT, 15)

def clean(s):  # Arial has no emoji or CJK; drop what it can't draw
    return re.sub(r"[^\x20-\x7e‘-”…]", "", s).strip() or "(title is all emoji)"

COLS, TW, PAD, CAP = 5, 260, 12, 126
cell_w, cell_h = TW + PAD, TW + CAP + PAD
rows = -(-len(reposts) // COLS)
sheet = Image.new("RGB", (COLS * cell_w + PAD, rows * cell_h + PAD), "#111")
d = ImageDraw.Draw(sheet)
for i, r in enumerate(sorted(reposts, key=lambda r: r["date"])):
    x, y = PAD + (i % COLS) * cell_w, PAD + (i // COLS) * cell_h
    im = Image.open(f"thumbs/{r['id']}.jpg").convert("RGB")
    s = min(im.size)
    im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2)).resize((TW, TW))
    sheet.paste(im, (x, y))
    ty = y + TW + 6
    for line in textwrap.wrap(clean(r["title"]), 28)[:3]:
        d.text((x, ty), line, font=f_title, fill="#fff"); ty += 21
    n = r["views"]
    d.text((x, y + TW + CAP - 40), r["channel"], font=f_meta, fill="#f08c00")
    d.text((x, y + TW + CAP - 20), f"{r['date']} | {n:,} view{'s' if n != 1 else ''}", font=f_meta, fill="#f08c00")
sheet.save(OUT, quality=88)
print("wrote", OUT, sheet.size)
