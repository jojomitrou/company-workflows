---
name: prep
description: Use at the start of every VS Code session to verify GitHub, BigQuery, Obsidian, Gmail, Google Calendar, Jira, and Slack are connected and ready before starting any work.
---

# Session Prep

Run this at the start of every session. Check all six connections and report status before doing anything else.

---

## Step 1 — GitHub

Run:
```
gh auth status
```
- **Pass:** output includes "Logged in to github.com as [username]"
- **Fail:** run `gh auth login` to fix

---

## Step 2 — BigQuery

Run:
```
gcloud auth list
gcloud auth application-default print-access-token
```
- **Pass:** an account is marked ACTIVE and a token string prints
- **Fail:** run `gcloud auth application-default login` to fix

---

## Step 3 — Obsidian Vault

Check whether the vault folder exists, in this order:
1. `C:\Users\jomit\OneDrive\Documents\vault`
2. `C:\Users\jomit\Documents\vault`
3. `C:\Users\jomit\vault`

Count the `.md` files found.

- **Pass:** folder exists and contains at least one `.md` file
- **Fail:** ask the user to confirm the vault path, then update this skill

---

## Step 4 — Gmail

Call the Gmail MCP tool to list labels (a lightweight read with no side effects):
- Use: `list_labels`
- **Pass:** returns a list of Gmail labels
- **Fail:** MCP returned an auth error or no response — tell the user to re-authenticate Gmail in Claude settings

---

## Step 5 — Google Calendar

Call the Google Calendar MCP tool to list calendars:
- Use: `list_calendars`
- **Pass:** returns at least one calendar
- **Fail:** MCP returned an auth error — tell the user to re-authenticate Google Calendar in Claude settings

---

## Step 6 — Jira (Atlassian)

Call the Atlassian MCP to check connectivity. Try fetching the user's profile or project list.
- MCP server: `plugin:pm-skills:atlassian` at `https://mcp.atlassian.com/v1/sse`
- **Pass:** returns valid data (profile, projects, or issues)
- **Fail:** MCP shows "Needs authentication" — walk the user through these steps:
  1. Type `/mcp` in the Claude chat to see all connected services
  2. Find **Atlassian** — it will show "Needs authentication"
  3. Claude will provide a link — open it with **Ctrl + left-click**
  4. Log in with your Atlassian work account in the browser
  5. Return to VS Code and re-run `/prep` to confirm it's connected

---

## Step 7 — Slack

Try calling the Slack MCP to list channels:
- MCP server: `slack` via `@modelcontextprotocol/server-slack`
- **Pass:** returns a list of Slack channels
- **Fail (MCP not configured):** walk the user through setup:
  1. Go to **https://api.slack.com/apps** and click **Create New App → From scratch**
  2. Name it (e.g. "Claude Code") and select the Quantum Media workspace
  3. Go to **OAuth & Permissions** and add these Bot Token Scopes:
     `channels:read`, `channels:history`, `groups:read`, `groups:history`, `users:read`, `chat:write`
  4. Click **Install to Workspace** and copy the **Bot User OAuth Token** (starts with `xoxb-`)
  5. In VS Code terminal run:
     ```
     claude mcp add slack -e SLACK_BOT_TOKEN=xoxb-your-token-here -- npx -y @modelcontextprotocol/server-slack
     ```
  6. Restart Claude and re-run `/prep`
- **Fail (auth error):** token may have expired — repeat steps 4–6 with a fresh token

---

## Report

Run all seven checks, then print one status block:

```
────────────────────────────────────────
  SESSION PREP — Quantum Media
────────────────────────────────────────
  GitHub          ✅  logged in as @[username]
  BigQuery        ✅  active: [email]
  Obsidian        ✅  vault found — [N] notes
  Gmail           ✅  connected
  Google Calendar ✅  connected — [N] calendars
  Jira            ✅  connected
  Slack           ✅  connected — [N] channels
────────────────────────────────────────
  All systems go. Ready to work!
────────────────────────────────────────
```

If anything fails, show the fix inline:

```
────────────────────────────────────────
  SESSION PREP — Quantum Media
────────────────────────────────────────
  GitHub          ✅  OK
  BigQuery        ❌  not authenticated
                  → run: gcloud auth application-default login
  Obsidian        ✅  OK
  Gmail           ✅  OK
  Google Calendar ✅  OK
  Jira            ❌  needs authentication
                  → type /mcp → find Atlassian → Ctrl+click link → log in
  Slack           ❌  not configured
                  → see Step 7 above for full setup instructions
────────────────────────────────────────
  Fix the above before starting work.
────────────────────────────────────────
```

Do not proceed with any other task until all six show ✅.
