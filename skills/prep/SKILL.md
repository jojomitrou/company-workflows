---
name: prep
description: Use at the start of every VS Code session to run the daily workflow kickoff — verifies critical connections, ensures all work is saved to GitHub, gathers context, and organises the day into Must Do, Should Do, and Check Later.
---

# Daily Session Prep

Run this at the start of every session. The user may not be familiar with GitHub or Obsidian yet — be a friendly guide, not a technical gatekeeper. Explain things simply when needed.

The golden rule of every session: **everything the user works on must end up saved in a GitHub repository**. Notes, plans, code, decisions — all of it. GitHub is the safety net. Nothing should live only on the laptop.

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

Check whether the current VS Code folder is a git repository:
```
git status
```

**If pass (inside a repo):**
- Check for any uncommitted changes from the last session: `git status`
- If there are unsaved changes, commit and push immediately — no need to ask:
  ```
  git add -A
  git commit -m "Session save — [date]"
  git push
  ```
  Then note it in the briefing: *"Saved [N] uncommitted files from last session."*

**If fail (not a repo):**
Say —
> *"This folder isn't connected to GitHub yet. Let's set that up now — what would you like to call this project?"*

Then:
1. Run `git init`
2. Create a repo on GitHub: `gh repo create [name] --private --source=. --push`
3. Confirm it's live: `gh repo view --web`

Do not proceed until there is a GitHub repo for the current work.

---

### 1c — Obsidian Vault (blocking)

Check for vault folder in this order:
1. `C:\Users\jomit\OneDrive\Documents\vault`
2. `C:\Users\jomit\Documents\vault`
3. `C:\Users\jomit\vault`

**If pass:**
- Scan for notes modified in the last 3 days — use in Phase 2
- Check if the vault folder is a git repo: run `git -C [vault path] status`
  - **If not a repo:** set it up automatically —
    ```
    git -C [vault path] init
    gh repo create obsidian-vault --private --source=[vault path] --push
    ```
    Say: *"Your Obsidian vault is now backed up to GitHub — notes are safe."*
  - **If already a repo:** check for uncommitted notes and push automatically:
    ```
    git -C [vault path] add -A
    git -C [vault path] commit -m "Notes sync — [date]"
    git -C [vault path] push
    ```

**If fail:** say —
> *"I can't find your Obsidian vault. Open Obsidian, create a vault if you haven't already, then tell me the folder path — I'll save it here so I find it automatically next time."*

Update this skill with the confirmed vault path once known. Do not block if Obsidian is genuinely not installed yet — flag it as ⚠️ and continue.

---

### 1d — Everything Else (non-blocking)

Check these quietly and note status — do not block on any of them:

| Service | Check | If failing |
|---------|-------|------------|
| BigQuery | `gcloud auth list` | ⚠️ flag if data work needed today |
| Gmail | `list_labels` via MCP | ⚠️ non-blocking |
| Google Calendar | `list_calendars` via MCP | ⚠️ non-blocking |
| Jira | Atlassian MCP call | ⚠️ flag if ticket work needed today |
| Slack | Slack MCP `list_channels` | ⚠️ non-blocking |

---

## Phase 1d — Last Session Summary (optional)

Once GitHub and Obsidian are both ✅, ask:

> **"Would you like a quick note on what was done last time?"**

**If yes:** pull the last 5 git commits (`git log --oneline -5`) and the most recently modified Obsidian note, then give a 3–5 line plain-English summary of what was worked on. Keep it brief — just enough to jog the memory.

**If no:** skip straight to Phase 2.

---

## Phase 2 — Context Gathering (silent)

Gather this before asking the user anything. Do not narrate each step — just collect it.

1. **Obsidian** — recent notes, open todos, anything flagged from last session
2. **GitHub** — open PRs (`gh pr list`), open issues (`gh issue list`)
3. **Calendar** (if connected) — today's meetings via `list_events`
4. **Jira** (if connected) — in-progress or blocked sprint tickets
5. **Slack** (if connected) — unread mentions or flagged threads

---

## Phase 3 — Plan the Day

**Day-of-week awareness:**
- **Every day:** silently check Obsidian for active plans at all levels and fold any relevant goals into the daily buckets:
  - `_weeks/YYYY-WXX.md` — current week's goals → fold into Must Do / Should Do
  - `_months/YYYY-MM.md` — current month's goals → fold into Should Do if not already there
  - `_quarters/YYYY-QX.md` — current quarter's goals → flag any that need progress this week
  - If a plan file doesn't exist at any level, suggest running `/week`, `/month`, or `/quarter` to create it
- **Monday specifically:** if no week plan exists, ask *"Any goals for the week?"* and add a **🗓 This Week** bucket above Must Do
- **Friday:** after the daily structure, add *"It's Friday — want a quick review of the week before we start?"* — if yes, summarise the last 5 days of git commits and Obsidian notes in plain English
- **Other days:** standard flow below

Ask one question:

> **"What's the main thing you want to get done today?"**

Then combine their answer with everything from Phase 2 and organise into three buckets:

### ✅ Must Do
Non-negotiable for today:
- The user's stated main goal
- Blocking GitHub items (failing CI, PRs waiting on them)
- Today's meetings
- Blocked Jira tickets

### 📋 Should Do
Important but can slip to tomorrow if needed:
- Open GitHub issues or non-blocking PRs
- Obsidian follow-ups from recent notes
- Non-urgent sprint tasks
- Secondary goals the user mentioned

### 🔁 Check Later
Park these — don't act now:
- Slack threads not needing immediate reply
- GitHub notifications not assigned to the user
- Obsidian "someday" ideas
- Anything the user wants to revisit later in the day

---

## Phase 4 — End-of-Session Save

At the end of every session (or when the user says they're done), do both steps automatically — no confirmation needed:

**Step 1 — Commit and push:**
```
git add -A
git commit -m "[brief description of what was done] — [date]"
git push
```

**Step 2 — Write Obsidian session note:**
Create a new `.md` file in the vault at `_sessions/YYYY-MM-DD.md` with this structure:
```
# Session — [Date]

## What we worked on
[2–4 plain-English sentences summarising what was done]

## Decisions made
[Any choices or directions agreed during the session]

## What's next
[The top 1–2 things to pick up next time, from today's Should Do or Check Later]
```

Then confirm:
> *"All saved to GitHub and noted in Obsidian — [date]."*

**Default behaviour:** Always commit, push, and write the note automatically. Only pause and ask if:
- The user explicitly says "don't push yet"
- There is a merge conflict
- The branch has protection rules that block a direct push

---

## Daily Briefing Report

```
════════════════════════════════════════
  DAILY PREP — Quantum Media
  [Day, Date]
════════════════════════════════════════
  CONNECTIONS
  GitHub      ✅  @[username] — repo: [repo name]
  Obsidian    ✅  [N] notes — [N] updated recently
  BigQuery    ✅ / ⚠️
  Gmail       ✅ / ⚠️
  Calendar    ✅ / ⚠️
  Jira        ⚠️  (flag if needed today)
  Slack       ✅ / ⚠️

────────────────────────────────────────
  ✅ MUST DO
  • [task 1]
  • [task 2]

  📋 SHOULD DO
  • [task 1]
  • [task 2]

  🔁 CHECK LATER
  • [item 1]
  • [item 2]
════════════════════════════════════════
```

Ask: **"Anything to add or move between buckets?"** — adjust, then begin the first Must Do item.
