---
name: quarter
description: Use at the start of a quarter to plan it, or at the end to retro it. Auto-detects which mode based on the date.
---

# Quarterly Planning & Retro

Check today's date and run the correct mode automatically:
- **First 3 days of Q1 (Jan), Q2 (Apr), Q3 (Jul), Q4 (Oct):** PLAN mode
- **Last 3 days of Q1 (Mar), Q2 (Jun), Q3 (Sep), Q4 (Dec):** RETRO mode
- **Any other time:** ask — *"Are we planning the quarter or reviewing it?"*

**Task files (always these paths):**
- Active tasks: `$env:USERPROFILE\.claude\carry_over_tasks.md`
- Session log:  `$env:USERPROFILE\.claude\task_log.md`

---

## PLAN Mode

### 1 — Gather context silently
- Run `git log --oneline --since="90 days ago"` for an activity count
- Read `task_log.md` — find last quarter's retro entry for carry-overs
- Check Jira for any active epics or OKRs (if connected)
- Check Calendar for key milestones this quarter (if connected)

### 2 — Ask
> **"What are the 3 most important outcomes you want from this quarter?"**

Then: *"Any key deadlines, launches, or milestones this quarter?"*

### 3 — Build the quarterly plan

| Bucket | What goes in it |
|--------|----------------|
| 🎯 Quarter Goals | The 3 outcomes the user named |
| 📅 Key Milestones | Launches, deadlines, events |
| 📋 Projects to Complete | Work that must finish this quarter |
| 🔁 Carry-overs | Unfinished goals from last quarter |

Add the 3 goals to `carry_over_tasks.md`.

### 4 — Open a quarter entry in `task_log.md`

Append:
```
## Q[X] [Year] Plan — [date]

### Goals
1. [goal 1]
2. [goal 2]
3. [goal 3]

### Key milestones
- [date]: [milestone]

### Projects to complete
- [project]

### Carry-overs from last quarter
- [item if any]
```

### 5 — Commit and push automatically
```
git add -A
git commit -m "Q[X] [Year] plan — [date]"
git push
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
  Saved to GitHub.
══════════════════════════════════════
```

---

## RETRO Mode

### 1 — Gather context silently
- Run `git log --oneline --since="90 days ago"` for full shipped work
- Read `task_log.md` — collect all session, week, and month entries for this quarter:
  - Total tasks completed ✅
  - Total not completed ❌
  - Total added ➕
  - Month goal achievement rates
- Check Jira for completed epics this quarter (if connected)

### 2 — Ask four questions (one at a time)
1. *"What were the biggest wins this quarter?"*
2. *"Which goals didn't get done — and why?"*
3. *"What surprised you most — good or bad?"*
4. *"What's the one thing you'd change going into next quarter?"*

### 3 — Close the quarter entry in `task_log.md`

Append to the `## Q[X] [Year] Plan` entry:
```
## Q[X] [Year] Retro — [date]

### Task summary
- Sessions this quarter: [N]
- Completed ✅: [N]
- Not completed ❌: [N]
- Added during quarter ➕: [N]

### Goals achieved
- ✅ / ❌ [goal 1]
- ✅ / ❌ [goal 2]
- ✅ / ❌ [goal 3]

### Biggest wins
[user's answer]

### Goals not completed
[user's answer]

### Biggest surprise
[user's answer]

### Change for next quarter
[user's answer]
```

Ask: **"Any goals to carry into next quarter?"** — add them to `carry_over_tasks.md`.

### 4 — Commit and push automatically
```
git add -A
git commit -m "Q[X] [Year] retro — [date]"
git push
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
