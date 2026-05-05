# 7K-DB Project Master Rules
**Mission:** Consolidate all project mandates into a single source of truth for AI operations.

## 📋 Core Mandates (from GEMINI.md)
- **Surgical Verification:** Use `npm run test -- <file>` for targeted verification.
- **Token Efficiency:** Use `--silent` or `--quiet` flags.
- **Robust Error Handling:** Every DB/API operation must include `sonner` feedback.
- **Definition of Done:** Targeted verification + Linting + Tests + No Type Regressions + Code Hygiene.

## 🎨 UI/UX Guidelines (from AI_BRIEF.md & design.md)
- **Styling:** CSS Modules (`[name].module.css`) + CSS Variables from `globals.css`.
- **Theming:** Full Dark/Light mode support. No hardcoded colors.
- **Layout:** Mobile-First, Modern, High-End, Clean whitespace.
- **Interactions:** 0.2s smooth transitions, hover states, premium feel.

## 📂 Project Structure
- `src/app`: App Router pages and layouts.
- `src/components`: Modular UI components (with matching `.module.css`).
- `src/lib`: Server Actions, DB logic, and shared utilities.
- `scripts/`: Maintenance and migration scripts.

## 🛠 Verification Commands
- **Linting:** `npm run lint` (Targeted if possible).
- **Testing:** `npm run test -- src/path/to/file.test.js`.
- **Build:** `npm run build` (Major changes only).
