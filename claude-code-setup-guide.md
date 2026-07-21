# How to Set Up Claude Code (From Zero!)

> Think of Claude Code like a super-smart helper that lives in your computer and can write code, talk to databases, and help you get things done. This guide gets you through **Core Setup** first — everyone does this, ~30 minutes, and `/prep` will work end to end when you're done. After that, pick the **Role Add-ons** that match your job. Don't worry — just do one thing at a time!

---

# Core Setup (Everyone)

## Step 1 — Install VS Code (Where You'll Do Everything)

VS Code is like your workbench — it's where you open files, run Claude Code, and see everything happen. Think of it as Microsoft Word, but for code.

1. Go to: **https://code.visualstudio.com**
2. Click the big blue **"Download for Windows"** button
3. Run the installer — keep clicking Next (leave all the default tick boxes as they are)
4. When it's done, open VS Code from your Start menu
5. Now install the **Claude Code extension** inside VS Code:
   - Click the little building-blocks icon on the left side bar (called "Extensions")
   - In the search box type: `Claude Code`
   - Click **Install** on the one made by Anthropic
6. Done! You'll now see a Claude Code panel inside VS Code.

> **Why VS Code?** It's free, everyone uses it, and Claude Code runs beautifully right inside it — no switching between windows.

---

## Step 2 — Get Node.js (Claude Code needs this to run)

Node.js is like the engine that makes Claude Code go. Without it, nothing works!

1. Go to: **https://nodejs.org**
2. Click the big green button that says **"Get Node.js"**
3. On the next page, click the green button to **download the Windows installer**
4. Run the installer — just keep clicking "Next" until it's done
5. When it's finished, open a new terminal inside VS Code (go to **Terminal → New Terminal** at the top menu) and type:
   ```
   node --version
   ```
   If you see a number like `v22.x.x` — you're good!

---

## Step 3 — Install Claude Code

Claude Code is the main tool. It's like the brain of the whole operation.

In the VS Code terminal type this exactly:
```
npm install -g @anthropic-ai/claude-code
```

Then check it worked:
```
claude --version
```

> **What is a terminal inside VS Code?** Go to the top menu, click **Terminal**, then **New Terminal**. A panel will appear at the bottom — that's where you type commands.

---

## Step 4 — Install the GitHub CLI (called "gh")

This lets Claude Code talk to GitHub — where all your code files live online.

> **No GitHub account yet?** Go to **https://github.com/signup** first and create one (free) — any username, your work email is fine. Come back here once you're logged in on github.com in your browser.

1. Go to: **https://cli.github.com**
2. Use the dropdown, select Windows Install and Click **"Download for Windows"**
3. Run the installer — keep clicking Next
4. After it installs, open a **new** terminal in VS Code, type `claude` and press **Enter**. This starts Claude — wait until you see it ready.
5. Now type:
   ```
   ! gh auth login
   ```
6. It will ask you some questions:
   - Choose **GitHub.com**
   - Choose **HTTPS**
   - Choose **Login with a web browser**
   - A code will appear — this **8-digit code is shown directly in your VS Code terminal**, and it is the **first line** that appears after you run `gh auth login`. Copy it, then press Enter.

   > **Tip:** If the browser doesn't open automatically, hold **Ctrl** and **left-click** on the link in the terminal — it will open in your browser.

   - It will open your browser — paste the code and approve it. If you're not logged into github.com yet, it'll show a login page with a "Create an account" link — sign up there, then continue.
7. Done! Claude Code can now read and save your GitHub files.

> **Why do we need this?** Because all our code (SQL, dashboards, etc.) is stored on GitHub. This is how Claude Code fetches and saves changes.

---

## Step 5 — Connect Your Work Tools (Gmail, Calendar, Jira)

These aren't a separate install — they're **Connectors** on your Anthropic account (claude.ai). Turn them on once there, and they become available inside Claude Code automatically, since it's the same login.

