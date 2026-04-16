# 7K-DB Content Addition Workflow

Follow these steps whenever a new Hero or Pet is added to the game.

## 1. Prepare Assets
Convert the game images to `.webp` format and name them using the following convention:
- **Heroes**: `[grade]_[name].webp` (e.g., `l+_mist.webp`, `l_rachel.webp`)
- **Pets**: `[grade]_[name].webp` (e.g., `l_rudy.webp`, `r_croa.webp`)

Place them in their respective folders:
- `public/heroes/`
- `public/pets/`

## 2. Sync with Database
Run the following command in your terminal to automatically register the new assets and generate slugs/stats:

```bash
node scripts/sync-registry.mjs
```

## 3. Review in Admin Dashboard
1. Go to your local site: `http://localhost:3000/admin/registry`
2. Log in as admin.
3. Find your new characters in the list.
4. Click the **Edit** button to fill in specific stats (Skill Priority, Base Stats, etc.) that the script couldn't auto-fill.

---

### Troubleshooting
- **Missing Slugs**: If you see a "Page Not Found" for a hero, run the sync script to ensure the `slug` is generated.
- **Wrong Defaults**: The sync script applies default stats (5% Crit / 150% Crit Dmg). You should always manually verify these via the Admin Edit button for new Legendary heroes.
