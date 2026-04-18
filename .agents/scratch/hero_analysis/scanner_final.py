import os
from PIL import Image

HERO_DIR = "public/heroes"
OUTPUT_DIR = ".agents/scratch/hero_analysis"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "hero_roles_final.txt")
GRADES = ["l++_", "l+_", "l_", "r_"]

def get_dominant_role_color(img):
    w, h = img.size
    left, top, right, bottom = int(w * 0.05), int(h * 0.50), int(w * 0.25), int(h * 0.65)
    
    icon_area = img.crop((left, top, right, bottom)).convert("RGB")
    pixels = list(icon_area.getdata())
    
    counts = {"Attack": 0, "Magic": 0, "Defense": 0, "Support": 0, "Universal": 0}
    
    for r, g, b in pixels:
        # Attack (Red): R is dominant
        if r > 130 and r > g * 1.5 and r > b * 1.5:
            counts["Attack"] += 1
        # Universal (Purple): R and B are BOTH high, G is low
        elif r > 80 and b > 100 and r > g * 1.2 and b > g * 1.2 and abs(r-b) < 100:
            counts["Universal"] += 1
        # Magic (Blue): B is dominant, R is low
        elif b > 130 and b > r * 1.5 and b > g * 1.1:
            counts["Magic"] += 1
        # Support (Gold): R and G are high, B is low
        elif r > 160 and g > 140 and b < 120:
            counts["Support"] += 1
        # Defense (Bronze/Brown): R and G are moderate, B is low, R > G
        elif r > 80 and g > 50 and b < 80 and r > g * 1.1:
            counts["Defense"] += 1
            
    best_role = max(counts, key=counts.get)
    if counts[best_role] < 5: 
        return "Unknown"
    return best_role

results = {role: [] for role in ["Attack", "Magic", "Defense", "Support", "Universal", "Unknown"]}

files = [f for f in os.listdir(HERO_DIR) if any(f.startswith(g) for g in GRADES)]
files.sort()

for filename in files:
    path = os.path.join(HERO_DIR, filename)
    try:
        with Image.open(path) as img:
            role = get_dominant_role_color(img)
            display_name = filename.split('_', 1)[1].replace('.webp', '').replace('_', ' ').title()
            results[role].append(f"{display_name} ({filename})")
    except Exception as e:
        print(f"Error processing {filename}: {e}")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("HERO ROLE ANALYSIS REPORT (FINAL VERIFIED)\n")
    f.write("=========================================\n\n")
    for role in ["Attack", "Magic", "Defense", "Support", "Universal", "Unknown"]:
        heroes = results[role]
        if not heroes: continue
        f.write(f"--- {role.upper()} ({len(heroes)}) ---\n")
        for h in sorted(heroes):
            f.write(f"{h}\n")
        f.write("\n")

print(f"Done! Final verified results written to {OUTPUT_FILE}")
