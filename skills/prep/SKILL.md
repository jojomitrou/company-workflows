---
name: prep
description: Use at the start of every VS Code session to run the daily workflow kickoff — verifies critical connections, ensures all work is saved to GitHub, gathers context, and organises the day into Must Do, Should Do, and Check Later.
version: 2.6
origin: company
---

# Daily Session Prep

Run this at the start of every session.

The golden rule of every session: **everything the user works on must end up saved in a GitHub repository**. Notes, plans, code, decisions — all of it. GitHub is the safety net. Nothing should live only on the laptop. This now includes the task files themselves (see below) — they live in your personal workflows repo, not in `~/.claude`.

**Task files (always these paths):**
- Active tasks: `[personal_path]\tasks\carry_over_tasks.md`
- Session log:  `[personal_path]\tasks\task_log.md`

`[personal_path]` = the `personal_path` field of `$env:USERPROFILE\.claude\.workflows.json`. If that file doesn't exist yet, Phase 1d below bootstraps or migrates it first.

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

### 1d — Personal Workflows Repo & Skill Updates (silent)

**Config file:** `$env:USERPROFILE\.claude\.workflows.json`
```json
{
  "company": "Quantum Media",
  "upstream": "jojomitrou/company-workflows",
  "upstream_ref": "<last-applied commit sha>",
  "personal_repo": "https://github.com/<user>/daily_workflows",
  "personal_path": "<local clone path>",
  "sync_skills": ["prep", "wrap", "week", "month", "quarter", "radar", "skills-status"],
  "company_zone_hashes": { "prep": "<sha256>", "wrap": "<sha256>" },
  "pin_updates": false,
  "company_rollup_opt_in": false
}
```

This one file replaces three older ones (`.workflows-repo`, `.company`, `.skills-hash`) — see Migration below if you're carrying those forward. `company_rollup_opt_in` is a Phase C field (see `docs/COMPANY-TARGETS-DESIGN.md`) — off by default, `/prep` never sets it; it's a manual opt-in edited by hand.

---

**If `.workflows.json` does NOT exist and none of the three old dotfiles exist either — bootstrap (first run ever):**

Say:
> *"This is your first time running /prep. Let's create your personal workflows repo so your skills — and your task history — live somewhere you control."*

1. Ask: **"What's your company or team name?"**
2. Get GitHub username: `gh api user --jq .login`
3. Create the repo: `gh repo create [username]/daily_workflows --private`
4. Clone it to `C:\Users\[username]\Documents\git repos\daily_workflows` (this becomes `personal_path`)
5. Copy the 7 core skills into it (never the whole local skills folder — other locally-installed skills are personal/opt-in, not team-shared):
   `Copy-Item -Recurse "$env:USERPROFILE\.claude\skills\{prep,wrap,week,month,quarter,radar,skills-status}" "[personal_path]\skills\" -Force`
6. Create the tasks folder with starter files (`carry_over_tasks.md`, `task_log.md`) if they don't already exist.
7. Commit and push the personal repo (`init: bootstrap workflows repo`).
8. Compute `company_zone_hashes` for each of the 7 skills from the files just copied — see **Stripping company zones** below.
9. Write `.workflows.json`: `company` from step 1, `upstream: "jojomitrou/company-workflows"`, `upstream_ref` = `gh api repos/jojomitrou/company-workflows/commits/main --jq .sha`, `personal_repo`/`personal_path` from steps 3–4, `sync_skills` = the 7 names, the hashes from step 8, `pin_updates: false`.

Confirm:
> *"Done — your workflows repo is live at [url]. `/prep` is now the only place skill updates come from — you'll never need to re-run an install command again."*

---

**If the three old dotfiles exist but `.workflows.json` doesn't — migrate (one-time, automatic):**

1. Build `.workflows.json`: `personal_path`/`personal_repo` from `.workflows-repo`'s two lines; `company` from `.company` (omit the field if that file's missing); `upstream: "jojomitrou/company-workflows"`; `sync_skills` = the 7 core skills; `pin_updates: false`.
2. Set `upstream_ref` to the **current** upstream HEAD (`gh api repos/jojomitrou/company-workflows/commits/main --jq .sha`) — there's no earlier recorded position to resume from, so "right now" becomes the baseline.
3. For each of the 7 skills, compute `company_zone_hashes[skill]` from the **current local file** (see Stripping company zones below). Any company-zone hand-edit made before today quietly becomes the new accepted baseline on this one pass — normal edit-detection resumes on the next real update.
4. Cleanup offer — count folders in `[personal_path]/skills/` that aren't one of the 7 core skills. If more than zero, ask once:
   > *"Your workflows repo has {N} extra skills synced in from before (e.g. GSD packs) — never meant to be tracked here. Remove them from the repo? They stay installed locally — this only stops them being tracked in `daily_workflows`."*
   - Yes: `git -C "[personal_path]" tag "pre-cleanup-{today}"` first (recoverable), then `git -C "[personal_path]" rm -r skills/{name}` for each extra folder, commit, push.
   - No / not now: skip, don't ask again this migration.
