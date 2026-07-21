---
name: quarter
description: Use at the start of a quarter to plan it, or at the end to retro it. Auto-detects which mode based on the date.
version: 2.0
origin: company
---

# Quarterly Planning & Retro

`/prep` Phase 0 offers this automatically on the first 3 days of Q1/Q2/Q3/Q4 (PLAN) and the last 3 days of Mar/Jun/Sep/Dec (RETRO). If run standalone at any other time, ask: **"Are we planning the quarter or reviewing it?"**

**Task files (always these paths):**
- Active tasks: `[personal_path]\tasks\carry_over_tasks.md`
- Session log:  `[personal_path]\tasks\task_log.md`

`[personal_path]` = line 1 of `$env:USERPROFILE\.claude\.workflows-repo`.

---

## PLAN Mode

### Step 0 — Read the level above (company targets, if configured)

Quarter is the top of the personal cascade. If a company targets repo is configured (it isn't yet — this is a Phase C feature; skip this silently until then), read `targets/{year}-{Qx}.md` filtered to your scope and show them before asking. Otherwise proceed straight to Step 2 with no parent link — every quarter goal will be `standalone`. **The cascade never blocks on the company layer being missing.**

Also read last quarter's retro `yaml` block in `task_log.md` for carry-overs.

### Step 1 — Gather context silently
- Run `git log --oneline --since="90 days ago"` for an activity count
- Check Jira for any active epics or OKRs (if connected)
- Check Calendar for key milestones this quarter (if connected)

<!-- personal:personal-context:start -->
<!-- personal:personal-context:end -->

### Step 2 — Ask

> **"What are the 3 most important outcomes you want from this quarter? For each, how will we know it happened?"**

(If company targets were found in Step 0: *"...and which of these targets does each one advance, if any?"*)

Then: *"Any key deadlines, launches, or milestones this quarter?"*

### Step 3 — Build the quarterly plan

| Bucket | What goes in it |
|--------|----------------|
| 🎯 Quarter Goals | The 3 outcomes the user named, each tagged `measure:` and `advances: {target-id}` or `standalone` |
| 📅 Key Milestones | Launches, deadlines, events |
| 📋 Projects to Complete | Work that must finish this quarter |
| 🔁 Carry-overs | Unfinished goals from last quarter |

Add the 3 goals to `carry_over_tasks.md` as `M` priority tasks, `target:` set to their own goal id.

### Step 4 — Open a quarter entry in `task_log.md`

```
## Q[X] [Year] Plan — [date]

### Goals
1. [goal 1] (→ advances T-2026Qx-NN / standalone) — measure: [one line]
2. [goal 2] (→ advances T-2026Qx-NN / standalone) — measure: [one line]
3. [goal 3] (→ advances T-2026Qx-NN / standalone) — measure: [one line]

### Key milestones
- [date]: [milestone]

### Projects to complete
- [project]

### Carry-overs from last quarter
- [item if any]
```

```yaml
period: 2026-Q[x]
goals:
  - id: q-01
    text: [goal 1]
    measure: [one line]
    advances: standalone     # or a company target id once Phase C exists
carryovers: [q-lastquarter-03]
```

### Step 5 — Commit and push (to the personal repo, not the current folder)

```
git -C "[personal_path]" add -A
git -C "[personal_path]" diff --cached --quiet || (
  git -C "[personal_path]" commit -m "Q[X] [Year] plan — [date]"
  git -C "[personal_path]" push
)
```

Print:
```
══════════════════════════════════════
  Q[X] [YEAR] PLAN
══════════════════════════════════════
  🎯 Goals
  • [goal 1]
  • [goal 2]
  • [goal 3]

  📅 Milestones: [N]
  📋 Projects: [N]
  🔁 Carry-overs: [N]
══════════════════════════════════════
  Saved to your workflows repo.
══════════════════════════════════════
```

---

## RETRO Mode

### Step 0 — Read this quarter's plan block

Find this quarter's own `yaml` plan block — gives goal ids, text, measures. If missing, score from the human-readable text and note the gap.

### Step 1 — Gather context silently
- Run `git log --oneline --since="90 days ago"` for full shipped work
- Read `task_log.md` — collect all session, week, and month entries for this quarter: total completed ✅ / not completed ❌ / added ➕, and month goal achievement rates (from month retro `yaml` blocks this quarter)
- Check Jira for completed epics this quarter (if connected)

### Step 2 — Score against measure, then ask four questions

For each goal, score against its captured `measure`: `yes` / `partial` / `no`, with one line of evidence.

Then ask, one at a time:
1. *"What were the biggest wins this quarter?"*
2. *"Which goals didn't get done — and why?"*
3. *"What surprised you most — good or bad?"*
4. *"What's the one thing you'd change going into next quarter?"*

### Step 3 — Close the quarter entry in `task_log.md`

```
## Q[X] [Year] Retro — [date]

### Task summary
- Sessions this quarter: [N]
- Completed ✅: [N]
- Not completed ❌: [N]
- Added during quarter ➕: [N]
- Month goals achieved this quarter: [N/M] (from month retros)

### Goals scored
- [q-01] [goal 1] — achieved: yes/partial/no — evidence: [one line]
- [q-02] [goal 2] — achieved: yes/partial/no — evidence: [one line]
- [q-03] [goal 3] — achieved: yes/partial/no — evidence: [one line]

### Biggest wins
[user's answer]

### Goals not completed
[user's answer]

### Biggest surprise
[user's answer]

### Change for next quarter
[user's answer]
```

```yaml
period: 2026-Q[x]
scored:
  - id: q-01
    achieved: yes
    evidence: [one line]
rollup: {}   # populated once a company target repo exists (Phase C) — each key is a target id
```

Ask: **"Any goals to carry into next quarter?"** — add them to `carry_over_tasks.md`.

### Step 4 — Commit and push (to the personal repo)

```
git -C "[personal_path]" add -A
git -C "[personal_path]" diff --cached --quiet || (
  git -C "[personal_path]" commit -m "Q[X] [Year] retro — [date]"
  git -C "[personal_path]" push
)
```

Print:
```
══════════════════════════════════════
  Q[X] [YEAR] RETRO
══════════════════════════════════════
  Sessions:            [N]
  Tasks completed:     [N]
  Tasks not completed: [N]
  Tasks added:         [N]
  Goals achieved:      [N/3]
  Carry-overs noted for Q[X+1].
══════════════════════════════════════
  Good quarter. On to Q[X+1].
══════════════════════════════════════
```

---

## Never-do

1. Never plan without at least checking for company targets — but never block if they don't exist.
2. Never commit the working project folder as part of a planning ritual — always the personal repo.
3. Never accept a goal without a one-line measure.
4. Never fire on a boundary day that `/prep` Phase 0 already owns.
