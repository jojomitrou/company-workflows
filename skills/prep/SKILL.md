---
name: prep
description: Use at the start of every VS Code session to run the daily workflow kickoff — verifies critical connections, ensures all work is saved to GitHub, gathers context, and organises the day into Must Do, Should Do, and Check Later.
---

# Daily Session Prep

Run this at the start of every session.

The golden rule of every session: **everything the user works on must end up saved in a GitHub repository**. Notes, plans, code, decisions — all of it. GitHub is the safety net. Nothing should live only on the laptop.

**Task files (always these paths):**
- Active tasks: `$env:USERPROFILE\.claude\carry_over_tasks.md`
- Session log:  `$env:USERPROFILE\.claude\task_log.md`

---

## Phase 1 — Foundation Check

### 1a — GitHub (blocking)

Run:
```
gh auth status
```

**If pass:** great, move on.

**If fail:** say —
> *"You're not logged into GitHub yet. Type `gh auth login` in the terminal and follow the steps — I'll walk you through it if you need."*

Do not proceed until GitHub is connected.

---

### 1b — GitHub Repo for Today's Work (blocking)

Check whether the current folder is a git repository:
```
git status
```

**If pass (inside a repo):**
- If there are uncommitted changes, commit and push immediately — no need to ask:
  ```
  git add -A
  git commit -m "Session save — [date]"
  git push
  ```
  Note it in the briefing: *"Saved [N] uncommitted files from last session."*

**If fail (not a repo):**
Say —
> *"This folder isn't connected to GitHub yet. Let's set that up now — what would you like to call this project?"*

Then:
1. `git init`
2. `gh repo create [name] --private --source=. --push`

Do not proceed until there is a GitHub repo for the current work.

---

### 1c — Service Checks (non-blocking)

Run all of these quietly and note status — do not block on any of them:

| Service | Check | If failing |
|---------|-------|------------|
| BigQuery | `gcloud auth list` | ⚠️ flag if data work needed today |
| Gmail | `list_labels` via MCP | ⚠️ non-blocking |
| Google Calendar | `list_events` via MCP for today | ⚠️ non-blocking |
| Jira | Atlassian MCP call | ⚠️ flag if ticket work needed today |

---

### 1d — Personal Workflows Repo (silent)

Check whether the user has a personal workflows repo configured.

**Config file:** `$env:USERPROFILE\.claude\.workflows-repo`
Format: line 1 = local path, line 2 = GitHub URL

---

**If the config file does NOT exist — bootstrap (first run only):**

Say:
> *"This is your first time running /prep. Let's create your personal workflows repo so your skills live somewhere you control — not in ai_feautures."*

1. Ask: **"What's your company or team name?"** → write to `$env:USERPROFILE\.claude\.company` (used in briefing headers)
2. Ask: **"What would you like to call your workflows repo?"** (suggest `daily_workflows`)
3. Get GitHub username: `gh api user --jq .login`
4. Create the repo: `gh repo create [username]/[name] --private`
5. Ask: **"Where would you like to clone it?"** (suggest `C:\Users\[username]\Documents\git repos\[name]`)
6. Clone it: `git clone https://github.com/[username]/[name] "[localPath]"`
7. Copy current installed skills into it:
   `Copy-Item -Recurse "$env:USERPROFILE\.claude\skills\*" "[localPath]\skills\" -Force`
8. Commit and push:
   ```
   git -C "[localPath]" add -A
   git -C "[localPath]" commit -m "init: bootstrap from ai_feautures"
   git -C "[localPath]" push
   ```
9. Write config to `$env:USERPROFILE\.claude\.workflows-repo` (two lines):
   ```
   [localPath]
   https://github.com/[username]/[name]
   ```
10. Write initial hash: `git -C "[localPath]" rev-parse HEAD` → save to `$env:USERPROFILE\.claude\.skills-hash`

Confirm:
> *"Done — your workflows repo is live at https://github.com/[username]/[name]. All future skill updates will come from there."*

---

**If the config file EXISTS — normal sync:**

