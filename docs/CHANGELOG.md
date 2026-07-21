# Changelog

One entry per skill per release. No version bump ships without a line here — see `docs/FORK-PROBLEM-RESOLUTION.md` §7 rule 5.

---

## 2026-07-21 — v2.0 (Phase A1, all 5 skills)

Implements the Phase A1 rewrites from `docs/UPGRADE-PROPOSAL_2026-07-06.md` §1.3–1.7. Personal-zone anchors (`<!-- personal:NAME:start/end -->`) are added as extension points in this release, but the automated anchored extract-reinject *update engine* that reads/preserves them on future syncs is Phase B1 (`docs/FORK-PROBLEM-RESOLUTION.md`) — not yet built. Until B1 ships, `/prep`'s skill sync remains a whole-file copy; anyone who has hand-edited a company zone should track that manually.

- **`/prep`** — added Phase 0 (boundary-day orchestration: offers `/week`/`/month`/`/quarter` instead of asking its own Monday/Friday questions); confirm-before-push replaces silent auto-push in 1a/1b; refuses to repo-ify home-level folders; deleted Phase 5 (superseded by "run `/wrap`"); task files moved from `~/.claude` to `[personal_path]\tasks\`; added personal-zone anchors `project-state`, `daily-checks`, `briefing-extras`.
- **`/wrap`** — confirm-before-push in Step 1; Step 1b is now an explicit skill allowlist (5 company skills + `origin: personal`) instead of a whole-folder glob, and also commits the `tasks/` folder (this is where the golden rule is now actually enforced for task history); Step 2 proposes completions from this session's commits before asking; added personal-zone anchor `extra-saves`.
- **`/week`** — PLAN mode reads the month plan block and asks which goal each week goal advances; goals now carry `measure:` and `advances:`; appends a machine-readable `yaml` plan/retro block; RETRO scores against the captured measure and computes a `rollup:` per parent goal; commit target fixed to the personal repo (was the arbitrary current folder); week number defined as ISO 8601; added personal-zone anchor `personal-context`.
- **`/month`** — same cascade pattern one level up (reads quarter plan, tags `advances: q-NN`); RETRO window fixed to the actual last 3 calendar days of the month (was a hardcoded 28–31 range); commit target fixed to the personal repo; added personal-zone anchor `personal-context`.
- **`/quarter`** — same cascade pattern (reads company targets when a company repo exists — none does yet, skipped silently; otherwise `standalone`); commit target fixed to the personal repo; added personal-zone anchor `personal-context`.

Task-line schema introduced (used by all 5 skills): `- [ ] {id} | {M/S/L} | {text} | added:{date} | target:{goal-id|—}`.
