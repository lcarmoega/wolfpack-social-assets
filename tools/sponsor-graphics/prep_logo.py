"""Make a transparent-background copy of the club logo (remove edge-connected white)."""
import sys
from collections import deque
from PIL import Image
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
h, w, _ = a.shape
mn = a.min(axis=2)
cand = mn > 200  # near-white
seen = np.zeros((h, w), bool)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if cand[y, x] and not seen[y, x]:
            seen[y, x] = True; q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if cand[y, x] and not seen[y, x]:
            seen[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = True; q.append((ny, nx))

alpha = np.full((h, w), 255, np.float32)
# background region: fully transparent where pure white, partial where tinted
bg = seen
whiteness = (mn.astype(np.float32) - 200) / 30.0
alpha[bg] = np.clip(1 - whiteness[bg], 0, 1) * 255
# un-premultiply the white out of partially transparent pixels
rgb = a.astype(np.float32)
al = alpha[..., None] / 255.0
safe = np.where(al > 0.02, al, 1)
rgb = np.where(al > 0.02, (rgb - 255 * (1 - al)) / safe, rgb)
rgb = np.clip(rgb, 0, 255)
out = np.dstack([rgb, alpha]).astype(np.uint8)
Image.fromarray(out, "RGBA").save(dst)
print("saved", dst)