5. Rename the three old files to `.bak` (never delete outright): `.workflows-repo.bak`, `.company.bak`, `.skills-hash.bak`.
6. Write `.workflows.json`.

Note once in the briefing: *"Migrated to the new update system — nothing lost, old config backed up as `.bak`."*

---

**Stripping company zones** (used by the hash step above and the update algorithm below):

Find every `<!-- personal:{name}:start -->` … `<!-- personal:{name}:end -->` pair in the file and delete everything strictly between the two anchor lines, keeping the anchor lines themselves. What's left is the "company-zone skeleton." To hash it: write the skeleton to a temp file and run `Get-FileHash -Algorithm SHA256 -Path [tempfile] | Select-Object -ExpandProperty Hash`.

> **Anchor-name caveat (also found during B1 testing):** real anchor names are always lowercase kebab-case (`project-state`, `lookup-table`, etc. — never uppercase, never a bare word like `name`). Match strictly on that shape (e.g. `[a-z][a-z0-9-]*`). A looser pattern will also match this very paragraph's own `{name}` placeholder text as if it were a real anchor pair — which is exactly the false-positive this caveat exists to prevent.

> **Encoding warning (found the hard way during B1 testing):** Windows PowerShell 5.1's default `Get-Content -Raw` / `Set-Content -Encoding utf8` mangles em-dashes and arrows on read (codepage mojibake) — it silently corrupts every skill file it touches. Read and write with explicit UTF-8, no BOM, instead: `[System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)` to read, and a `New-Object System.Text.UTF8Encoding $false` writer (`[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)`) to write. Do this for every read/write in this update algorithm, not just the hashing step.

---

**Every run — check for updates** (after bootstrap/migration, if either ran):

1. `gh api repos/{upstream}/commits/main --jq .sha` → call it `latest`. If this call fails (offline, unreachable) — skip the rest of this section silently, note *"update check skipped (offline)"* in the briefing, never block `/prep` on it.
2. If `latest == upstream_ref`: nothing to do, say nothing, move on.
3. If `pin_updates: true`: note *"updates available (pinned)"* in the briefing, apply nothing, move on.
4. Otherwise, shallow-clone upstream once for this run: `git clone --depth 1 https://github.com/{upstream} "$env:TEMP\cw-update"`.
5. For each skill in `sync_skills`:
   a. Not installed locally yet (new skill added upstream since your last update)? Copy it straight in from the clone, note it as newly installed, move to the next skill.
   b. Read local file `L` and upstream file `U` (from the clone).
   c. Extract every `<!-- personal:{name}:start/end -->` block from `L` into a map `{name → content}`.
   d. Strip `L`'s company zones and hash the result — compare to `company_zone_hashes[skill]`.
      - **Match** → you haven't touched the company zone since the last update — proceed.
      - **Mismatch** → you edited inside the company zone. Save the full current `L` to `[personal_path]\backups\{skill}-{today}.md`, commit + push that backup to the personal repo, then proceed with the update anyway. Queue a loud briefing line: *"Your edits inside /{skill}'s company zone were preserved at `backups/{skill}-{today}.md` — move anything you want to keep into a personal block."*
   e. Take `U` wholesale as the new content. For each `{name → content}` extracted from `L`, find the matching `<!-- personal:{name}:start/end -->` pair in `U` and insert `content` between them.
      - Anchor missing in `U` (upstream removed or renamed it)? Append the orphaned content under a `## Recovered personal content` heading at the end of `U` instead, and note it in the briefing. Personal content is never deleted by an update — worst case it lands at the end of the file with a notice.
   f. Write the merged result to `~/.claude/skills/{skill}/SKILL.md`.
   g. Recompute `company_zone_hashes[skill]` from the merged file.
6. Delete the temp clone: `Remove-Item -Recurse -Force "$env:TEMP\cw-update"`.
7. Before deleting it, read `docs/CHANGELOG.md` from the clone and pull the entries for whichever skills changed — these become the briefing's `🆕 SKILLS UPDATED` lines.
8. Set `upstream_ref = latest`, write `.workflows.json`.

*(The setup guide's Step 7 install one-liner is install-only — first run. This update check is the only update channel; never re-run the install one-liner to "update" — it would blow past this whole mechanism with a raw overwrite.)*

---

**Keeping task files fresh across machines:** before Phase 2 reads them, run `git -C "[personal_path]" pull` (best-effort — if it fails, e.g. offline, just proceed with the local copy, no error shown).

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
6. Never `Copy-Item -Force` a company skill file — the extract-reinject algorithm in 1d is the only write path.
7. Never delete or overwrite personal-block content, on update or migration — worst case it's recovered at the end of the file with a notice.
8. Never resolve a company-zone edit silently — back it up and say so, in either direction.
9. Never ship an upstream skill release without a version bump and a `docs/CHANGELOG.md` line.
10. Never reintroduce a second update channel — the setup guide's install one-liner is first-run only, `/prep` is the only updater.
