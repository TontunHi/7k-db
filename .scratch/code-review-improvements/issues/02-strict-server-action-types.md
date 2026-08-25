# 02: Strict Typing and Validation on Server Actions

**What to build:** Refactor `src/lib/community-build-actions.ts` to replace `rawData: any` in `submitCommunityBuild` with `z.infer<typeof CommunityBuildSubmissionSchema>` / `unknown`, and ensure types align strictly with the schema in `src/lib/validation.ts`.

**Blocked by:** 01: Centralize Stat Constants and Domain Types

**Status:** done

- [x] Type `submitCommunityBuild` parameter with `CommunityBuildSubmissionInput` (inferred from `CommunityBuildSubmissionSchema`).
- [x] Ensure `approveCommunityBuild` and `getCommunityBuildSubmissions` are strictly typed without `any` leaks.
- [x] Verify validation error handling remains clear and user-friendly.
