"""Unit chart: one square per YouTube repost, stacked by month. Writes an SVG."""
import json
from collections import defaultdict
from datetime import date

reposts = json.load(open("reposts.json"))
OUT = "../../assets/images/went-viral/reposts-by-month.svg"

start, end = (2025, 3), (2026, 10)
months = []
y, m = start
while (y, m) <= end:
    months.append((y, m))
    m += 1
    if m > 12:
        y, m = y + 1, 1

by_month = defaultdict(list)
for r in reposts:
    d = date.fromisoformat(r["date"])
    by_month[(d.year, d.month)].append(r)

W, H = 900, 300
L, R, T, B = 50, 20, 60, 70
col_w = (W - L - R) / len(months)
sq = min(col_w - 4, 30)
base = H - B
MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Helvetica,Arial,sans-serif" font-size="12">',
     f'<rect width="{W}" height="{H}" fill="#fff"/>',
     f'<text x="{L}" y="24" font-size="16" font-weight="bold" fill="#222">YouTube reposts of one roller race, by month posted</text>',
     f'<text x="{L}" y="42" fill="#666">each square is one repost found; hover for channel and views</text>']

# y labels: count, centered on the nth square of a stack
for n in range(1, 4):
    o.append(f'<text x="{L-8}" y="{base-n*(sq+3)+3+sq/2+4}" text-anchor="end" fill="#888">{n}</text>')
o.append(f'<line x1="{L}" x2="{W-R}" y1="{base}" y2="{base}" stroke="#999"/>')

for i, (y, m) in enumerate(months):
    cx = L + i * col_w + col_w / 2
    if m in (3, 6, 9, 12) or i == len(months) - 1:
        o.append(f'<text x="{cx}" y="{base+18}" text-anchor="middle" fill="#444">{MN[m-1]}</text>')
        if m == 3 or i == 0:
            o.append(f'<text x="{cx}" y="{base+34}" text-anchor="middle" fill="#444" font-weight="bold">{y}</text>')
    for k, r in enumerate(sorted(by_month[(y, m)], key=lambda r: r["date"])):
        top = base - (k + 1) * (sq + 3) + 3
        big = r["views"] >= 1_000_000
        fill = "#d9480f" if big else "#1c7ed6"
        o.append(f'<rect x="{cx-sq/2}" y="{top}" width="{sq}" height="{sq}" rx="3" fill="{fill}">'
                 f'<title>{r["channel"]}, {r["date"]}: {r["views"]:,} views, "{r["title"]}"</title></rect>')

# annotation: the Instagram original
ix = L + col_w / 2
o.append(f'<line x1="{ix}" x2="{ix}" y1="{T}" y2="{base+3}" stroke="#d9480f" stroke-dasharray="3 3"/>')
o.append(f'<text x="{ix+6}" y="{T+4}" fill="#d9480f">Mar 27 2025: original Instagram reel</text>')
o.append(f'<text x="{ix+6}" y="{T+19}" fill="#d9480f">first YouTube repost: 3 days later, 39.9M views</text>')

# legend
o.append(f'<rect x="{L}" y="{H-18}" width="10" height="10" rx="2" fill="#d9480f"/><text x="{L+15}" y="{H-9}" fill="#444">1M+ views</text>')
o.append(f'<rect x="{L+95}" y="{H-18}" width="10" height="10" rx="2" fill="#1c7ed6"/><text x="{L+110}" y="{H-9}" fill="#444">under 1M</text>')
o.append(f'<text x="{W-R}" y="{H-9}" text-anchor="end" fill="#888">data as of 2026-10-02</text>')
o.append('</svg>')
open(OUT, "w").write("\n".join(o))
print("wrote", OUT, len(reposts), "reposts")
