---
name: prep
description: Use at the start of every VS Code session to run the daily workflow kickoff — verifies critical connections, ensures all work is saved to GitHub, gathers context, and organises the day into Must Do, Should Do, and Check Later.
version: 2.0
origin: company
---

# Daily Session Prep

Run this at the start of every session.

The golden rule of every session: **everything the user works on must end up saved in a GitHub repository**. Notes, plans, code, decisions — all of it. GitHub is the safety net. Nothing should live only on the laptop. This now includes the task files themselves (see below) — they live in your personal workflows repo, not in `~/.claude`.

**Task files (always these paths):**
- Active tasks: `[personal_path]\tasks\carry_over_tasks.md`
- Session log:  `[personal_path]\tasks\task_log.md`

`[personal_path]` = line 1 of `$env:USERPROFILE\.claude\.workflows-repo`. If that file doesn't exist yet, Phase 1d below bootstraps it first.

---

## Phase 0 — Boundary-Day Offer

Before anything else, check today's date against the cadence skills so nobody gets asked the same planning question twice. Fire **at most one** offer — coarsest period wins:

1. **Quarter start** (first 3 days of Jan/Apr/Jul/Oct) → offer to run `/quarter` (PLAN) now.
2. **Quarter end** (last 3 days of Mar/Jun/Sep/Dec) → offer `/quarter` (RETRO).
3. **Month start** (days 1–3, and not already covered by #1) → offer `/month` (PLAN).
4. **Month end** (last 3 calendar days of the month, and not already covered by #2) → offer `/month` (RETRO).
5. **Monday** (and not already covered above) → offer `/week` (PLAN).
6. **Friday** (and not already covered above) → offer `/week` (RETRO).
7. Otherwise → no offer, continue straight to Phase 1.

If the user accepts, run that skill's mode to completion first, then continue into Phase 1 of `/prep` — feed its output into today's Must Do (e.g. this week's goals). If they decline, continue normally. **`/prep` never asks its own version of these questions** — Phase 4 no longer has a Monday or Friday special case; that logic lives here and nowhere else.

---

## Phase 1 — Foundation Check

### 1a — GitHub (blocking)

Run:
```
gh auth status
```

**If pass:** move on.

**If fail:** say —
> *"You're not logged into GitHub yet. Type `gh auth login` in the terminal and follow the steps — I'll walk you through it if you need."*

Do not proceed until GitHub is connected.

---

### 1b — GitHub Repo for Today's Work (blocking on repo existence, never blocking on the push)

Check whether the current folder is a git repository:
```
git status
```

**If pass (inside a repo) and there are uncommitted changes:**
- Run `git status --short` and show the user a 3-line summary (file count + names, truncated if more).
- Ask: **"Save these to GitHub now?"** (default yes — a plain "yes"/enter is enough).
- If yes:
  ```
  git add -A
  git commit -m "Session save — [date]"
  git push
  ```
- If no: note it and continue — don't ask again this session.

**If fail (not a repo):**
- **Folder sanity check first** — if the current folder is a home-level folder (`~`, `Desktop`, `Downloads`, `Documents` root, the OneDrive root, or similar), do NOT offer to repo-ify it. Say: *"This looks like a general folder, not a project — skipping repo setup here. `cd` into the actual project folder if you want one set up."*
- Otherwise, say —
  > *"This folder isn't connected to GitHub yet. Want me to set it up? What would you like to call this project?"*
  If yes:
  1. `git init`
  2. `gh repo create [name] --private --source=. --push`
- Never block the rest of `/prep` on this either way.

---

### 1c — Service Checks (non-blocking)

Run all of these quietly and note status — do not block on any of them:

| Service | Check | If failing |
|---------|-------|------------|
| BigQuery | `gcloud auth list` | ⚠️ flag if data work needed today |
| Gmail | `list_labels` via MCP | ⚠️ non-blocking |
| Google Calendar | `list_events` via MCP for today | ⚠️ non-blocking |
| Jira | Atlassian MCP call | ⚠️ flag if ticket work needed today |

A service that was never set up for this role at install time should render `— not set up` instead of `⚠️` once the role-based install list exists (setup guide v2). Until then, `⚠️` covers both "failing" and "never configured" — don't over-claim a distinction the install flow doesn't support yet.

---

### 1d — Personal Workflows Repo (silent)

Check whether the user has a personal workflows repo configured.

**Config file:** `$env:USERPROFILE\.claude\.workflows-repo`
Format: line 1 = local path, line 2 = GitHub URL

**Company name file:** `$env:USERPROFILE\.claude\.company` — plain text, used in the briefing header. If missing, just omit the company line rather than asking every session.

---

**If the config file does NOT exist — bootstrap (first run only):**

Say:
> *"This is your first time running /prep. Let's create your personal workflows repo so your skills — and your task history — live somewhere you control."*

1. Ask: **"What's your company or team name?"** → write to `$env:USERPROFILE\.claude\.company`
2. Get GitHub username: `gh api user --jq .login`
3. Create the repo: `gh repo create [username]/daily_workflows --private`
4. Clone it to `C:\Users\[username]\Documents\git repos\daily_workflows`:
   `git clone https://github.com/[username]/daily_workflows "C:\Users\[username]\Documents\git repos\daily_workflows"`
5. Copy only the 5 core skills into it (never the whole local skills folder — other locally-installed skills are personal/opt-in, not team-shared):
   `Copy-Item -Recurse "$env:USERPROFILE\.claude\skills\{prep,wrap,week,month,quarter}" "C:\Users\[username]\Documents\git repos\daily_workflows\skills\" -Force`
6. Create the tasks folder with empty starter files:
   `New-Item -ItemType Directory -Force "C:\Users\[username]\Documents\git repos\daily_workflows\tasks"`, then write a minimal `carry_over_tasks.md` (`# Carry-Over Tasks`) and `task_log.md` (`# Task Log`) if they don't already exist.
7. Commit and push:
   ```
   git -C "C:\Users\[username]\Documents\git repos\daily_workflows" add -A
   git -C "C:\Users\[username]\Documents\git repos\daily_workflows" commit -m "init: bootstrap workflows repo"
   git -C "C:\Users\[username]\Documents\git repos\daily_workflows" push
   ```
8. Write config to `$env:USERPROFILE\.claude\.workflows-repo` (two lines):
   ```
   C:\Users\[username]\Documents\git repos\daily_workflows
   https://github.com/[username]/daily_workflows
   ```
9. Write initial hash: `git -C "C:\Users\[username]\Documents\git repos\daily_workflows" rev-parse HEAD` → save to `$env:USERPROFILE\.claude\.skills-hash`

Confirm:
> *"Done — your workflows repo is live at https://github.com/[username]/[name]. All future skill updates will come from there, and your task history now lives there too."*

---

**If the config file EXISTS — normal sync:**

1. Read local path (line 1) from `$env:USERPROFILE\.claude\.workflows-repo`
2. Pull latest: `git -C "[localPath]" pull`
3. Read stored hash from `$env:USERPROFILE\.claude\.skills-hash` — if missing, treat as first sync
4. Get current HEAD: `git -C "[localPath]" rev-parse HEAD`
5. Compare:
   - **Same hash:** do nothing, show nothing, move on
   - **Different hash (or no hash file):**
     a. Get changed files, scoped to the 5 core skills only: `git -C "[localPath]" log --oneline --name-only [old-hash]..HEAD -- skills/prep skills/wrap skills/week skills/month skills/quarter`
        (the repo may contain other skills too — those are opt-in personal installs, never auto-synced down)
     b. Copy just those 5: `Copy-Item -Recurse "[localPath]\skills\{prep,wrap,week,month,quarter}" "$env:USERPROFILE\.claude\skills\" -Force`
     c. Write new hash to `$env:USERPROFILE\.claude\.skills-hash`
     d. Extract updated skill names and include in briefing box

*(This whole-file copy is the known limitation this version still has — the anchored personal-zone-preserving update engine is the next phase, tracked separately. Until then, treat re-running this step as safe only because your own personal additions live in the `<!-- personal:... -->` blocks below, which you maintain by hand if you touch this file directly.)*

---

<!-- personal:daily-checks:start -->
<!-- personal:daily-checks:end -->

## Phase 2 — Task & Project State Review (automatic)

Silently gather context — always shown in the briefing. No question needed.

**Active tasks:**
- Read `carry_over_tasks.md` (from the personal repo tasks path above) — include every item in the Must Do bucket (Phase 4). Each line carries a `target:` field per the schema below — surface it quietly, it's not for the user to manage by hand.

**Task line schema** (defined once, here — every skill that touches this file uses it):
```
- [ ] {id} | {M/S/L} | {text} | added:{date} | target:{goal-id|—}
```
`{id}` is a short stable slug; `{M/S/L}` is Must/Should/Later priority; `target:` links to a week-goal id from the cascade (see `/week`) or `—` if standalone.

**Last session:**
- Read the most recent session entry in `task_log.md` (the last `## Session —` block)
- Summarise in 1–2 lines what was done and what carried over

**Git log:**
- `git log --oneline -5` (current project folder) — summarise in plain English

<!-- personal:project-state:start -->
### Project State (personal extension — active projects)

Add project-specific checks here if you track more than one active repo day to day. Example pattern:

```
git -C "[path to project A]" log --oneline -5
git -C "[path to project B]" log --oneline -5
```

Summarise each in 1–2 plain-English lines and show under a `🔧 PROJECT STATE` block in the briefing. If a project has its own pending-task skill (e.g. an on-site/VPN-gated task list), read it here too and surface pending items under Should Do with any access requirement flagged.
<!-- personal:project-state:end -->

---

## Phase 3 — Context Gathering (silent)

Gather this before asking the user anything. Do not narrate each step.

1. **GitHub** — open PRs (`gh pr list`), open issues (`gh issue list`)
2. **Calendar** (if connected) — today's meetings
3. **Jira** (if connected) — in-progress or blocked sprint tickets

---

## Phase 4 — Plan the Day

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
- (personal extension) any project-specific pending tasks surfaced in Phase 2

### 🔁 Check Later
- GitHub notifications not assigned to the user
- Anything the user wants to revisit later

After confirming the buckets, **open today's session in `task_log.md`:**

```
## Session — [YYYY-MM-DD]

### Planned
[numbered list from carry_over_tasks.md + user's stated goal]
```

Add any tasks the user names to `carry_over_tasks.md` as well, using the schema above (`target:` = `—` unless it clearly advances a live week goal).

---

When the user is done for the session, run `/wrap` — it owns closing the log, saving, and setting up tomorrow. `/prep` does not duplicate that logic.

---

## Daily Briefing Report

Gather everything silently first, then print one single box. Read the company name from `$env:USERPROFILE\.claude\.company` if present; omit that line entirely if the file doesn't exist.

```
════════════════════════════════════════
  DAILY PREP — [Company name, if set]
  [Day, Date]
════════════════════════════════════════
  GitHub      ✅  @[username]  /  ⚠️
  BigQuery    ✅ / ⚠️
  Gmail       ✅ / ⚠️ / — not set up
  Calendar    ✅ / ⚠️ / — not set up
  Jira        ✅ / ⚠️ / — not set up

  📅 MEETINGS TODAY
  [HH:MM]  [meeting title — attendees if known]

────────────────────────────────────────  ← personal extension: only if Phase 2's project-state block is filled in
  🔧 PROJECT STATE
  [project]  [1–2 lines: last feature/fix worked on]

────────────────────────────────────────
  🕐 LAST SESSION — [date]
  [1–2 plain-English lines from task_log.md]

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

────────────────────────────────────────  ← only show if Phase 0 fired
  🗓 [WEEK/MONTH/QUARTER] [PLAN/RETRO] RAN FIRST
  • [one-line result, e.g. "3 week goals set, tagged to July's month goals"]

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

<!-- personal:briefing-extras:start -->
<!-- personal:briefing-extras:end -->

---

## Never-do

1. Never push without showing what's being pushed (the 3-line summary + confirm in 1b).
2. Never force-create a repo — offer, and never for a home-level folder.
3. Never re-ask a question another skill owns (Phase 0 owns all cadence-boundary questions; `/wrap` owns end-of-session).
4. Never show ⚠️ for a service dressed up as broken when it was simply never set up, once the role-based install list exists to tell the difference.
5. Never store task files outside the personal repo.
