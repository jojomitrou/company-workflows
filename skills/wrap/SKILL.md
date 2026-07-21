---
name: wrap
description: Use at the end of every VS Code session to commit and push all work, log completed tasks, and save tomorrow's starting point.
version: 2.4
origin: company
---

# Session Wrap

Run this when the day's work is done. Automatic except the two questions in Steps 2–3 and the one save confirmation in Step 1.

**Task files (always these paths):**
- Active tasks: `[personal_path]\tasks\carry_over_tasks.md`
- Session log:  `[personal_path]\tasks\task_log.md`

`[personal_path]` = the `personal_path` field of `$env:USERPROFILE\.claude\.workflows.json`.

---

## Step 1 — Save Everything to GitHub

Run `git status --short` in the current project folder. If there are changes:
- Show a 3-line summary (file count + names, truncated if more).
- Ask: **"Save these to GitHub now?"** (default yes).
- If yes:
  ```
  git add -A
  git commit -m "[brief description of what was done] — [date]"
  git push
  ```
- If no: note it and move on — don't push silently.

If there is nothing to commit, note it and move on without asking.

<!-- personal:extra-saves:start -->
<!-- personal:extra-saves:end -->

---

## Step 1b — Sync Skills + Commit Tasks to Your Workflows Repo

1. Read `personal_path` from `$env:USERPROFILE\.claude\.workflows.json` — if the file doesn't exist, skip (bootstrap hasn't run yet).
2. Sync skills to the personal repo — **allowlist only, never a whole-folder glob**:
   ```powershell
   $companySkills = 'prep','wrap','week','month','quarter','radar','skills-status'
   foreach ($s in $companySkills) {
     Copy-Item -Recurse "$env:USERPROFILE\.claude\skills\$s" "[localPath]\skills\" -Force
   }
   ```
   Also copy any locally-installed skill whose front-matter has `origin: personal`, by name — never with a wildcard over the whole `~/.claude\skills` folder. Third-party packs (marketplace skills, GSD, etc.) are never synced; they have their own updaters.
3. Commit and push if anything changed. Because `task_log.md` and `carry_over_tasks.md` now live directly inside `[localPath]\tasks\` (prep and wrap write there all session — no copy step needed), this one commit carries both the skill sync and today's task changes:
   ```
   git -C "[localPath]" add -A
   git -C "[localPath]" diff --cached --quiet || (
     git -C "[localPath]" commit -m "skills + tasks sync — [date]"
     git -C "[localPath]" push
   )
   ```
   This step is where the golden rule (nothing only-local) is actually enforced for task history — it used to live in `~/.claude`, outside any repo.

If there is nothing to sync, skip silently — do not mention it.

---

## Step 2 — Log Completed Tasks

1. Read `carry_over_tasks.md` — skip if empty/missing.
2. Gather this session's commits so far (`git log --oneline` for the current project folder, scoped to today) as candidate evidence.
3. Where a commit message plausibly matches an open task (shared keywords, an id, a file path), **propose it first**: *"Looks like you finished #2 and #4 (based on N commits) — confirm?"*
4. For anything not confidently matched, fall back to asking directly: **"Which of these did you finish today?"**

Note the confirmed answer — used to close the session log in Step 4.

If the list is empty or the user says none, skip without asking again.

---

## Step 3 — Add Tomorrow's Tasks

Ask: **"Anything to add for tomorrow?"**

Note any new tasks using the task-line schema (defined in `/prep` Phase 2): `- [ ] {id} | {M/S/L} | {text} | added:{date} | target:{goal-id|—}`. Default `target:` to `—` unless the task clearly advances a currently-open week goal (check the most recent week plan YAML block in `task_log.md`).

If they say nothing or "no", skip.

---

## Step 4 — Close the Session Log

Find the current open session entry in `task_log.md` (the most recent `## Session —` block). If none exists — e.g. `/wrap` is being run without a prior `/prep` this session — open a minimal one first:
```
## Session — [date] (opened by /wrap — no prior /prep this session)
```

Then append the closing record:

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
- Keep not-completed tasks (preserve their `target:` field)
- Add new tasks (schema above)
- Re-number cleanly

---

## Step 4b — Company Progress Push (opt-in, Phase C)

Read `company_rollup_opt_in` from `.workflows.json`. If it's absent or `false`: skip this whole step silently, don't mention it.

If `true`:
1. Check whether a period-level RETRO (`/week`, `/month`, or `/quarter`) ran this session and appended a `rollup:` block to `task_log.md`. If none did: skip silently — most sessions don't close a period, nothing to push.
2. From that retro's `yaml` block, take only the `rollup` entries whose key matches the company-target-id shape `T-{period}-\d+` (e.g. `T-2026Q3-02`) — drop every other key (personal/standalone parent ids like `m-01` never leave this machine).
3. If nothing survives the filter: skip silently.
4. Otherwise, in a local shallow clone of `company-workflows` (same pattern `/prep`'s update check uses — clone, act, delete):
   - Write/append to `progress/_incoming/{github-username}/{period}.md`: `period`, `user`, the filtered `rollup` map, as a fenced `yaml` block.
   - Commit (`progress: {username} {period}`), push a branch `progress-submit/{username}-{period}`, open a PR against `company-workflows`.
   - If the push/PR fails for any reason (offline, no write access yet): note *"progress push skipped — {reason}"* in the wrap box, never block the rest of `/wrap` on it.
5. Note in the wrap box: `📈 pushed progress for {N} target(s) — PR opened`.

This step only ever touches its own `progress/_incoming/{username}/{period}.md` path — never any other user's file, never `targets/`, never anything outside that one path.

---

## Step 5 — Confirm

Print the final wrap box:

```
════════════════════════════════════════
  SESSION WRAPPED — [Date]
════════════════════════════════════════
  ✅  Committed and pushed to GitHub
  📊  Synced: skills v[X.Y], tasks pushed
  📈  Progress pushed for [N] target(s) — PR opened   ← only if Step 4b fired

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

---

## Never-do

1. Never sync third-party skills to the personal repo — allowlist only.
2. Never push without showing the 3-line summary and getting a confirm.
3. Never close a session log that was never opened without noting that explicitly.
4. Never skip the tasks-folder commit — that's the actual enforcement of the golden rule now.
5. Never push progress unless `company_rollup_opt_in: true` — off by default, no auto-opt-in.
6. Never push anything but the filtered `rollup` dict — no prose, no task text, no evidence lines, no full `task_log.md`.
7. Never write to another user's `progress/_incoming/{username}/` path.