1. Read local path (line 1) from `$env:USERPROFILE\.claude\.workflows-repo`
2. Pull latest: `git -C "[localPath]" pull`
3. Read stored hash from `$env:USERPROFILE\.claude\.skills-hash` — if missing, treat as first sync
4. Get current HEAD: `git -C "[localPath]" rev-parse HEAD`
5. Compare:
   - **Same hash:** do nothing, show nothing, move on
   - **Different hash (or no hash file):**
     a. Get changed files: `git -C "[localPath]" log --oneline --name-only [old-hash]..HEAD -- skills/`
     b. Copy skills: `Copy-Item -Recurse "[localPath]\skills\*" "$env:USERPROFILE\.claude\skills\" -Force`
     c. Write new hash to `$env:USERPROFILE\.claude\.skills-hash`
     d. Extract updated skill names and include in briefing box

---

## Phase 2 — Task & Last Session Review (automatic)

Silently gather context — always shown in the briefing.

**Active tasks:**
- Read `carry_over_tasks.md` — include every item in the Must Do bucket (Phase 4)
- If empty or missing, skip

**Last session:**
- Read the most recent session entry in `task_log.md` (the last `## Session —` block)
- Summarise in 1–2 lines what was done and what carried over

**Git log:**
- `git log --oneline -5` — summarise in plain English

---

## Phase 3 — Context Gathering (silent)

Gather this before asking the user anything. Do not narrate each step.

1. **GitHub** — open PRs (`gh pr list`), open issues (`gh issue list`)
2. **Calendar** (if connected) — today's meetings
3. **Jira** (if connected) — in-progress or blocked sprint tickets

---

## Phase 4 — Plan the Day

**Day-of-week awareness:**
- **Monday:** ask *"Any goals for the week?"* and add a **🗓 This Week** bucket above Must Do
- **Friday:** after the daily structure, ask *"It's Friday — want a quick review of the week?"* — if yes, summarise the last 5 days of git commits in plain English
- **Other days:** standard flow

Ask one question:

> **"What's the main thing you want to get done today?"**

Then combine with everything from Phase 2 and 3 and organise into three buckets:

### ✅ Must Do
- The user's stated main goal
- All items from `carry_over_tasks.md`
- Blocking GitHub items (failing CI, PRs waiting on them)
- Today's meetings
- Blocked Jira tickets

### 📋 Should Do
- Open GitHub issues or non-blocking PRs
- Non-urgent sprint tasks
- Secondary goals the user mentioned

### 🔁 Check Later
- GitHub notifications not assigned to the user
- Anything the user wants to revisit later

After confirming the buckets, **open today's session in `task_log.md`:**

```
## Session — [YYYY-MM-DD]

### Planned
[numbered list from carry_over_tasks.md + user's stated goal]
```

Add any tasks the user names to `carry_over_tasks.md` as well.

---

## Phase 5 — End-of-Session Save

When the user says they're done, commit and push automatically — no confirmation needed:
```
git add -A
git commit -m "[brief description of what was done] — [date]"
git push
```

Then confirm:
> *"All saved to GitHub — [date]."*

Only pause if:
- The user says "don't push yet"
- There is a merge conflict
- The branch has protection rules blocking a direct push

---

## Daily Briefing Report

Gather everything silently first, then print one single box.

```
════════════════════════════════════════
  DAILY PREP — [Day, Date]
════════════════════════════════════════
  GitHub      ✅ / ⚠️
  BigQuery    ✅ / ⚠️
  Gmail       ✅ / ⚠️
  Calendar    ✅ / ⚠️
  Jira        ✅ / ⚠️

  📅 MEETINGS TODAY
  [HH:MM]  [meeting title — attendees if known]

────────────────────────────────────────
  🕐 LAST SESSION — [date]
  [1–2 plain-English lines from task_log.md + git log]

────────────────────────────────────────
  📢 STANDUP
  ✅ Yesterday
     • [summary from last session's completed tasks]
  🔨 Today
     • [Must Do item 1]
     • [Must Do item 2]
  ⚠️ Blockers
     • [anything blocked — or "None"]

────────────────────────────────────────  ← only show if skills were updated
  🆕 SKILLS UPDATED
  • /[skill-name] — [one sentence: what it does]

────────────────────────────────────────
  ✅ MUST DO
  • [carry-over tasks + today's goal]

  📋 SHOULD DO
  • [task 1]

  🔁 CHECK LATER
  • [item 1]
════════════════════════════════════════
```

After printing, ask only: **"Anything to add or move between buckets?"** — adjust, update `carry_over_tasks.md` and the session log accordingly, then begin the first Must Do item.
