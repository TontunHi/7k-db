# 1. Interactive Tools, Guild War / Total War Focus, and Moderated Community Contributions

Date: 2026-08-25

## Status

Accepted

## Context

7k-db has established a robust core database of heroes, boss guides, gear builds, and admin editing suites. To transition from a static guide into a high-engagement daily hub for players and guilds, we must expand interactive utilities and streamline content updates without compromising data quality.

## Decision

1. **Interactive Tools as Core Pillar**:
   - Prioritize a **Shareable Team Builder & Card Exporter** (allowing users to create, tweak, and share compositions via encoded URLs or PNG cards).
   - Prioritize **Guild War Counter Matrix** and **Total War 3-Team Planner** as the deepest tactical tools.

2. **Moderated Community Contribution Pipeline**:
   - Retain curated admin authority while introducing a community submission queue.
   - Submissions from users or guild members undergo an approval workflow before appearing in public meta hubs.

3. **Domain Vocabulary & Documentation**:
   - Establish `CONTEXT.md` as the single source of truth for domain terms.

## Consequences

- **Positive**:
  - Higher viral user engagement and sharing across Discord and community channels.
  - Less operational bottleneck on a single administrator for meta updates.
  - Clear structural boundaries between public viewing, user composition tools, and admin moderation.
- **Negative**:
  - Requires implementing authentication / role authorization for submissions, image generation pipelines for exports, and validation logic preventing hero overlap in multi-team modes.
