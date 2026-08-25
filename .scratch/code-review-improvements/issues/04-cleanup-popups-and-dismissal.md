# 04: Remove Redundant Popups and Refine Daily Dismissal UX

**What to build:** Remove any obsolete recruitment popup in `/build`, and ensure the daily update announcement modal in `/` operates with clear separation between closing for the session and dismissing for the entire day.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Check `src/app/(main)/build/page.tsx` for any redundant contributor popups and remove if not requested.
- [x] Refine `UpdateAnnouncementModal.tsx` close/dismiss action handlers.
- [x] Verify clean build and test runtime interaction.
