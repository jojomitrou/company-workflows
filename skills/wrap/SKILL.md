---
name: wrap
description: Use at the end of every VS Code session to commit and push all work, log completed tasks, and save tomorrow's starting point.
---

# Session Wrap

Run this when the day's work is done. Fully automatic — no questions except the two below.

**Task files (always these paths):**
- Active tasks: `$env:USERPROFILE\.claude\carry_over_tasks.md`
- Session log:  `$env:USERPROFILE\.claude\task_log.md`

---

## Step 1 — Save Everything to GitHub

```
git add -A
git commit -m "[brief description of what was done] — [date]"
git push
```

If there is nothing to commit, note it and move on.

---

## Step 1b — Sync Skills to Your Workflows Repo

After saving the main repo, sync any skill changes to your personal workflows repo.

1. Read local path (line 1) from `$env:USERPROFILE\.claude\.workflows-repo` — if the file doesn't exist, skip (bootstrap hasn't run yet)
2. Copy all installed skills into the repo:
   `Copy-Item -Recurse "$env:USERPROFILE\.claude\skills\*" "[localPath]\skills\" -Force`
3. Commit and push if anything changed:
   ```
   git -C "[localPath]" add -A
   git -C "[localPath]" diff --cached --quiet || (
     git -C "[localPath]" commit -m "skills: sync — [date]"
     git -C "[localPath]" push
   )
   ```

If there are no changes, skip silently — do not mention it.

---

## Step 2 — Log Completed Tasks

1. Read `carry_over_tasks.md` (if it exists — skip if empty/missing)
2. Show the current task list to the user
3. Ask: **"Which of these did you finish today?"**
4. Note the user's answer — used to close the session log in Step 3

If the list is empty or the user says none, skip without asking again.

---

## Step 3 — Add Tomorrow's Tasks

Ask: **"Anything to add for tomorrow?"**

Note any new tasks the user gives — used in Step 4.

If they say nothing or "no", skip.

---

## Step 4 — Close the Session Log

Find the current open session entry in `task_log.md` (the most recent `## Session —` block opened by `/prep`). Append the closing record:

```
### Completed ✅
- [task marked done — or "None"]

### Not completed ❌
- [task not done — carried over]

### Added ➕
- [new task added this session — or "None"]
```

Then update `carry_over_tasks.md`:
- Remove completed tasks
- Keep not-completed tasks
- Add new tasks
- Re-number cleanly

---

## Step 5 — Confirm

Print the final wrap box:

```
════════════════════════════════════════
  SESSION WRAPPED — [Date]
════════════════════════════════════════
  ✅  Committed and pushed to GitHub

  ✅  COMPLETED TODAY
  • [task] / None

  ❌  NOT COMPLETED (carried over)
  • [task] / None

  ➕  ADDED FOR NEXT SESSION
  • [task] / None

  📋  CARRY OVER TO TOMORROW
  1. [task]
  2. [task]
  (none, if list is empty)
════════════════════════════════════════
  See you next time.
════════════════════════════════════════
```
