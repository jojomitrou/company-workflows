# Company Targets — Design (Phase C1)

**Date:** 2026-07-21 · **Status:** design doc for Phase C, gates C2–C4 in `docs/UPGRADE-PROPOSAL_2026-07-06.md`.
**Decisions recorded here (asked directly, not guessed):**
1. Targets/progress data lives **inside `company-workflows`** (`targets/`, `progress/`) — not a new repo. It's already the private, admin-owned, shared repo everyone installs from.
2. Rollup mechanism is **opt-in push from `/wrap`** — decentralized, no registry of personal-repo URLs to maintain.
3. Team scoping is **not built yet** — every target is `scope: all`. The field exists in the schema (for stability) but nothing matches on it until a real multi-team rollout needs it.

---

## 1 · The chain (unchanged from `docs/TARGETS-CASCADE.md` §1)

```
COMPANY TARGETS (admin, company-workflows)     targets/2026-Q3.md
      ↓ read at plan time (C2)
PERSONAL QUARTER GOALS (/quarter PLAN)          advances: T-2026Q3-NN | standalone
      ↓ ... month → week → day (already live, Phase A)
RETROS (/week, /month, /quarter RETRO)          rollup: T-2026Q3-NN: N/M (already live, Phase A)
      ↑ opt-in push (C1, this doc)
company-workflows/progress/_incoming/{user}/{period}.md
      ↓ rollup job (C3)
company-workflows/progress/{period}.json
      ↓ (C4)
Admin view
```

Everything below "RETROS" is new. Everything above it already works (Phase A shipped the personal cascade end-to-end with no company layer — this doc only adds the company layer on top, and it must never be able to break the personal-only path).

---

## 2 · Where things live

```
company-workflows/
  targets/
    2026-Q3.md              ← admin-authored, one file per quarter
    2026-07.md               ← admin-authored, one file per month (optional — quarter-only is fine to start)
  progress/
    _incoming/
      jomitrou/
        2026-Q3.md            ← pushed by that user's /wrap, opt-in
        2026-W29.md
    2026-Q3.json              ← produced by the rollup job (C3), aggregates all _incoming files for that period
```

`_incoming/{username}/{period}.md` is **append-only per user, one file per period** — never shared between users, so two people pushing on the same day can never conflict. That's what makes a direct push safe without real review friction (see §4).

---

## 3 · Schemas

**Company target** (admin-authored, `targets/2026-Q3.md`):
```yaml
- id: T-2026Q3-02
  text: Launch AI briefing to 4 departments
  measure: 4 department digests live and past their backtest gates
  scope: all        # always "all" until team scoping is actually built
  version: 1         # bumped if admin amends; past plan/retro blocks are never rewritten
```

**Incoming file** (pushed by `/wrap`, `progress/_incoming/{user}/{period}.md`) — deliberately narrow, just enough for rollup, nothing else:
```yaml
period: 2026-Q3
user: jomitrou
rollup:
  T-2026Q3-02: 1/1
```
Only keys that are real company target ids (`T-{period}-NN`) get included — a user's `standalone` or personal-parent rollup entries (e.g. `m-01: 2/3`) **never leave the machine**. This filter is the actual privacy boundary, not just a policy statement.

**Aggregated progress** (`progress/2026-Q3.json`, produced by C3's rollup job):
```json
{
  "period": "2026-Q3",
  "targets": {
    "T-2026Q3-02": {
      "text": "Launch AI briefing to 4 departments",
      "measure": "4 department digests live and past their backtest gates",
      "contributors": 3,
      "achieved_count": 1,
      "total_count": 4,
      "users": ["jomitrou", "..."]
    }
  }
}
```
`achieved_count`/`total_count` are summed straight from each user's `N/M` rollup string for that target. No prose, no task text, no per-user evidence lines — those stay in the personal repo.

---

## 4 · The opt-in push (this is C1's actual deliverable — a new, small piece of `/wrap`)

**Config:** new optional field in `.workflows.json`: `"company_rollup_opt_in": false` (absent or `false` = opted out — the default for everyone until they explicitly turn it on).

**In `/wrap`, after Step 4 (close the session log) — new Step 4b, runs only if `company_rollup_opt_in: true` and this session's `/wrap` closed a period-level retro (week/month/quarter RETRO ran and appended a `rollup:` block):**

1. From that retro's `yaml` block, take only the `rollup` entries whose key matches `T-{period}-\d+` (the company-target-id shape) — drop everything else.
2. If nothing survives the filter (no company-target rollups this period): skip silently, nothing to push.
3. Otherwise, in a local shallow clone of `company-workflows` (same clone pattern `/prep`'s update check already uses):
   - Write/append to `progress/_incoming/{username}/{period}.md`: `period`, `user`, filtered `rollup`.
   - Commit (`progress: {username} {period}`), push a branch `progress-submit/{username}-{period}`, open a PR.
4. Because the path is unique per user and per period, this PR can never conflict with anyone else's — admin can safely turn on GitHub auto-merge for `progress/_incoming/**` so this never needs manual review once trust is established. Until then, it's a one-click merge.

**Prerequisite:** each opted-in user needs write access to `company-workflows` (to push a branch and open the PR) — same access level as installing the repo already implies for anyone the admin has invited.

---

## 5 · Edge cases — decided here (mirrors `docs/TARGETS-CASCADE.md` §4 pattern)

| Case | Handling |
|---|---|
| User never opts in | Nothing pushes, ever. The personal cascade (their own quarter/month/week goals) works identically either way — this is strictly additive. |
| User opts in but has no company-target rollups this period | Skip silently (§4 step 2) — not every period advances a company target, and that's fine. |
| Two users push the same period same day | No conflict possible — different file paths. |
| Admin amends a target mid-period | Targets are versioned (`version:` bump), never edited in place. The rollup job aggregates against whichever version was current when each user's retro ran — a note on version drift belongs in C3, not solved here. |
| `company-workflows` unreachable when `/wrap` tries to push | Skip silently, note "progress push skipped (offline)" — never block `/wrap` on this. |
| User wants to stop opting in | Flip `company_rollup_opt_in` to `false` (or delete the field) in `.workflows.json` by hand — no skill currently automates turning it off, that's a fine manual step. |

---

## 6 · What C1 does NOT do (deferred to C2/C3/C4)

- `/quarter` and `/month` don't actually read `targets/{period}.md` yet — that's C2. This doc only defines the schema they'll read.
- No rollup job exists yet to turn `_incoming/*` into `progress/{period}.json` — that's C3.
- No admin-facing view — that's C4.
- This doc **does** ship the one piece of C1 that's genuinely new working code: `/wrap`'s opt-in push (§4), since it's small, self-contained, and everything else needs it to exist first.

---

## 7 · Never-do

1. Never push a user's prose, task text, backups, or full `task_log.md` — only the filtered `rollup` dict, and only when opted in.
2. Never auto-opt someone in — `company_rollup_opt_in` defaults to off.
3. Never let two users write the same `_incoming` path — always `{username}/{period}`.
4. Never let any skill write into `targets/` except an admin editing the markdown by hand and committing — no skill automates admin authoring.
5. Never block `/quarter`, `/month`, or `/wrap` on the company repo being missing, stale, or unreachable.
6. Never edit a past `_incoming` file in place — append-only, corrections happen in the next period.

---

## 8 · Acceptance for "C1 done"

- This doc committed.
- `.workflows.json` schema documented with `company_rollup_opt_in`.
- `/wrap` Step 4b implemented, tested opt-in and opt-out paths, tested the target-id filter (personal-only rollups never appear in a pushed file).
- `docs/PROGRESS.md` C1 row updated with evidence.
