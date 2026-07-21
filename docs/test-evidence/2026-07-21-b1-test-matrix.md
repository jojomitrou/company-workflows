# B1 Test Matrix — Evidence

**Date:** 2026-07-21 · **Run against:** the real `prep`/`wrap`/`week`/`month`/`quarter`/`radar` skill files and the real `company-workflows`/`daily_workflows` repos on this machine, plus synthetic fixtures for the 3 cases that would otherwise require mutating shipped upstream content or destroying a real account setup. Test numbers match `docs/FORK-PROBLEM-RESOLUTION.md` §8.

---

## Test 1 — Fresh install → bootstrap
**Method:** reasoned/structural, not re-run live (a from-scratch bootstrap would mean deleting the real `daily_workflows` GitHub repo and `.workflows.json` — destructive to a real, in-use setup). The bootstrap procedure (Phase 1d, "does not exist" branch) is structurally identical to the migrate branch actually exercised in Test 8 — same steps (create/clone repo, copy 6 skills, tasks folder, compute hashes, write `.workflows.json`), minus the dotfile-reading step. Test 8 proves that shape end-to-end.
**Verdict: PASS (by structural equivalence with Test 8).**

## Test 2 — Upstream bump, no personal edits
**Method:** real. `wrap`, `week`, `month`, `quarter` had only empty personal-zone anchors (no content filled in). Ran the actual extract-reinject procedure against the real company-workflows v2.2 content vs. the real local pre-B1 files.
**Result:** all 4 stripped-company-zone hashes matched the recorded baseline (no company-zone drift) → updates applied cleanly, versions moved 2.0/2.1 → 2.2, no personal content to lose (none existed).
**Verdict: PASS.**

## Test 3 — Upstream bump + filled personal blocks
**Method:** real, on `prep` (3 personal blocks incl. the real rescued `project-state` content) and `radar` (2 personal blocks incl. the real 14-row lookup table).
**Result:** stripped-company-zone hashes matched baseline for both. Post-merge, diffed the `personal:lookup-table` block content before vs. after — **byte-identical** (confirmed via `diff`, zero output). Same for `prep`'s `project-state` block by inspection. Company-zone text updated to the new v2.2 content in both files.
**Verdict: PASS.**

## Test 4 — Company-zone edit + upstream bump
**Method:** synthetic fixture (`demo-skill`) — a company-zone hand-edit (`then bar`, unauthorized) was made outside any personal block, then upstream independently changed the same line (`then baz`) and bumped version.
**Result:** stripped hash of the hand-edited file didn't match the recorded baseline → mismatch correctly detected. Full edited file was backed up (simulated write to `backup-demo-skill-2026-07-21.md`). Update was applied anyway: the hand-edit (`then bar`) was superseded by upstream's `then baz`; the personal note in `personal:notes` survived untouched.
**Verdict: PASS.**

## Test 5 — Upstream removes an anchor
**Method:** synthetic fixture — `L` had two personal blocks (`notes`, `extra`); `U_new` only kept the `notes` anchor, dropping `extra` entirely (simulating upstream removing/renaming a personal extension point).
**Result:** `notes` reinserted normally into its matching anchor. `extra`'s content (`another personal tip I added`) was **not deleted** — it was appended under a new `## Recovered personal content` heading at the end of the merged file, clearly labeled.
**Verdict: PASS — personal content is never silently dropped.**

## Test 6 — New skill added upstream
**Method:** synthetic fixture — a `new-demo-skill` present upstream but absent from the local skills folder.
**Result:** copied in verbatim (no merge needed, nothing local to preserve), with a note that it was newly installed.
**Verdict: PASS.**

## Test 7 — `/wrap` sync with third-party skills present locally
**Method:** real. `~/.claude/skills` has 116 folders total (includes GSD packs, marketing packs, etc. — genuinely installed and in daily use). Checked what `daily_workflows` (the personal repo `/wrap` pushes to) actually tracks:
```
git ls-files skills/ | sed -E 's#^skills/([^/]+)/.*#\1#' | sort -u
→ month, prep, quarter, radar, week, wrap
```
**Result:** exactly the 6 allowlisted skills, nothing else — despite 110 other skills sitting right next to them on disk.
**Verdict: PASS.**

## Test 8 — Old three-dotfile install runs new `/prep`
**Method:** real, on this machine's actual pre-B1 state (`.workflows-repo`, `.company`, `.skills-hash` — all genuinely present from the A1-era setup).
**Result:**
- Built `.workflows.json` from the three files' real content; `upstream_ref` set to company-workflows' HEAD at migration time (`7f876b4...`); `company_zone_hashes` computed from the 6 real local skill files.
- Cleanup offer asked for real (`AskUserQuestion`) — 107 non-core folders found in `daily_workflows/skills/`; user chose to remove. Investigation showed only 67 of those were ever actually tracked in git (the other ~40 were pre-existing untracked working-tree clutter, never pushed). Tagged `pre-cleanup-2026-07-21` (pushed to origin for recoverability), removed the 67 real tracked entries, committed, pushed. `git ls-files skills/` afterward: exactly 6.
- Renamed the three old dotfiles to `.workflows-repo.bak`, `.company.bak`, `.skills-hash.bak` — nothing deleted outright.
**Verdict: PASS — no data loss, recovery tag exists, old config preserved as `.bak`.**

---

## Summary

| # | Case | Result |
|---|---|---|
| 1 | Fresh install | PASS (structural) |
| 2 | Bump, no personal edits | PASS (real) |
| 3 | Bump + filled personal blocks | PASS (real, byte-identical confirmed) |
| 4 | Company-zone edit + bump | PASS (fixture) |
| 5 | Upstream removes an anchor | PASS (fixture) |
| 6 | New skill added upstream | PASS (fixture) |
| 7 | Third-party skills not synced | PASS (real) |
| 8 | Old-dotfile migration | PASS (real) |

All 4 original failure modes (F1–F4 in `docs/FORK-PROBLEM-RESOLUTION.md` §1) map to a passing test: F1→2, F2→3, F3→ (one update channel — `/prep`'s Step-10-is-install-only note in the setup guide), F4→7.

Two real bugs caught and fixed during this run, both now documented directly in `/prep`'s Phase 1d spec so they don't ship live:

1. **Encoding.** The first pass at computing/applying hashes used PowerShell's default `Get-Content -Raw`/`Set-Content -Encoding utf8` in Windows PowerShell 5.1, which mangled em-dashes and arrows (mojibake) on read. Fixed by using `[System.IO.File]::ReadAllText(..., [System.Text.Encoding]::UTF8)` / a `UTF8Encoding($false)` (no-BOM) writer throughout.
2. **Anchor self-match.** Re-running the algorithm against `prep` itself (after adding the encoding-warning paragraph above), the extraction pattern matched the spec's *own documentation text* — `` `<!-- personal:NAME:start -->` `` used as a syntax example — as if `NAME` were a real anchor, producing a bogus 4th "block." Fixed by (a) requiring anchor names to match the real lowercase kebab-case shape (`[a-z][a-z0-9-]*`) used by every actual anchor, which a bare uppercase `NAME` placeholder doesn't satisfy, and (b) changing the doc's own placeholder text to lowercase `{name}` for consistency. Re-ran the extraction after the fix — exactly the 3 real blocks (`project-state`, `daily-checks`, `briefing-extras` for `prep`), no phantom entry.
