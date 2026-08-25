# Seven Knights Re:Birth DB (7k-db) Domain Model

This document serves as the canonical domain glossary for the 7k-db project. It outlines the ubiquitous language, terminology, and domain boundaries used across the codebase, UI, and documentation.

---

## 1. Core Hero & Gear Terminology

### Hero
An in-game playable character defined by:
- **Slug**: Unique identifier (e.g. `l+_teo`, `l_shane`, `r_evan`). Prefixed by grade.
- **Grade**: Rarity tier (`C`, `UC`, `R`, `L`, `L+`, `L++`, `AR`, `AL`, `AL+`, `AL++`).
- **Type**: Hero role/archetype (`Attack`, `Magic`, `Defense`, `Support`, `Universal`).
- **Skill Priority**: Ordered sequence of hero skills (1, 2, 3) executed during combat.

### Build
A recommended gear configuration for a hero, tailored to specific modes:
- **Weapons**: Up to 2 weapon slots, specifying weapon image/name and main stat (e.g. `Crit Damage`, `Weakness Damage`).
- **Armors**: Up to 2 armor slots, specifying armor image/name and main stat (e.g. `All Attack (%)`, `Max HP`).
- **Accessories**: 3–4 accessory items, with optional **Refined Accessory** overlay/upgrade.
- **Priority Substats**: Ordered list of ideal substat rolls (e.g. Speed, Crit Damage, Lethal Chance).
- **Mode Tag**: Target game modes for the build (`PVE`, `PVP`, `Castle Rush`, `Advent`, etc.).

---

## 2. Team & Formation Terminology

### Formation
A tactical positioning template comprising 5 hero slots arranged in rows (Front / Back):
- Examples: `1-4` (1 Front, 4 Back), `4-1` (4 Front, 1 Back), `2-3`, `3-2`, `1-1-3`.

### Team Set
A complete deployment configuration for a specific boss, stage, or combat mode:
- **Heroes**: Exactly 5 hero assignments (or empty slots).
- **Formation**: The active formation template.
- **Pet**: The assigned pet buffing the team.
- **Speed Order (Selection Order)**: The strict sequence of hero actions/speed priorities.
- **Skill Rotation**: Tactical step-by-step turn sequence.
- **Video Reference**: Direct gameplay demonstration link (e.g., YouTube).

---

## 3. Game Modes

### Advent Expedition (AE)
High-difficulty end-game boss encounters featuring multi-phase mechanics (e.g., Phase 1 & Phase 2) and variable team compositions.

### Castle Rush (CR)
Daily rotating guild boss challenges (Monday through Sunday) featuring the Seven Knights bosses (Kris, Rudy, Eileene, Rachel, Dellons, Jave, Spike).

### Boss Raids
Fixed raid boss encounters (Destroyer Gaze, Ox King, Iron Devourer, Calistra, Astrea, Leonid).

### Guild War (GW)
Asynchronous GvG combat mode featuring offensive counters against popular defensive team formations.
- **Defense Team**: Standard defensive composition deployed in guild castles.
- **Counter Team**: Optimized offensive composition designed to reliably defeat specific defense lineups.

### Total War
Endurance combat mode requiring **3 distinct, non-overlapping teams** (Team 1, Team 2, Team 3) where heroes and key items cannot be reused across teams.

---

## 4. User Interaction & Tooling Concepts

### Hero Quick Peek
An instant modal/drawer revealing a hero's full profile, multi-build gear loadouts, and skill priority without full page reloads.

### Shareable Team Card
An interactive or exported visual representation of a team configuration that can be shared via direct URL with deep-link state or downloaded as high-res PNG.

### Community Submission Queue
A staging pipeline where registered users/guild members propose team configurations or gear builds for admin moderation and approval before public publishing.