1. Go to **https://claude.ai** in your browser and log in with your work account
2. Click your profile in the bottom-left → **Settings** → **Connectors**
3. Connect each of these (one click each, then authorize with your work account when prompted):
   - **Gmail**
   - **Google Calendar**
   - **Atlassian** (this is what gives you Jira)
4. Back in VS Code, start (or restart) a Claude Code session and type:
   ```
   /mcp
   ```
   You should see Gmail, Google Calendar, and Atlassian listed — that confirms they're live.

> **Why this matters:** `/prep` checks all three of these every morning as part of your daily briefing (meetings, tickets). Skip this step and `/prep` will flag them — connect whenever you're ready, it won't block anything else.

---

## Step 6 — Start Claude Code & Set Your Permission Mode

You're ready! But before you start, you need to open a **project folder**.

**Why do you need a project folder?**
Think of it like this — Claude Code is very smart, but it needs to know *where* it is. A project folder is like giving Claude a desk to work at. All the files it reads, writes, and changes will live in that folder. Without one, it doesn't know where to save things or what files belong to your work. It's like asking someone to tidy your room but not telling them which room.

To open your project folder, go to **File → Open Folder** in VS Code and choose the folder where your work lives (for example, your GitHub repository folder).

Once the folder is open, open a terminal and type:
```
claude
```

That's it. A screen will appear at the bottom and you can start talking to it like a chat — right inside VS Code.

> [!IMPORTANT]
> **Understanding permission prompts**
>
> By default, Claude Code asks before running commands, editing files, or using tools. This is the safe, recommended default — especially in your first few weeks, and always when you're touching shared or production systems (a repo other people rely on, anything that can `git push`, anywhere real data lives).
>
> **If a specific repetitive action gets tedious** (e.g. approving the same safe read-only command over and over), you can approve it "always" the next time it's asked, or switch the whole session to **Auto** mode via `/config` → **"Default permission mode"**.
>
> ⚠️ **What Auto actually means, concretely:** Claude will run commands, edit files, and push to GitHub without asking first, for the rest of that session. That's fine for repetitive low-risk work you're supervising anyway — it is **not** a "set once and forget" toggle for shared or production repos. If you're ever unsure, leave it as **Default** — you lose nothing but a couple of extra clicks, and you can switch back the same way at any time.

---

## Step 7 — Install Company Skills

Your team has a shared set of skills already built and ready to use — `/prep`, `/wrap`, `/week`, `/month`, `/quarter`, `/radar`, and `/skills-status`. One command pulls them all down.

Open a terminal in VS Code and run:

```powershell
git clone https://github.com/jojomitrou/company-workflows "$env:TEMP\qm-skills"; Copy-Item -Recurse "$env:TEMP\qm-skills\skills\*" "$env:USERPROFILE\.claude\skills\"; Remove-Item -Recurse -Force "$env:TEMP\qm-skills"
```

That's it — the skills are now installed. Restart Claude Code and they're ready.

