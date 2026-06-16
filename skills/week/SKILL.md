---
name: week
description: Use at the start of the week to plan it, or at the end of the week to retro it. Auto-detects which mode based on the day.
---

# Weekly Planning & Retro

Check today's day of the week and run the correct mode automatically. If run mid-week, ask: **"Are we planning the week or reviewing it?"**

**Task files (always these paths):**
- Active tasks: `$env:USERPROFILE\.claude\carry_over_tasks.md`
- Session log:  `$env:USERPROFILE\.claude\task_log.md`

---

## PLAN Mode (Monday or start of week)

### 1 — Gather context silently
- Run `git log --oneline --since="7 days ago"` to see what shipped last week
- Read `task_log.md` — find all session entries from the past 7 days and count: how many tasks completed ✅, not completed ❌, added ➕
- Check Calendar for key meetings this week (if connected)
- Check Jira for sprint goals (if connected)

### 2 — Ask
> **"What are the 3 most important things to get done this week?"**

### 3 — Build the weekly plan

| Bucket | What goes in it |
|--------|----------------|
| 🎯 This Week's Goals | The 3 things the user named |
| 📋 Also Planned | Sprint tasks, calendar commitments, carry-overs from last week |
| 🔁 On the Radar | Things to watch but not act on this week |

Add the 3 goals to `carry_over_tasks.md`.

### 4 — Open a week entry in `task_log.md`

Append:
```
## Week [XX] Plan — [date]

### Goals
1. [goal 1]
2. [goal 2]
3. [goal 3]

### Also planned
- [item]

### Carry-overs from last week
- [item if any]
```

### 5 — Commit and push automatically
```
git add -A
git commit -m "Week [XX] plan — [date]"
git push
```

Print:
```
════════════════════════════════
  WEEK [XX] PLAN — [Date range]
════════════════════════════════
  🎯 Goals
  • [goal 1]
  • [goal 2]
  • [goal 3]

  📋 Also planned: [N] items
  🔁 On the radar: [N] items
════════════════════════════════
  Saved to GitHub.
════════════════════════════════
```

---

## RETRO Mode (Friday or end of week)

### 1 — Gather context silently
- Run `git log --oneline --since="7 days ago"` to see what was actually shipped
- Read `task_log.md` — collect all session entries from the past 7 days:
  - Total tasks planned
  - Total completed ✅
  - Total not completed ❌
  - Total added ➕
- Find the `## Week [XX] Plan` entry to compare goals vs actuals

### 2 — Ask three questions (one at a time)
1. *"What went well this week?"*
2. *"What didn't go as planned?"*
3. *"What will you do differently next week?"*

### 3 — Close the week entry in `task_log.md`

Append to the `## Week [XX] Plan` entry:
```
## Week [XX] Retro — [date]

### Task summary
- Completed ✅: [N]
- Not completed ❌: [N]
- Added during week ➕: [N]

### Goals achieved
- ✅ / ❌ [goal 1]
- ✅ / ❌ [goal 2]
- ✅ / ❌ [goal 3]

### What went well
[user's answer]

### What didn't go as planned
[user's answer]

### Do differently next week
[user's answer]
```

Ask: **"Any missed goals to carry into next week?"** — add them to `carry_over_tasks.md`.

### 4 — Commit and push automatically
```
git add -A
git commit -m "Week [XX] retro — [date]"
git push
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
  Carry-overs noted for next week.
════════════════════════════════
  Have a good weekend.
════════════════════════════════
```
