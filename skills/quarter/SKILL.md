---
name: quarter
description: Use at the start of a quarter to plan it, or at the end to retro it. Auto-detects which mode based on the date.
---

# Quarterly Planning & Retro

Check today's date and run the correct mode automatically:
- **First 3 days of Q1 (Jan), Q2 (Apr), Q3 (Jul), Q4 (Oct):** PLAN mode
- **Last 3 days of Q1 (Mar), Q2 (Jun), Q3 (Sep), Q4 (Dec):** RETRO mode
- **Any other time:** ask — *"Are we planning the quarter or reviewing it?"*

---

## PLAN Mode

### 1 — Gather context silently
- Read last quarter's retro from `_quarters/` in Obsidian if it exists — note carry-overs
- Read the last 3 monthly notes from `_months/` for patterns and unfinished goals
- Run `git log --oneline --since="90 days ago" | wc -l` for an activity count
- Check Jira for any active epics or OKRs (if connected)

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

### 4 — Write to Obsidian
Create `_quarters/YYYY-QX.md` (e.g. `_quarters/2026-Q2.md`):
```
# Q[X] [Year]

## Goals
- [goal 1]
- [goal 2]
- [goal 3]

## Key milestones
- [date]: [milestone]

## Projects to complete
- [project]

## Carry-overs from last quarter
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
  Saved to Obsidian and GitHub.
══════════════════════════════════════
```

---

## RETRO Mode

### 1 — Gather context silently
- Read this quarter's plan from `_quarters/YYYY-QX.md`
- Read all 3 monthly retros from `_months/` for this quarter
- Run `git log --oneline --since="90 days ago"` for full shipped work
- Count session notes in `_sessions/` for the quarter

### 2 — Ask four questions (one at a time)
1. *"What were the biggest wins this quarter?"*
2. *"Which goals didn't get done — and why?"*
3. *"What surprised you most — good or bad?"*
4. *"What's the one thing you'd change going into next quarter?"*

### 3 — Add retro to the quarter's Obsidian note
Append to `_quarters/YYYY-QX.md`:
```
---

## Retro — [Date]

### Biggest wins
[user's answer]

### Goals not completed
[user's answer]

### Biggest surprise
[user's answer]

### Change for next quarter
[user's answer]

### Goals achieved
- ✅ [completed]
- ❌ [missed — carry forward?]

### Stats
- Sessions this quarter: [N]
- Commits: [N]
- Months completed: 3/3
```

Ask: **"Any goals to carry into next quarter?"** — note them for next plan.

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
  Goals achieved: [N/N]
  Sessions: [N]  |  Commits: [N]
  Retro saved to Obsidian.
  Carry-overs noted for Q[X+1].
══════════════════════════════════════
  Good quarter. On to Q[X+1].
══════════════════════════════════════
```
