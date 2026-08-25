# 3. Dedicated Focus on Guild War Counter Matrix

Date: 2026-08-25

## Status

Accepted

## Context

After evaluating community needs and product complexity, the team decided to omit the standalone Team Builder & Exporter tool to streamline the user experience and concentrate resources directly on the **Guild War Counter Matrix & Defense Matcher**.

## Decision

1. **Omit Standalone Team Builder**:
   - Removed `/tools/team-builder` to keep the toolset lean, fast, and purpose-driven.
2. **Flagship Guild War Counter Matrix**:
   - Introduce interactive **Enemy Defense Hero Anchor Matchers** at the top of `/guild-war`.
   - Provide Category Tabs (`All Formations`, `Defense Meta & Counters`, `Attacker Formations`).
   - Deep integration with **Hero Quick Peek Modal** across both Defense and Counter formation slots.

## Consequences

- **Positive**:
  - Cleaner navigation without redundant external builders.
  - Users get direct actionable answers for GvG matches in fewer clicks.
