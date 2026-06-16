---
name: month
description: Use at the start of the month to plan it, or at the end of the month to retro it. Auto-detects which mode based on the date.
---

# Monthly Planning & Retro

Check today's date and run the correct mode automatically:
- **Days 1–3 of the month:** PLAN mode
- **Days 28–31 of the month:** RETRO mode
- **Mid-month:** ask — *"Are we planning the month or reviewing it?"*

**Task files (always these paths):**
- Active tasks: `$env:USERPROFILE\.claude\carry_over_tasks.md`
- Session log:  `$env:USERPROFILE\.claude\task_log.md`

---

## PLAN Mode (start of month)

### 1 — Gather context silently
- Run `git log --oneline --since="30 days ago"` to see what shipped last month
- Read `task_log.md` — find last month's retro entry for carry-overs
- Check Jira for any monthly milestones or quarterly goals (if connected)
- Check Calendar for key dates this month (if connected)

### 2 — Ask
> **"What are the 3 most important outcomes you want from this month?"**

Then: *"Any deadlines or key dates this month I should know about?"*

### 3 — Build the monthly plan

| Bucket | What goes in it |
|--------|----------------|
| 🎯 Month Goals | The 3 outcomes the user named |
| 📅 Key Dates | Deadlines, launches, important meetings |
| 📋 Projects in Flight | Ongoing work that needs to move forward this month |
| 🔁 Carry-overs | Anything unfinished from last month |

Add the 3 goals to `carry_over_tasks.md`.

### 4 — Open a month entry in `task_log.md`

Append:
```
## [Month] [Year] Plan — [date]

### Goals
1. [goal 1]
2. [goal 2]
3. [goal 3]

### Key dates
- [date]: [event]

### Projects in flight
- [project]

### Carry-overs from last month
- [item if any]
```

### 5 — Commit and push automatically
```
git add -A
git commit -m "[Month] [Year] plan — [date]"
git push
```

Print:
```
════════════════════════════════════
  [MONTH] [YEAR] PLAN
════════════════════════════════════
  🎯 Goals
  • [goal 1]
  • [goal 2]
  • [goal 3]

  📅 Key dates: [N]
  📋 Projects in flight: [N]
  🔁 Carry-overs: [N]
════════════════════════════════════
  Saved to GitHub.
════════════════════════════════════
```

---

## RETRO Mode (end of month)

### 1 — Gather context silently
- Run `git log --oneline --since="30 days ago"` for a full picture of what shipped
- Read `task_log.md` — collect all session and week entries for this month:
  - Total tasks completed ✅ across all sessions
  - Total not completed ❌
  - Total added ➕
  - Week goal achievement rates
- Check Jira for completed tickets this month (if connected)

### 2 — Ask four questions (one at a time)
1. *"What were the biggest wins this month?"*
2. *"What didn't happen that you expected to?"*
3. *"What took more time or energy than expected?"*
4. *"What's the one thing you'd do differently next month?"*

### 3 — Close the month entry in `task_log.md`

Append to the `## [Month] [Year] Plan` entry:
```
## [Month] [Year] Retro — [date]

### Task summary
- Sessions this month: [N]
- Completed ✅: [N]
- Not completed ❌: [N]
- Added during month ➕: [N]

### Goals achieved
- ✅ / ❌ [goal 1]
- ✅ / ❌ [goal 2]
- ✅ / ❌ [goal 3]

### Biggest wins
[user's answer]

### What didn't happen
[user's answer]

### Bigger than expected
[user's answer]

### Do differently next month
[user's answer]
```

Ask: **"Anything to carry into next month?"** — add to `carry_over_tasks.md`.

### 4 — Commit and push automatically
```
git add -A
git commit -m "[Month] [Year] retro — [date]"
git push
```

Print:
```
════════════════════════════════════
  [MONTH] [YEAR] RETRO
════════════════════════════════════
  Sessions:            [N]
  Tasks completed:     [N]
  Tasks not completed: [N]
  Tasks added:         [N]
  Goals achieved:      [N/3]
  Carry-overs noted for [next month].
════════════════════════════════════
  Good month. On to [next month].
════════════════════════════════════
```
