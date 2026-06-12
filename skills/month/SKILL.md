---
name: month
description: Use at the start of the month to plan it, or at the end of the month to retro it. Auto-detects which mode based on the date.
---

# Monthly Planning & Retro

Check today's date and run the correct mode automatically:
- **Days 1–3 of the month:** PLAN mode
- **Days 28–31 of the month:** RETRO mode
- **Mid-month:** ask — *"Are we planning the month or reviewing it?"*

---

## PLAN Mode (start of month)

### 1 — Gather context silently
- Read last month's retro from `_months/` in Obsidian if it exists — note carry-overs
- Read the last 4 weekly notes from `_weeks/` for patterns
- Run `git log --oneline --since="30 days ago"` to see what shipped last month
- Check Jira for any monthly milestones or quarterly goals (if connected)

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

### 4 — Write to Obsidian
Create `_months/YYYY-MM.md` (e.g. `_months/2026-06.md`):
```
# [Month] [Year]

## Goals
- [goal 1]
- [goal 2]
- [goal 3]

## Key dates
- [date]: [event]

## Projects in flight
- [project]

## Carry-overs from last month
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
  Saved to Obsidian and GitHub.
════════════════════════════════════
```

---

## RETRO Mode (end of month)

### 1 — Gather context silently
- Read this month's plan from `_months/YYYY-MM.md`
- Read all weekly retros from `_weeks/` for this month
- Run `git log --oneline --since="30 days ago"` for a full picture of what shipped
- Count session notes in `_sessions/` for this month

### 2 — Ask four questions (one at a time)
1. *"What were the biggest wins this month?"*
2. *"What didn't happen that you expected to?"*
3. *"What took more time or energy than expected?"*
4. *"What's the one thing you'd do differently next month?"*

### 3 — Add retro to the month's Obsidian note
Append to `_months/YYYY-MM.md`:
```
---

## Retro — [Date]

### Biggest wins
[user's answer]

### What didn't happen
[user's answer]

### Bigger than expected
[user's answer]

### Do differently next month
[user's answer]

### Goals achieved
- ✅ [completed]
- ❌ [missed — carry forward?]

### Stats
- Sessions this month: [N]
- Commits: [N]
- Weeks completed: [N/4]
```

Ask: **"Anything to carry into next month?"** — note for the next plan.

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
  Goals achieved: [N/N]
  Sessions: [N]  |  Commits: [N]
  Retro saved to Obsidian.
  Carry-overs noted for [next month].
════════════════════════════════════
  Good month. On to [next month].
════════════════════════════════════
```
