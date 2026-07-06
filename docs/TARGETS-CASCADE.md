# The Targets Cascade — Definitive Guide

**Date:** 2026-07-06 · **Status:** implementation spec for the cascade (details §1.5–1.7 and Phase C2 of `UPGRADE-PROPOSAL_2026-07-06.md`).
**What it solves:** today, quarter/month/week/day goals are collected by four skills that never read each other — and the future admin targets have no path to flow down or roll up. This guide defines the whole chain.

---

## 1 · The chain

```
COMPANY TARGETS (admin, company repo)     targets/2026-Q3.md · targets/2026-07.md
      ↓ read at plan time
PERSONAL QUARTER GOALS (/quarter PLAN)    each goal: advances: T-2026Q3-NN | standalone
      ↓
MONTH GOALS (/month PLAN)                 each goal: advances: q-NN | standalone
      ↓
WEEK GOALS (/week PLAN)                   each goal: advances: m-NN | standalone
      ↓
DAILY TASKS (/prep Must Do)               each task: target: w-NN | —
      ↑ roll-up at retro time
RETROS (/week, /month, /quarter RETRO)    score vs measure → parent progress %
      ↑ aggregate (opt-in)
COMPANY ROLLUP                            progress/2026-Q3.json per target
```

Exactly four planning levels + daily tasks. **Never add a fifth level.**

## 2 · IDs and schemas

**Company target** (admin-authored, company repo, one file per period):
```yaml
# targets/2026-Q3.md — front-matter + one block per target
- id: T-2026Q3-02
  text: Launch AI briefing to 4 departments
  measure: 4 department digests live and past their backtest gates
  scope: analytics-team        # team slug or "all"
  version: 1                   # bumped if admin amends; never edited in place silently
```

**Personal plan block** (appended by each PLAN mode to `task_log.md`, below the human-readable plan — humans read prose, tooling reads YAML):
```yaml
period: 2026-W29              # or 2026-07, 2026-Q3
goals:
  - id: w-01
    text: Finance briefing job built + backtested
    measure: 30-day backtest reviewed, regression re-detected
    advances: m-01            # parent goal id, or "standalone"
carryovers: [w-lastweek-03]
```

**Daily task line** (`tasks/carry_over_tasks.md` schema from §1.3): `- [ ] {id} | {M/S/L} | {text} | added:{date} | target:{w-NN|—}`

**Retro block** (appended by each RETRO mode):
```yaml
period: 2026-W29
scored:
  - id: w-01
    achieved: yes             # yes | partial | no — judged against `measure`, not vibes
    evidence: backtest committed, regression detected as headline 1
rollup:
  m-01: 2/3 week-goals achieved
```

## 3 · Flow rules — what each skill does (exact)

