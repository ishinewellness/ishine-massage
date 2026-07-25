from PIL import Image
import os

src = 'src_logo_2.png'  # brand-style logo
im = Image.open(src).convert('RGBA')
px = im.load(); w, h = im.size

# Remove paper background: light AND low saturation
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        mx, mn = max(r, g, b), min(r, g, b)
        if mx > 180 and (mx - mn) < 60:
            px[x, y] = (r, g, b, 0)

# find gold graphic bbox (sun + moon)
minx, miny, maxx, maxy = w, h, 0, 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        if r > 150 and 110 < g < 205 and b < 150 and r - b > 35:
            minx = min(minx, x); maxx = max(maxx, x)
            miny = min(miny, y); maxy = max(maxy, y)

pad = 25
minx = max(0, minx - pad); miny = max(0, miny - pad)
maxx = min(w, maxx + pad); maxy = min(h, maxy + pad)
crop = im.crop((minx, miny, maxx, maxy))
os.makedirs('src/assets', exist_ok=True)
crop.save('src/assets/logo.png')
os.makedirs('public', exist_ok=True)
crop.save('public/logo.png')
print('saved logo', crop.size)
