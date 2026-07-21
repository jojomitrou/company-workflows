# Changelog

One entry per skill per release. No version bump ships without a line here — see `docs/FORK-PROBLEM-RESOLUTION.md` §7 rule 5.

---

## 2026-07-21 — prep v2.4, wrap v2.2, week/month/quarter v2.2 (Phase B1)

Implements `docs/FORK-PROBLEM-RESOLUTION.md` — the actual zone-aware update engine, replacing the whole-file `Copy-Item -Force` that A1 left as a known limitation.

- **`/prep`** — Phase 1d rewritten from the ground up:
  - New `.workflows.json` config, replacing the three loose dotfiles (`.workflows-repo`, `.company`, `.skills-hash`), with automatic one-time migration for existing installs (backs them up as `.bak`, never deletes).
  - **Anchored extract-reinject update algorithm**: on every run, checks `company-workflows` HEAD directly (shallow clone), and for each of the 6 core skills — extracts personal-zone content from the local file, verifies the company-zone hash against the last-recorded baseline (backs up + loudly flags any hand-edit instead of silently discarding or silently keeping it), takes the upstream file wholesale, and reinjects personal content by anchor name. A removed/renamed anchor recovers its content at the end of the file under "Recovered personal content" rather than losing it.
  - One-time cleanup offer for existing installs: counts non-core skills tracked in the personal repo from before the A1 allowlist fix, offers to remove them (tagged first, so recoverable).
  - Setup guide's Step 7 install one-liner is now install-only — `/prep` is the only update channel, documented in both places.
- **`/wrap`, `/week`, `/month`, `/quarter`** — `[personal_path]` now resolved from `.workflows.json` instead of the old `.workflows-repo` dotfile.
- **Test matrix** — all 8 cases from `docs/FORK-PROBLEM-RESOLUTION.md` §8 run and passing; evidence in `docs/test-evidence/2026-07-21-b1-test-matrix.md`. Caught and fixed one real bug in the process: Windows PowerShell 5.1's default `Get-Content`/`Set-Content` encoding mangles em-dashes/arrows — the algorithm now specifies explicit UTF-8 (no BOM) reads/writes throughout.

---

## 2026-07-21 — setup guide v2 (Phase A2)

Implements `docs/UPGRADE-PROPOSAL_2026-07-06.md` §1.2. `claude-code-setup-guide.md` restructured into **Core Setup (Steps 1-8, everyone)** → **Role Add-ons** (Data & Analytics, Engineering, Product & PM, Marketing, Knowledge Base) → **Optional Extras** → **Reference**. Changes:

- Gmail, Google Calendar, and Jira (Atlassian) wired up as a new Core Step 5 — these are claude.ai **Connectors** (OAuth, enabled once on claude.ai → Settings → Connectors, then inherited into Claude Code), not a separate MCP install. This closes the gap where `/prep` checked these every morning but the guide never told anyone how to connect them.
- Fixed the dead "pm-skills plugin" Jira reference (old Step 8 pointed at a Step 10 that never installed any such plugin) — replaced with the real Connectors mechanism.
- Fixed the BigQuery MCP setup: was `set BIGQUERY_PROJECT_ID=` (cmd syntax, does nothing in PowerShell and doesn't persist) — now `claude mcp add bigquery -e BIGQUERY_PROJECT_ID=... -e BIGQUERY_LOCATION=EU -- npx ...`, which bakes the env vars into the MCP's own config.
- Fixed duplicate step numbering (two "4."s in old Step 2, two "5."s in old Step 4).
- Permission-mode guidance rewritten: default is ask; Auto is presented as opt-in for repetitive low-risk work, with a concrete "what this means" example, instead of a blanket recommendation for every new user regardless of role.
- Added a new Step 8 — "Verify Your Install": one version-check command per tool, then a real `/prep` run as the end-to-end test.
- Step 10's install one-liner now installs 6 skills (`radar` included) — automatic already, since it globs `skills/*`; only the doc's wording needed updating.
- Extracted the ~220-line skill catalogue (old Step 13) into a standalone `skills-catalogue.md`, reorganized by role, linked from the main guide's Reference section.
- Moved Obsidian from the numbered core path into Role Add-ons ("Knowledge Base, anyone") since no core skill depends on it.

---

## 2026-07-21 — radar v1.0 (new skill), prep v2.1, wrap v2.1

- **`/radar` (new)** — generalized from a personal keyword→repo lookup skill into a 6th company skill. Ships with an empty table (one example row for format reference). Its distinctive feature is the **learning loop**: on an unmatched keyword it does the normal broad search once, explains what it's doing, and caches a `tentative` row; on that keyword's second occurrence it uses the cached row and asks exactly one confirming question, then flips the row to `confirmed`; from the third occurrence on it's silent. A `confirmed` row that turns out wrong demotes back to `tentative` rather than staying wrong silently. This is the "never repeat yourself more than twice" pattern: occurrence 1 = intro (explain the action + what we're trying to achieve), occurrence 2 = confirm, occurrence 3+ = cached and silent.
- **`/prep`** — bootstrap (1d) and sync-check (1d) skill lists extended from 5 to 6 core skills to include `radar`.
- **`/wrap`** — Step 1b's `$companySkills` allowlist extended to include `radar`.

