import os
from PIL import Image

HERO_DIR = "public/heroes"
OUTPUT_DIR = ".agents/scratch/hero_analysis"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "hero_roles.txt")
GRADES = ["l++_", "l+_", "l_", "r_"]

ROLES = {
    "Attack": {"color": "Red", "rgb": (180, 50, 45)},
    "Magic": {"color": "Blue", "rgb": (57, 107, 192)},
    "Defense": {"color": "Bronze", "rgb": (137, 86, 50)},
    "Support": {"color": "Gold", "rgb": (214, 178, 44)},
    "Universal": {"color": "Purple", "rgb": (108, 70, 185)}
}

def get_role(img):
    w, h = img.size
    # Sample point at the center of the icon box (Bottom-left quadrant)
    # Based on observation, center is around 16% width and 58% height
    sx = int(w * 0.16)
    sy = int(h * 0.58)
    
    # Sample a small 5x5 region for better average
    try:
        region = img.crop((sx-2, sy-2, sx+2, sy+2)).convert("RGB")
        pixels = list(region.getdata())
        r = sum(p[0] for p in pixels) // len(pixels)
        g = sum(p[1] for p in pixels) // len(pixels)
        b = sum(p[2] for p in pixels) // len(pixels)
    except:
        # Fallback to single pixel if crop fails
        r, g, b = img.getpixel((sx, sy))[:3]

    # Find closest role by RGB distance
    min_dist = float('inf')
    best_role = "Unknown"
    
    for role, data in ROLES.items():
        tr, tg, tb = data["rgb"]
        dist = (r - tr)**2 + (g - tg)**2 + (b - tb)**2
        if dist < min_dist:
            min_dist = dist
            best_role = role
            
    # Heuristic refinement for borderline cases
    # Red is very distinct
    if r > 150 and r > g * 1.5 and r > b * 1.5: return "Attack"
    # Blue is very distinct
    if b > 150 and b > r * 1.5 and b > g * 1.1: return "Magic"
    # Purple (Universal) has high R and B but low G
    if r > 80 and b > 140 and g < 100: return "Universal"
    # Gold (Support) has high R and G
    if r > 180 and g > 150 and b < 100: return "Support"
    # Bronze (Defense) is darker brown
    if r > 100 and g > 60 and b < 100 and r > b * 1.5: return "Defense"
    
    return best_role

results = {role: [] for role in ROLES.keys()}
results["Unknown"] = []

if not os.path.exists(HERO_DIR):
    print(f"Error: {HERO_DIR} not found.")
    exit(1)

files = [f for f in os.listdir(HERO_DIR) if any(f.startswith(g) for g in GRADES)]
files.sort()

print(f"Scanning {len(files)} heroes...")

for filename in files:
    path = os.path.join(HERO_DIR, filename)
    try:
        with Image.open(path) as img:
            role = get_role(img)
            # Take the Hero Name from filename (remove grade and extension)
            # Example: l++_gelidus.webp -> Gelidus
            display_name = filename.split('_', 1)[1].replace('.webp', '').replace('_', ' ').title()
            results[role].append(f"{display_name} ({filename})")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("HERO ROLE TYPE ANALYSIS REPORT\n")
    f.write("==============================\n")
    f.write(f"Grades Scanned: {', '.join(GRADES).upper()}\n")
    f.write(f"Total Heroes Found: {len(files)}\n\n")
    
    for role in ["Attack", "Magic", "Defense", "Support", "Universal", "Unknown"]:
        heroes = results.get(role, [])
        if not heroes: continue
        f.write(f"--- {role.upper()} ({len(heroes)}) ---\n")
        for h in sorted(heroes):
            f.write(f"{h}\n")
        f.write("\n")

print(f"Analysis complete! Results saved to: {OUTPUT_FILE}")
