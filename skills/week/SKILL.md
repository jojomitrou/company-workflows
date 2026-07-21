---
name: week
description: Use at the start of the week to plan it, or at the end of the week to retro it. Auto-detects which mode based on the day.
version: 2.0
origin: company
---

# Weekly Planning & Retro

`/prep` Phase 0 offers this automatically on Monday (PLAN) and Friday (RETRO) — this skill no longer needs to guess the day itself when called that way. If run standalone mid-week, ask: **"Are we planning the week or reviewing it?"**

**Task files (always these paths):**
- Active tasks: `[personal_path]\tasks\carry_over_tasks.md`
- Session log:  `[personal_path]\tasks\task_log.md`

`[personal_path]` = line 1 of `$env:USERPROFILE\.claude\.workflows-repo`. Week number = ISO 8601 (`Get-Date -UFormat %V`).

---

## PLAN Mode (Monday or start of week)

### Step 0 — Read the level above

Find the most recent month plan's fenced `yaml` block in `task_log.md`. If found, extract its `goals` (id, text, measure). If none exists yet, proceed without a parent link — this week's goals will be `standalone`, and that's fine; the cascade never blocks on the level above being missing.

### Step 1 — Gather context silently
- Run `git log --oneline --since="7 days ago"` to see what shipped last week
- Read `task_log.md` — find all session entries from the past 7 days and count: how many tasks completed ✅, not completed ❌, added ➕
- Check Calendar for key meetings this week (if connected)
- Check Jira for sprint goals (if connected)

<!-- personal:personal-context:start -->
<!-- personal:personal-context:end -->

### Step 2 — Ask

If month goals were found, show them first, then ask:
> **"What are the 3 most important things to get done this week? For each — which month goal does it advance (or is it standalone), and how will we know it happened?"**

If no month goals exist, drop the "which does it advance" half and just ask for the 3 things + how you'll know each happened.

### Step 3 — Build the weekly plan

| Bucket | What goes in it |
|--------|----------------|
| 🎯 This Week's Goals | The 3 things the user named, each tagged `advances: {m-NN}` or `standalone` |
| 📋 Also Planned | Sprint tasks, calendar commitments, carry-overs from last week |
| 🔁 On the Radar | Things to watch but not act on this week |

Add the 3 goals to `carry_over_tasks.md` as `M` priority tasks, each with `target:` set to its own goal id (so the daily briefing surfaces them without extra bookkeeping).

### Step 4 — Open a week entry in `task_log.md`

Append the human-readable plan, then a machine-readable block underneath it:

```
## Week [XX] Plan — [date]

### Goals
1. [goal 1] (→ advances m-01 / standalone) — measure: [one line]
2. [goal 2] (→ advances m-02 / standalone) — measure: [one line]
3. [goal 3] (→ advances m-03 / standalone) — measure: [one line]

### Also planned
- [item]

### Carry-overs from last week
- [item if any]
```

```yaml
period: 2026-W[XX]
goals:
  - id: w-01
    text: [goal 1]
    measure: [one line]
    advances: m-01           # or standalone
  - id: w-02
    text: [goal 2]
    measure: [one line]
    advances: standalone
carryovers: [w-lastweek-03]
```

### Step 5 — Commit and push (to the personal repo, not the current folder)

```
git -C "[personal_path]" add -A
git -C "[personal_path]" diff --cached --quiet || (
  git -C "[personal_path]" commit -m "Week [XX] plan — [date]"
  git -C "[personal_path]" push
)
```

Print:
```
════════════════════════════════
  WEEK [XX] PLAN — [Date range]
════════════════════════════════
  🎯 Goals
  • [goal 1] (→ m-01)
  • [goal 2] (→ standalone)
  • [goal 3] (→ m-03)

  📋 Also planned: [N] items
  🔁 On the radar: [N] items
════════════════════════════════
  Saved to your workflows repo.
════════════════════════════════
```

---

## RETRO Mode (Friday or end of week)

### Step 0 — Read this week's plan block

Find this week's own `yaml` plan block (from PLAN mode, Step 4) — this gives the goal ids, text, and measures to score against. If it's missing (plan was never run this week), score the goals from the human-readable text instead and note the gap.

### Step 1 — Gather context silently
- Run `git log --oneline --since="7 days ago"` to see what was actually shipped
- Read `task_log.md` — collect all session entries from the past 7 days: total completed ✅ / not completed ❌ / added ➕

### Step 2 — Score against measure, then ask three questions

For each goal, score **against its captured `measure`**, not vibes: `yes` / `partial` / `no`, with one line of evidence (propose from git commits/task log where possible, confirm with the user).

Then ask, one at a time:
1. *"What went well this week?"*
2. *"What didn't go as planned?"*
3. *"What will you do differently next week?"*

### Step 3 — Close the week entry in `task_log.md`

Append:

```
## Week [XX] Retro — [date]

### Task summary
- Completed ✅: [N]
- Not completed ❌: [N]
- Added during week ➕: [N]

### Goals scored
- [w-01] [goal 1] — achieved: yes/partial/no — evidence: [one line]
- [w-02] [goal 2] — achieved: yes/partial/no — evidence: [one line]
- [w-03] [goal 3] — achieved: yes/partial/no — evidence: [one line]

### What went well
[user's answer]

### What didn't go as planned
[user's answer]

### Do differently next week
[user's answer]
```

```yaml
period: 2026-W[XX]
scored:
  - id: w-01
    achieved: yes
    evidence: [one line]
rollup:
  m-01: 1/2 week-goals achieved
```

Compute `rollup` by grouping this week's scored goals by their `advances` parent (skip `standalone`) and reporting achieved/total per parent id.

Ask: **"Any missed goals to carry into next week?"** — add them to `carry_over_tasks.md`.

### Step 4 — Commit and push (to the personal repo)

```
git -C "[personal_path]" add -A
git -C "[personal_path]" diff --cached --quiet || (
  git -C "[personal_path]" commit -m "Week [XX] retro — [date]"
  git -C "[personal_path]" push
)
```

Print:
```
════════════════════════════════
  WEEK [XX] RETRO — [Date]
════════════════════════════════
  Tasks completed:     [N]
  Tasks not completed: [N]
  Tasks added:         [N]
  Goals achieved:      [N/3]
  Rollup: m-01 1/2, m-03 1/1
  Carry-overs noted for next week.
════════════════════════════════
  Have a good weekend.
════════════════════════════════
```

---

## Never-do

1. Never plan without reading the month level above — unless it genuinely doesn't exist yet.
2. Never commit the working project folder as part of a planning ritual — always the personal repo.
3. Never accept a goal without a one-line measure.
4. Never ask "planning or reviewing the week?" on a Monday or Friday reached via `/prep` Phase 0 — that's already decided.
