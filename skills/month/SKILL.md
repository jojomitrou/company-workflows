---
name: month
description: Use at the start of the month to plan it, or at the end of the month to retro it. Auto-detects which mode based on the date.
version: 2.0
origin: company
---

# Monthly Planning & Retro

`/prep` Phase 0 offers this automatically on days 1–3 (PLAN) and the last 3 calendar days (RETRO) of the month. If run standalone mid-month, ask: **"Are we planning the month or reviewing it?"**

**Task files (always these paths):**
- Active tasks: `[personal_path]\tasks\carry_over_tasks.md`
- Session log:  `[personal_path]\tasks\task_log.md`

`[personal_path]` = line 1 of `$env:USERPROFILE\.claude\.workflows-repo`. RETRO window = the actual last 3 calendar days of the month, computed from the month's real length (`[DateTime]::DaysInMonth(year, month)`) — never a hardcoded 28–31 range.

---

## PLAN Mode (start of month)

### Step 0 — Read the level above

Find the most recent quarter plan's fenced `yaml` block in `task_log.md`. If found, extract its `goals` (id, text, measure). If none exists yet (no company target repo, or quarter plan not run), proceed without a parent link — this month's goals will be `standalone`.

### Step 1 — Gather context silently
- Run `git log --oneline --since="30 days ago"` to see what shipped last month
- Read `task_log.md` — find last month's retro entry for carry-overs
- Check Jira for any monthly milestones (if connected)
- Check Calendar for key dates this month (if connected)

<!-- personal:personal-context:start -->
<!-- personal:personal-context:end -->

### Step 2 — Ask

If quarter goals were found, show them first, then ask:
> **"What are the 3 most important outcomes you want from this month? For each — which quarter goal does it advance (or is it standalone), and how will we know it happened?"**

Then: *"Any deadlines or key dates this month I should know about?"*

If no quarter goals exist, drop the "which does it advance" half.

### Step 3 — Build the monthly plan

| Bucket | What goes in it |
|--------|----------------|
| 🎯 Month Goals | The 3 outcomes the user named, each tagged `advances: {q-NN}` or `standalone` |
| 📅 Key Dates | Deadlines, launches, important meetings |
| 📋 Projects in Flight | Ongoing work that needs to move forward this month |
| 🔁 Carry-overs | Anything unfinished from last month |

Add the 3 goals to `carry_over_tasks.md` as `M` priority tasks, `target:` set to their own goal id.

### Step 4 — Open a month entry in `task_log.md`

```
## [Month] [Year] Plan — [date]

### Goals
1. [goal 1] (→ advances q-01 / standalone) — measure: [one line]
2. [goal 2] (→ advances q-02 / standalone) — measure: [one line]
3. [goal 3] (→ advances q-03 / standalone) — measure: [one line]

### Key dates
- [date]: [event]

### Projects in flight
- [project]

### Carry-overs from last month
- [item if any]
```

```yaml
period: 2026-[MM]
goals:
  - id: m-01
    text: [goal 1]
    measure: [one line]
    advances: q-01           # or standalone
carryovers: [m-lastmonth-03]
```

### Step 5 — Commit and push (to the personal repo, not the current folder)

```
git -C "[personal_path]" add -A
git -C "[personal_path]" diff --cached --quiet || (
  git -C "[personal_path]" commit -m "[Month] [Year] plan — [date]"
  git -C "[personal_path]" push
)
```

Print:
```
════════════════════════════════════
  [MONTH] [YEAR] PLAN
════════════════════════════════════
  🎯 Goals
  • [goal 1] (→ q-01)
  • [goal 2] (→ standalone)
  • [goal 3] (→ q-03)

  📅 Key dates: [N]
  📋 Projects in flight: [N]
  🔁 Carry-overs: [N]
════════════════════════════════════
  Saved to your workflows repo.
════════════════════════════════════
```

---

## RETRO Mode (last 3 calendar days of the month)

### Step 0 — Read this month's plan block

Find this month's own `yaml` plan block — gives goal ids, text, measures. If missing, score from the human-readable text and note the gap.

### Step 1 — Gather context silently
- Run `git log --oneline --since="30 days ago"` for a full picture of what shipped
- Read `task_log.md` — collect all session and week entries for this month: total completed ✅ / not completed ❌ / added ➕, and week goal achievement rates (from week retro `yaml` blocks this month)
- Check Jira for completed tickets this month (if connected)

### Step 2 — Score against measure, then ask four questions

For each goal, score against its captured `measure`: `yes` / `partial` / `no`, with one line of evidence.

Then ask, one at a time:
1. *"What were the biggest wins this month?"*
2. *"What didn't happen that you expected to?"*
3. *"What took more time or energy than expected?"*
4. *"What's the one thing you'd do differently next month?"*

### Step 3 — Close the month entry in `task_log.md`

```
## [Month] [Year] Retro — [date]

### Task summary
- Sessions this month: [N]
- Completed ✅: [N]
- Not completed ❌: [N]
- Added during month ➕: [N]
- Week goals achieved this month: [N/M] (from week retros)

### Goals scored
- [m-01] [goal 1] — achieved: yes/partial/no — evidence: [one line]
- [m-02] [goal 2] — achieved: yes/partial/no — evidence: [one line]
- [m-03] [goal 3] — achieved: yes/partial/no — evidence: [one line]

### Biggest wins
[user's answer]

### What didn't happen
[user's answer]

### Bigger than expected
[user's answer]

### Do differently next month
[user's answer]
```

```yaml
period: 2026-[MM]
scored:
  - id: m-01
    achieved: yes
    evidence: [one line]
rollup:
  q-01: 1/2 month-goals achieved
```

Compute `rollup` by grouping this month's scored goals by their `advances` parent (skip `standalone`).

Ask: **"Anything to carry into next month?"** — add to `carry_over_tasks.md`.

### Step 4 — Commit and push (to the personal repo)

```
git -C "[personal_path]" add -A
git -C "[personal_path]" diff --cached --quiet || (
  git -C "[personal_path]" commit -m "[Month] [Year] retro — [date]"
  git -C "[personal_path]" push
)
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
  Rollup: q-01 1/2, q-03 1/1
  Carry-overs noted for [next month].
════════════════════════════════════
  Good month. On to [next month].
════════════════════════════════════
```

---

## Never-do

1. Never plan without reading the quarter level above — unless it genuinely doesn't exist yet.
2. Never commit the working project folder as part of a planning ritual — always the personal repo.
3. Never accept a goal without a one-line measure.
4. Never use a hardcoded day range for the RETRO window — always compute from the month's real length.
5. Never fire on a boundary day that `/prep` Phase 0 already owns.
