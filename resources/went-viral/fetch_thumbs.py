"""Download each repost's thumbnail into thumbs/ (needed by make_collage.py; not committed)."""
import json, os, subprocess

os.makedirs("thumbs", exist_ok=True)
for r in json.load(open("reposts.json")):
    out = f"thumbs/{r['id']}.jpg"
    for variant in ("oar2", "hq720", "mqdefault"):
        subprocess.run(["curl", "-sf", "-m", "15", "-o", out, f"https://i.ytimg.com/vi/{r['id']}/{variant}.jpg"])
        if os.path.exists(out) and os.path.getsize(out) > 2000:
            break