**To update later:** just run `/prep` — it checks `company-workflows` directly every time and applies any new release automatically, preserving your personal customizations (the parts of each skill marked as yours to edit). (This one-liner is for **first-time install only** — running it again would overwrite the whole file, personal edits included, so `/prep`'s built-in update check is the one and only way to update afterwards.)

**What did this install?**

| Skill | When to use it | What it does |
|-------|---------------|--------------|
| `/prep` | Start of every session | Checks GitHub and your connectors are live, saves anything left uncommitted, then organises your day into Must Do, Should Do, and Check Later |
| `/wrap` | End of every session | Saves everything to GitHub, logs what got done, and sets up tomorrow |
| `/week` | Monday morning or Friday afternoon | Monday: sets 3 goals for the week. Friday: reviews how the week went |
| `/month` | First 3 days or last 3 days of the month | Plans the month ahead with goals and key dates, or runs a quick retro at the end |
| `/quarter` | First 3 days or last 3 days of the quarter | Sets 3 outcomes for the quarter, or reviews what was achieved before the next one starts |
| `/radar` | Any time you mention a project keyword | Routes straight to the right repo/file instead of a slow broad search — learns new routes as you use it |
| `/skills-status` | Any time, out of curiosity | Shows your installed skill versions vs upstream, and what you've customized — read-only |

---

## Step 8 — Verify Your Install

One command per tool, then a real end-to-end check.

```
node --version
claude --version
gh auth status
```

Each should print a version number or "Logged in" — no errors.

Then, inside a Claude Code session, run:
```
/prep
```

**What you should see:** the daily briefing box. GitHub should show ✅. Gmail/Calendar/Jira should show ✅ if you did Step 5, or a plain note (not a scary error) if you skipped it. If a bootstrap question appears ("What's your company or team name?") — that's expected on your very first run, just answer it.

If anything looks broken rather than just "not connected yet," see **Something Went Wrong?** near the end of this guide.

✅ **Core Setup is done.** Everything `/prep` needs to work is now in place. Move on to whichever Role Add-ons match your job — or skip straight to using Claude if nothing else applies to you yet.

---

# Role Add-ons

Pick the ones relevant to your role. None of these are required for `/prep`, `/wrap`, or the other core skills to work — they add extra capabilities on top.

## 📊 Data & Analytics — BigQuery

BigQuery is where a lot of our data lives. This lets Claude Code run queries and fetch data for you directly.

1. Install Google Cloud SDK:
   - Go to: **https://cloud.google.com/sdk/docs/install**
   - Download and run the **Windows installer** — keep clicking Next
   - At the end it opens a browser and asks you to log in with your work Google account — do that
2. Back in the VS Code terminal (start a Claude session first if you're not in one — type `claude`), run:
   ```
   gcloud auth application-default login
   ```
   This lets BigQuery tools know who you are.
3. Check it worked:
   ```
   gcloud --version
   ```
4. Add the BigQuery MCP with your project settings baked in (this is the one command you need — **ask your team lead for the real project ID** and swap it in before running):
   ```
   claude mcp add bigquery -e BIGQUERY_PROJECT_ID=<ask-your-team-lead> -e BIGQUERY_LOCATION=EU -- npx -y @channel.io/bigquery-mcp
   ```
   Using `-e` here means the project ID and location are saved directly in the MCP's own config — not a shell variable that disappears the moment you close the terminal.

> After this, when you talk to Claude Code, it can actually query the database and pull real numbers for you.

---

## 🔍 Engineering

All `/plugin` commands below must be run **inside a Claude session in VS Code** — open your VS Code terminal, type `claude`, press **Enter**, then paste these directly into the Claude chat (not the regular terminal).

**Add the plugin marketplace (once):**
```
/plugin marketplace add anthropics/claude-plugins-official
```

**Install:**

| What it installs | Command | Source |
|-----------------|---------|--------|
| Superpowers (TDD, debugging, planning skills) | `/plugin install superpowers@claude-plugins-official` | https://github.com/obra/superpowers |
| GSD — project & workflow management | `npm install -g get-shit-done` | https://www.npmjs.com/package/get-shit-done |
| GitHub skills (`/github`, `/gh-issues`) | `npx skills install openclaw/openclaw` | https://github.com/openclaw/openclaw |
| ClickHouse | `npx skills install affaan-m/everything-claude-code` | https://github.com/affaan-m/everything-claude-code |

Then add the second marketplace for the core/advanced engineering packs:
```
/plugin marketplace add alirezarezvani/claude-skills
```
```
/plugin install engineering-skills@claude-code-skills
```
(24 core engineering skills — see `skills-catalogue.md` for the full list.)

Restart Claude in VS Code after installing and everything above is ready to use.

---

## 📋 Product & PM

You already connected Jira in Core Setup Step 5 — nothing extra needed for tickets.

For planning-specific skills, add the second marketplace (if you haven't already via the Engineering add-on above):
```
/plugin marketplace add alirezarezvani/claude-skills
```
```
/plugin install product-skills@claude-code-skills
```
(12 product skills — see `skills-catalogue.md`.)

---

## 📣 Marketing

```
/plugin marketplace add alirezarezvani/claude-skills
```
```
/plugin install marketing-skills@claude-code-skills
```
(43 marketing skills.) Plus the original marketing/CRO pack:
```
npx skills install coreyhaines31/marketingskills
```

See `skills-catalogue.md` for the full breakdown of what each pack adds.

---

## 📚 Knowledge Base (anyone) — Obsidian

Obsidian is a note-taking app that works like a second brain. It stores everything as plain text files on your computer — so Claude Code can read and write into it directly, no syncing needed. Optional — not required for any core skill to work.

1. Go to: **https://obsidian.md**
2. Click **Download** and choose **Windows**
3. Run the installer — keep clicking Next
4. Open Obsidian and create a new **Vault** — this is just a folder on your computer where all your notes will live. Pick somewhere easy to find (e.g. `Documents\vault`)
5. That's it — you can now point Claude Code at your vault folder and it will be able to read and search your notes

> **Tip:** When you open VS Code, set your project folder to your Obsidian vault (or a subfolder inside it) so Claude always has access to your notes.

---

# Optional Extras

Not tied to a role — install if you want more depth once the above feels comfortable. See `skills-catalogue.md` → "Advanced / Optional Packs" for the commands (advanced-tier engineering skills, auto-memory curation).

---

# Reference

## Built-in Claude Commands

These are commands built into Claude Code — no installation needed. Type them directly in the Claude chat at any time.

### Slash Commands

| Command | What it does |
|---------|-------------|
| `/clear` | Wipe the conversation and start fresh |
| `/compact` | Compress the conversation to free up memory |
| `/config` / `/settings` | Change preferences — theme, editor mode, notifications |
| `/copy` | Copy Claude's last response or pick a specific code block |
| `/cost` | Show how many tokens and how much this session has used |
| `/doctor` | Check if Claude Code is healthy and up to date |
| `/effort` | Set thinking effort for the session: `low` / `medium` / `high` / `xhigh` / `max` |
| `/fast` | Toggle fast mode — Opus model with faster output |
| `/feedback` | Send feedback directly to Anthropic |
| `/ide` | Connect Claude to your VS Code window |
| `/init` | Set up Claude Code in a new project folder |
| `/loop` | Run a repeating task automatically |
| `/mcp` | Manage MCP server and connector connections |
| `/memory` | View or manage Claude's memory files |
| `/model` | Switch AI model mid-session |
| `/plugin` | Manage installed plugins |
| `/recap` | Show a summary of what was done this session |
| `/release-notes` | See what's new in the latest Claude Code update |
| `/resume` | Pick up a previous conversation |
| `/review` | Review uncommitted code changes |
| `/schedule` | Schedule a reminder or wakeup for later |
| `/security-review` | Run a security-focused code review |
| `/status` | Check your auth, model, and connection |
| `/terminal-setup` | Optimise terminal display settings |
| `/thinking` | Toggle extended thinking on/off |
| `/tokens` | Show token usage for this session |
| `/ultrareview` | Deep multi-agent cloud code review — billed separately |

### Thinking Keywords

Add these words anywhere in your message to boost how hard Claude thinks. No slash needed — just write them naturally.

| Keyword | What it does |
|---------|-------------|
| `think` | Enable basic extended thinking |
| `think harder` | More thinking budget — for complex tasks |
| `ultrathink` | Maximum thinking — for your hardest problems |

> **Example:** *"ultrathink — refactor this function to handle all edge cases"*

### Power User Prompt Prefixes

These are community-discovered shorthand words you add anywhere in your message. They're not built into Claude Code — they work because Claude has seen these patterns so many times in its training that it recognises the intent. Add them at the start of any prompt.

| Prefix | What it does | Example |
|--------|-------------|---------|
| `/ghost` | Rewrites text to sound fully human — strips em-dashes, "I hope this helps", and every other AI tell | `/ghost rewrite this email` |
| `L99` | Forces Claude to commit to one answer — no more "it depends" or sitting on the fence | `L99 which database should we use` |
| `OODA` | Structures the response using the military decision framework: Observe → Orient → Decide → Act | `OODA how do we fix our onboarding drop-off` |
| `SCAFFOLD` | Lays out full structure before writing any code — useful for starting new features | `SCAFFOLD build a new reporting module` |
| `PERSONA` | Claude responds as a specific expert with real opinions and biases | `PERSONA senior growth marketer — review this landing page` |
| `/skeptic` | Claude challenges whether your question is even the right one before answering | `/skeptic should we add a referral program` |
| `BEASTMODE` | Drops the hedging and diplomacy — direct, blunt, high-effort output | `BEASTMODE review this strategy doc` |
| `/noyap` | Skips the preamble and filler — answer only, no wind-up | `/noyap what's the best way to structure this SQL` |
| `XRAY` | Deep examination — pulls apart what's really going on beneath the surface | `XRAY why is our churn rate increasing` |
| `/punch` | Tightens and shortens whatever you give it — removes fluff | `/punch shorten this paragraph` |

> **Note:** These work across Claude Code AND claude.ai chat. They are community conventions — not official Anthropic features. The thinking keywords above (`ultrathink`, `think harder`) are the exception: those are officially built into Claude Code.

> **Does not work:** `/nofilter`, `/unlocked`, `/jailbreak`, `/godmode` — these are myths. They have no effect.

## Full Skills Reference

Everything installable, organized by role, lives in **`skills-catalogue.md`** (same folder as this guide) — come back to it any time you want to see what else is available.

---

## Quick Reference — All the Links

| What | Link |
|------|------|
| VS Code | https://code.visualstudio.com |
| Node.js (required!) | https://nodejs.org |
| Claude Code docs | https://docs.anthropic.com/claude-code |
| GitHub CLI | https://cli.github.com |
| Connectors (Gmail/Calendar/Jira) | https://claude.ai → Settings → Connectors |
| Google Cloud SDK | https://cloud.google.com/sdk/docs/install |
| BigQuery MCP (npm) | https://www.npmjs.com/package/@channel.io/bigquery-mcp |
| Obsidian | https://obsidian.md |

---

## Checklist — Tick These Off As You Go

**Core Setup (everyone):**
- [ ] **Step 1** — VS Code installed and open, Claude Code extension installed
- [ ] **Step 2** — Node.js installed (`node --version` shows a number)
- [ ] **Step 3** — Claude Code installed (`claude --version` shows a number)
- [ ] **Step 4** — GitHub CLI installed and logged in (`gh auth status` says "Logged in")
- [ ] **Step 5** — Gmail, Calendar, and Atlassian connectors enabled on claude.ai
- [ ] **Step 6** — Project folder opened in VS Code, Claude session started, permission mode understood
- [ ] **Step 7** — Company skills installed (`/prep`, `/wrap`, `/week`, `/month`, `/quarter`, `/radar`, `/skills-status`)
- [ ] **Step 8** — `/prep` runs and shows the daily briefing box

**Role Add-ons (as relevant):**
- [ ] BigQuery MCP added (Data & Analytics)
- [ ] Engineering skill packs installed
- [ ] Product skill pack installed
- [ ] Marketing skill packs installed
- [ ] Obsidian installed and vault created (optional, anyone)

---

## Something Went Wrong?

**"command not found" errors** — Close the terminal and open a new one inside VS Code. Sometimes the computer needs a fresh start after installing things.

**GitHub login not working** — Try `gh auth login` again and make sure you're using the right GitHub account.

**BigQuery not connecting** — Make sure you ran `gcloud auth application-default login` and that you're logged in with the right Google account (the work one, not personal), and that the `-e BIGQUERY_PROJECT_ID` you used is the real one from your team lead.

**Gmail/Calendar/Jira showing as not connected in `/prep`** — Go back to claude.ai → Settings → Connectors and confirm they show as connected there; then restart your Claude Code session (`/mcp` should list them).

**Skills not showing up after Step 7** — Restart Claude Code (close the terminal, open a new one, run `claude` again).

---

*Written for the Quantum Media team — June 2026. Restructured into Core Setup / Role Add-ons — July 2026.*
