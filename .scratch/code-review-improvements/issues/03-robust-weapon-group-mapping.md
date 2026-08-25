# 03: Robust Weapon Group Mapping via Database Source of Truth

**What to build:** Ensure `getBuildSubmissionFormAssets()` in `src/lib/community-build-actions.ts` treats the `items.weapon_group` database column as the primary source of truth, with comprehensive set-based categorizations for any unmapped item images so weapon filtering never defaults incorrectly to Physical for Magic weapons.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Ensure all weapons in `items` table have accurate `weapon_group` ('Physical' or 'Magic').
- [x] Ensure `getBuildSubmissionFormAssets` properly normalizes item names and groups using `inferWeaponGroup`.
- [x] Verify Magic heroes see exclusively Magic weapons and Physical heroes see exclusively Physical weapons across the board.
