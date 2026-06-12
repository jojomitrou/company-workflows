---
name: prep
description: Use at the start of every VS Code session to run the daily workflow kickoff — verifies critical connections, gathers context, and organises the day into Must Do, Should Do, and Check Later.
---

# Daily Session Prep

Run this at the start of every session. It does three things in order: checks connections, gathers context, then structures the day.

---

## Phase 1 — Connections

### Blocking (must be ✅ before continuing)

**GitHub**
```
gh auth status
```
- **Pass:** "Logged in to github.com as [username]"
- **Fail:** run `gh auth login` — do not proceed until resolved

**Obsidian Vault**
Check for the vault folder in this order:
1. `C:\Users\jomit\OneDrive\Documents\vault`
2. `C:\Users\jomit\Documents\vault`
3. `C:\Users\jomit\vault`

- **Pass:** folder exists with at least one `.md` file
- **Fail:** ask the user to confirm vault path — do not proceed until resolved

### Non-blocking (check but do not block)

| Service | How to check | If failing |
|---------|-------------|------------|
| BigQuery | `gcloud auth list` | ⚠️ flag only if data work needed today |
| Gmail | Call `list_labels` via MCP | ⚠️ non-blocking |
| Google Calendar | Call `list_calendars` via MCP | ⚠️ non-blocking |
| Jira | Atlassian MCP call | ⚠️ flag only if ticket work needed today |
| Slack | Slack MCP `list_channels` | ⚠️ non-blocking |

---

## Phase 2 — Context Gathering

Once GitHub and Obsidian are confirmed, gather context before asking the user anything.

1. **Read Obsidian** — scan the vault for any notes from the last session, open todos, or flagged items. Look for files modified in the last 3 days.
2. **Check GitHub** — run `gh pr list` and `gh issue list` to see open PRs and issues assigned to the user
3. **Check Calendar** (if connected) — call `list_events` for today to see meetings scheduled
4. **Check Jira** (if connected) — look for in-progress or blocked tickets in the current sprint
5. **Check Slack** (if connected) — look for unread mentions or flagged messages

Do this silently — do not report each step. Just gather the information.

---

## Phase 3 — Daily Structure

Ask the user one question:

> **"What's the main thing you want to get done today?"**

Then, using what they say combined with everything gathered in Phase 2, organise the day into three buckets:

### ✅ Must Do
Tasks that absolutely need to happen today. These are either:
- What the user just said is the main goal
- Blocking items found in GitHub (PRs awaiting review, failing CI)
- Today's meetings from Calendar
- Blocked Jira tickets

### 📋 Should Do
Important but not urgent. These are:
- Open GitHub issues or non-blocking PRs
- Follow-ups from Obsidian notes
- Non-urgent Jira tasks in the sprint
- Items the user mentioned but aren't today's main focus

### 🔁 Check Later
Things to keep an eye on but not act on now:
- Slack threads or mentions that don't need immediate response
- GitHub notifications that aren't assigned to the user
- Ideas or notes from Obsidian flagged for "someday"
- Anything the user wants to park for later in the day

---

## Report

Print the full daily briefing once everything is done:

```
════════════════════════════════════════
  DAILY PREP — Quantum Media
  [Day, Date]
════════════════════════════════════════

  CONNECTIONS
  GitHub      ✅  @[username]
  Obsidian    ✅  [N] notes in vault
  BigQuery    ✅ / ⚠️
  Gmail       ✅ / ⚠️
  Calendar    ✅ / ⚠️
  Jira        ✅ / ⚠️
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

After printing, ask: **"Anything to add or move between buckets?"** — adjust based on their answer, then begin work on the first Must Do item.
