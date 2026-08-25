# 2. Guild War Counter Matrix, Hybrid URL-State Team Builder, and Lightweight Auth for Submissions

Date: 2026-08-25

## Status

Accepted

## Context

Following the strategic focus on interactive tools, we need concrete architecture decisions regarding:
1. The flagship combat utility to develop first.
2. The data serialization and visual export mechanism for custom teams.
3. The authentication barrier for community submissions.

## Decision

1. **Flagship Priority — Guild War Counter Matrix**:
   - Build an interactive **Defense Team Matcher & Counter Recommendation Engine** under `/guild-war`.
   - Users select enemy defense lineups (or top meta defense templates) to immediately reveal recommended counter teams, optimal skill orders, pet synergy, and win reliability ratings.

2. **Shareable Team Builder via URL-State + Canvas/DOM PNG Export**:
   - Implement client-side URL serialization (Base64/LZ-string encoded formation, hero slots, pet, and gear choices) allowing instant deep-link sharing with 0 database roundtrips.
   - Provide an in-browser card generator exporting stylized 1200x630px PNG graphics suitable for sharing on Discord and social platforms.
   - Future roadmap: Add optional Cloud Save for authenticated accounts.

3. **Authentication Strategy — Lightweight Credentials & Guest Submissions**:
   - Avoid third-party OAuth lock-in (e.g. Discord/Google).
   - Use simple internal credentials / guest submissions with an admin review queue in `/admin`.

## Consequences

- **Positive**:
  - Immediate value for guilds during active war days without friction.
  - Zero storage overhead for sharing millions of team variations via encoded URLs.
  - Low entry barrier for community contributors without requiring third-party OAuth configurations.
- **Negative**:
  - Large URL strings if gear metadata is overly verbose (mitigated by indexing items/heroes by IDs or short slugs).
  - Guest submissions will require basic rate limiting and moderation controls to prevent spam in the admin queue.
