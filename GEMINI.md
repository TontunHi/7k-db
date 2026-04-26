# GEMINI Instructions: 7k-db (Antigravity Protocol)

This document is the foundational mandate for all AI agent operations in `7k-db`. It defines the standards for meticulousness, accuracy, and validation required before delivery.

## 1. Core Mandates
- **Always Verify:** Never assume code works. Use `run_shell_command` to verify syntax, linting, and tests.
- **Context Awareness:** Analyze related files in `src/lib`, `src/components`, and `src/app` before applying changes.
- **Robust Error Handling:** Every DB/API operation must include error handling and user feedback (e.g., `sonner`).

## 2. Definition of Done (DoD)
A task is complete ONLY when:
1.  **Functional Verification:** Changes are tested and fulfill requirements.
2.  **Linting Passed:** `npm run lint` returns no errors.
3.  **Tests Passed:** `npm run test` (Vitest) passes for all affected logic.
4.  **No Type Regressions:** TypeScript/JSDoc types are consistent and accurate.
5.  **Code Hygiene:** No debug logs (`console.log`), unused imports, or leftover "todo" comments.

## 3. Pre-flight Validation Checklist
- [ ] **Static Analysis:** Execute `npm run lint`.
- [ ] **Logic Verification:** Execute `npm run test`.
- [ ] **Build Check:** Run `npm run build` for significant changes to ensure optimization success.
- [ ] **Edge Case Audit:** Handle null values, empty states, and network failures.
- [ ] **Security Audit:** Sanitize DB queries and protect sensitive data.

## 4. Technical Standards
- **Data Validation:** Use `zod` for API schemas and environment variables.
- **Database:** Use `mysql2` efficiently; ensure connection management and error catching.
- **UI:** Use `tailwind-merge` and `clsx`. Adhere to `next-themes` patterns.
- **React:** Follow React 19 patterns.

## 5. Interaction Protocol
- **Proactive Decisions:** Consult the user for architectural changes.
- **Explanatory Validation:** Briefly state validation steps performed upon delivery.
- **Senior Mindset:** Anticipate failures and implement preventive logic.
