# 01: Centralize Stat Constants and Domain Types

**What to build:** Create a centralized domain stats module (`src/lib/constants/stats.ts`) that exports all stats keys, labels, icons, dedicated stat options, and typed helper functions. Refactor `CommunityBuildModal.tsx` and `BuildEditorModal.tsx` to consume this single source of truth, removing duplicated definitions and magic array lengths.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Create `src/lib/constants/stats.ts` with `MIN_STATS_KEYS`, `AVAILABLE_SUBSTATS`, `DEDICATED_STATS_OPTIONS`, `getDedicatedStatIcon`, and `DedicatedStatsArray` type.
- [x] Refactor `src/components/build/CommunityBuildModal.tsx` to import constants and helper from `src/lib/constants/stats.ts`.
- [x] Refactor `src/components/admin/BuildEditorModal.tsx` to import constants from `src/lib/constants/stats.ts`.
- [x] Verify clean build with zero TypeScript errors.