`skills/*` on the `main` branch is copied wholesale by the Step-10 install one-liner, so adding `skills/radar/` here means every future first-time install picks it up automatically — no setup-guide change needed for that part.

---

## 2026-07-21 — v2.0 (Phase A1, all 5 skills)

Implements the Phase A1 rewrites from `docs/UPGRADE-PROPOSAL_2026-07-06.md` §1.3–1.7. Personal-zone anchors (`<!-- personal:NAME:start/end -->`) are added as extension points in this release, but the automated anchored extract-reinject *update engine* that reads/preserves them on future syncs is Phase B1 (`docs/FORK-PROBLEM-RESOLUTION.md`) — not yet built. Until B1 ships, `/prep`'s skill sync remains a whole-file copy; anyone who has hand-edited a company zone should track that manually.

- **`/prep`** — added Phase 0 (boundary-day orchestration: offers `/week`/`/month`/`/quarter` instead of asking its own Monday/Friday questions); confirm-before-push replaces silent auto-push in 1a/1b; refuses to repo-ify home-level folders; deleted Phase 5 (superseded by "run `/wrap`"); task files moved from `~/.claude` to `[personal_path]\tasks\`; added personal-zone anchors `project-state`, `daily-checks`, `briefing-extras`.
- **`/wrap`** — confirm-before-push in Step 1; Step 1b is now an explicit skill allowlist (5 company skills + `origin: personal`) instead of a whole-folder glob, and also commits the `tasks/` folder (this is where the golden rule is now actually enforced for task history); Step 2 proposes completions from this session's commits before asking; added personal-zone anchor `extra-saves`.
- **`/week`** — PLAN mode reads the month plan block and asks which goal each week goal advances; goals now carry `measure:` and `advances:`; appends a machine-readable `yaml` plan/retro block; RETRO scores against the captured measure and computes a `rollup:` per parent goal; commit target fixed to the personal repo (was the arbitrary current folder); week number defined as ISO 8601; added personal-zone anchor `personal-context`.
- **`/month`** — same cascade pattern one level up (reads quarter plan, tags `advances: q-NN`); RETRO window fixed to the actual last 3 calendar days of the month (was a hardcoded 28–31 range); commit target fixed to the personal repo; added personal-zone anchor `personal-context`.
- **`/quarter`** — same cascade pattern (reads company targets when a company repo exists — none does yet, skipped silently; otherwise `standalone`); commit target fixed to the personal repo; added personal-zone anchor `personal-context`.

Task-line schema introduced (used by all 5 skills): `- [ ] {id} | {M/S/L} | {text} | added:{date} | target:{goal-id|—}`.
