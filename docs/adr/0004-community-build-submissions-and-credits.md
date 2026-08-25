# 4. Community Build Submissions and Moderation Pipeline

Date: 2026-08-25

## Status

Accepted

## Context

To scale hero gear guides and engage active competitive players across Discord and guilds, 7K-DB needs a crowd-sourced yet curated mechanism to receive optimal hero builds, attribute author credits, and prevent spam or unverified builds.

## Decision

1. **Submission Flow**:
   - Public users can open **"Suggest a Build"** on `/build`.
   - Players specify Hero, Weapons, Armor, Accessories & Refinements, Priority Substats, Tactical notes, and their In-Game / Discord Name (`author_name`, `author_contact`).
2. **Moderation Queue (`/admin/submissions`)**:
   - Submissions are captured in `community_build_submissions` table with status `pending`.
   - Admins can view full visual previews of proposed setups, approve them with 1-click (automatically committing to `builds` table with `author_name`), or reject with optional feedback.
3. **Attribution**:
   - Approved community builds proudly display `Build by: [Author Name]` in `/build` modal and `HeroQuickPeekModal`.

## Consequences

- High trust: only admin-approved builds become live.
- Community engagement: contributors receive visible credit on the site.