**PLAN mode, every level, new Step 0:** read the level above before asking anything.
- `/quarter` reads company `targets/{Q}.md` (filtered to user's scope) + last quarter's carryovers → shows them → asks: *"Which of these will your quarter goals advance? What are your 3 outcomes — and for each, how will we know it happened?"*
- `/month` reads the quarter plan block → same pattern against `q-NN`.
- `/week` reads the month plan block → same against `m-NN`.
- `/prep` reads the week plan block → Must Do items inherit `target: w-NN` when they serve a goal.
- No company repo configured → skip the top link silently; the personal cascade (quarter→month→week→day) works identically. **The cascade never depends on the company layer existing.**

**RETRO mode, every level:** score each goal `yes/partial/no` **against its `measure`** (captured at plan time) with one line of evidence; compute the rollup line for each parent id; append the retro block. `/month` and `/quarter` retros additionally show target-level progress: *"T-2026Q3-02: your goals advancing it achieved 2/3."*

**Company rollup (Phase C3):** an opt-in step in `/wrap` (or a scheduled job) pushes ONLY the YAML plan/retro blocks — never prose, never task text — to the company repo; a rollup job aggregates per target into `progress/{period}.json`. Admin view reads only those JSONs.

## 4 · Edge cases — decided

| Case | Handling |
|---|---|
| Admin amends a target mid-period | Targets are versioned (`version:` bump + dated note), never silently edited. Next PLAN/RETRO at any level surfaces the delta: "T-…-02 changed (v2): …". Past plan blocks are never rewritten. |
| Goal with no parent | Allowed, labeled `standalone`. Retros count them; a *high standalone ratio is an alignment signal for the retro conversation, not a violation* — some real work is always off-target. |
| Target with nobody advancing it | Rollup shows 0 contributors — that's the admin's signal, surfaced in the admin view, not policed in user skills. |
| Person joins mid-quarter | Their first `/month` reads current quarter targets directly (quarter plan optional). |
| Multiple teams | `scope:` on targets filtered against `team` in `.workflows.json` (added at bootstrap: "what team are you on?"). |
| Measure turns out wrong mid-period | Goals may be re-measured at the next lower-level PLAN (noted as amended), never retroactively at retro time. |
| Company repo unreachable at plan time | Use last-fetched targets copy (cached in personal repo `targets-cache/`), note staleness. Never block planning. |

## 5 · What to AVOID — and why

| Avoid | Why |
|---|---|
| Forcing every goal to map to a parent | Goodhart's law — you'll get fake alignment and creative relabeling, and lose the honest signal of what off-target work actually exists. `standalone` is a feature. |
| Admin targets writing into personal plans | Targets are **inputs the user reads**, not entries pushed into their files. Users author their own goals; autonomy is what makes the self-reports honest. |
| Computing attainment from task counts | Ten trivial tasks ≠ one outcome. The `measure` captured at plan time is the only scoring basis; task counts are context. |
| Rolling up prose or task text | Privacy kills adoption instantly. Only the YAML blocks (goal text, measure, achieved, rollup) leave the personal repo, and only opt-in. |
| Skipping the measure question at plan time | Retro scoring becomes vibes; rollups become meaningless; this is the single highest-leverage habit in the whole system. |
| A fifth planning level, or per-day goals | Ceremony grows, usage dies. Four levels + tasks, fixed. |
| Retro-editing past plan blocks | The log is append-only history; corrections happen in the next period's plan. Same append-only discipline as the wallet ledger in rewards-mcp. |

## 6 · NEVER-DO

1. Never push a user's prose, task text, or backups to the company repo — YAML blocks only, opt-in only.
2. Never let any skill write into `targets/` except the admin flow.
3. Never score `achieved:` without the evidence line.
4. Never rewrite or delete a past plan/retro block.
5. Never block any planning skill on the company layer being missing, stale, or unreachable.

## 7 · Worked example (end to end)

Admin writes `T-2026Q3-02 · "Launch AI briefing to 4 departments" · measure: 4 dept digests live`.
→ User's `/quarter` (July 1): goal `q-01 "Ship the Briefing program through Phase 4" · advances: T-2026Q3-02 · measure: Finance+Marketing digests live`.
→ `/month` (July): `m-01 "Finance briefing live" · advances: q-01 · measure: backtest gate passed + MWF digest running`.
→ `/week` (W29): `w-01 "briefing job + backtest" · advances: m-01`. `/prep` Monday: Must Do `#4 | M | build custard-briefing.ts | target:w-01`.
→ Friday `/week` retro: `w-01 achieved: yes · evidence: backtest committed, regression re-detected` → `rollup: m-01: 1/3 so far`.
→ End-July `/month` retro: `m-01 achieved: yes` → `rollup: q-01: on track` → (opt-in) block pushed → `progress/2026-Q3.json`: `T-2026Q3-02: 1/4 departments, 3 contributors on track`.
→ Admin view shows the target at 25% with momentum — nobody wrote a status report.

## 8 · Acceptance for "cascade addressed"

- All four PLAN modes read their parent level and ask the advance + measure questions; all four RETRO modes score against measures and emit rollup lines.
- The YAML blocks parse across 3 consecutive periods of real use (schema stability).
- Cascade works with zero company config (personal-only mode).
- The worked example (§7) reproduces end-to-end in a test run with a dummy company repo, committed to `docs/test-evidence/`.
