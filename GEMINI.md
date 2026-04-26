# GEMINI Instructions: 7k-db (Antigravity Protocol)

This document is the foundational mandate for all AI agent operations in `7k-db`. It defines the standards for meticulousness, accuracy, and validation while optimizing for performance and token efficiency.

## 1. Core Mandates

- **Surgical Verification:** Never assume code works. Use `run_shell_command` with **targeted** parameters (e.g., `vitest path/to/file.test.js`) to verify changes without excessive output.
- **Token Efficiency:** Always use "quiet" or "silent" flags (e.g., `--silent`, `--quiet`) when running CLI tools to prevent exceeding token limits.
- **Context Awareness:** Analyze related files in `src/lib`, `src/components`, and `src/app` before applying changes.
- **Robust Error Handling:** Every DB/API operation must include error handling and user feedback (e.g., `sonner`).

## 2. Definition of Done (DoD)

A task is complete ONLY when:

1.  **Targeted Verification:** Changes are tested and fulfill requirements using isolated tests.
2.  **Linting Passed:** Linting checks on **affected files** return no errors.
3.  **Tests Passed:** Specific tests for affected logic pass.
4.  **No Type Regressions:** TypeScript/JSDoc types are consistent and accurate.
5.  **Code Hygiene:** No debug logs (`console.log`), unused imports, or leftover "todo" comments.

## 3. Pre-flight Validation Checklist

- [ ] **Surgical Static Analysis:** Execute linting on modified files only (if possible).
- [ ] **Targeted Logic Verification:** Execute `npm run test -- <file_path>` for specific files.
- [ ] **Selective Build Check:** Run `npm run build` ONLY for major structural changes or before final delivery.
- [ ] **Edge Case Audit:** Handle null values, empty states, and network failures.
- [ ] **Security Audit:** Sanitize DB queries and protect sensitive data.

## 4. Technical Standards

- **Data Validation:** Use `zod` for API schemas and environment variables.
- **Database:** Use `mysql2` efficiently; ensure connection management and error catching.
- **UI:** Use `tailwind-merge` and `clsx`. Adhere to `next-themes` patterns.
- **React:** Follow React 19 patterns.

## 5. Interaction Protocol

- **Output Management:** If a command output is too large, summarize the results instead of printing the full log.
- **Proactive Decisions:** Consult the user for architectural changes.
- **Explanatory Validation:** Briefly state validation steps performed upon delivery.
- **Senior Mindset:** Anticipate failures and implement preventive logic.
