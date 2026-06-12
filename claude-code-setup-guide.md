# How to Set Up Claude Code (From Zero!)

> Think of Claude Code like a super-smart helper that lives in your computer and can write code, talk to databases, and help you get things done. This guide will help you get everything installed step by step. Don't worry — just do one thing at a time!

---

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
4. When it's finished, open a new terminal inside VS Code (go to **Terminal → New Terminal** at the top menu) and type:
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

1. Go to: **https://cli.github.com**
2. Click **"Download for Windows"**
3. Run the installer — keep clicking Next
4. After it installs, open a **new** terminal in VS Code, type `claude` and press **Enter**. This starts Claude — wait until you see it ready.
5. Now type:
   ```
   gh auth login
   ```
5. It will ask you some questions:
   - Choose **GitHub.com**
   - Choose **HTTPS**
   - Choose **Login with a web browser**
   - A code will appear — copy it, then press Enter

   ![Screenshot showing the code](C:\Users\jomit\jomqu\OneDrive\Desktop\Screenshot 2026-06-08 115606.png)

   > **Tip:** If the browser doesn't open automatically, hold **Ctrl** and **left-click** on the link in the terminal — it will open in your browser.

   - It will open your browser — paste the code and approve it
6. Done! Claude Code can now read and save your GitHub files.

> **Why do we need this?** Because all our code (SQL, dashboards, etc.) is stored on GitHub. This is how Claude Code fetches and saves changes.

---

## Step 5 — Install Google Cloud SDK (for BigQuery)

BigQuery is where all our data lives. This tool lets Claude Code run queries and fetch data for you.

1. Go to: **https://cloud.google.com/sdk/docs/install**
2. Download the **Windows installer**
3. Run it — keep clicking Next
4. At the end it will open a browser and ask you to log in with your Google/work account — do that
5. After logging in, go back to the VS Code terminal. If you are not already in a Claude session, type `claude` and press **Enter** to start one (just like in Step 4 above). Then type:
   ```
   gcloud auth application-default login
   ```
   This lets BigQuery tools know who you are.

Check it worked:
```
gcloud --version
```

---

## Step 6 — Set Up the BigQuery MCP

An MCP is like a special plugin that gives Claude Code a superpower — in this case, the ability to actually run queries on BigQuery data.

You don't need to install anything extra — just tell Claude Code to connect to it.

Open a terminal in your project folder and run:
```
claude mcp add bigquery -- npx -y @channel.io/bigquery-mcp
```

Then set your project:
```
set BIGQUERY_PROJECT_ID=qih-data-prod
set BIGQUERY_LOCATION=EU
```

> After this, when you talk to Claude Code, it can actually query the database and pull real numbers for you!

---

## Step 7 — Start Claude Code in VS Code

You're ready! But before you start, you need to open a **project folder**.

**Why do you need a project folder?**
Think of it like this — Claude Code is very smart, but it needs to know *where* it is. A project folder is like giving Claude a desk to work at. All the files it reads, writes, and changes will live in that folder. Without one, it doesn't know where to save things or what files belong to your work. It's like asking someone to tidy your room but not telling them which room.

To open your project folder, go to **File → Open Folder** in VS Code and choose the folder where your work lives (for example, your GitHub repository folder).

Once the folder is open, open a terminal and type:
```
claude
```

That's it. A screen will appear at the bottom and you can start talking to it like a chat — right inside VS Code.

---

## Available Skills — What You Can Ask Claude to Do

Skills are like superpowers you activate by typing `/skill-name` in the Claude chat. Before you can use them, you need to install them once. Here's the full list of installs — you only ever need to do this once.

---

### How to Install All Skills

**Step 1 — Add the plugin marketplace**
```
/plugin marketplace add anthropics/claude-plugins-official
```

**Step 2 — Install each skill pack**

| What it installs | Command | Source |
|-----------------|---------|--------|
| Superpowers (TDD, debugging, planning skills) | `/plugin install superpowers@claude-plugins-official` | https://github.com/obra/superpowers |
| GSD — project & workflow management | `npm install -g get-shit-done` | https://www.npmjs.com/package/get-shit-done |
| Marketing & CRO skills | `npx skills install coreyhaines31/marketingskills` | https://github.com/coreyhaines31/marketingskills |
| GitHub skills (github, gh-issues) | `npx skills install openclaw/openclaw` | https://github.com/openclaw/openclaw |
| ClickHouse | `npx skills install affaan-m/everything-claude-code` | https://github.com/affaan-m/everything-claude-code |
| NotebookLM | `npx skills install PleasePrompto/notebooklm-skill` | https://github.com/PleasePrompto/notebooklm-skill |
| Find Skills | `npx skills install vercel-labs/skills` | https://github.com/vercel-labs/skills |
| Skill Lookup (prompts.chat) | `npx skills install f/prompts.chat` | https://prompts.chat |

> After installing, restart Claude in VS Code and all skills below are ready to use.

---

**Step 3 — Add the second marketplace (alirezarezvani)**

This marketplace has additional skill packs by domain. First add it:
```
/plugin marketplace add alirezarezvani/claude-skills
```

Then install by domain — pick the ones relevant to your role:

| What it installs | Command | Skills |
|-----------------|---------|--------|
| Core engineering | `/plugin install engineering-skills@claude-code-skills` | 24 core engineering skills |
| Advanced engineering | `/plugin install engineering-advanced-skills@claude-code-skills` | 25 POWERFUL-tier skills |
| Product | `/plugin install product-skills@claude-code-skills` | 12 product skills |
| Marketing | `/plugin install marketing-skills@claude-code-skills` | 43 marketing skills |
| Regulatory / Quality | `/plugin install ra-qm-skills@claude-code-skills` | 12 regulatory & quality skills |
| Project management | `/plugin install pm-skills@claude-code-skills` | 6 project management skills |
| C-level advisory | `/plugin install c-level-skills@claude-code-skills` | 28 C-suite advisory skills |
| Business & growth | `/plugin install business-growth-skills@claude-code-skills` | 4 business & growth skills |
| Finance | `/plugin install finance-skills@claude-code-skills` | 2 finance skills (analyst + SaaS metrics) |

Or install individual skills from this marketplace:

| Skill | Command |
|-------|---------|
| Security scanner | `/plugin install skill-security-auditor@claude-code-skills` |
| Playwright testing toolkit | `/plugin install playwright-pro@claude-code-skills` |
| Auto-memory curation | `/plugin install self-improving-agent@claude-code-skills` |
| Content creator | `/plugin install content-creator@claude-code-skills` |

> Source: **https://github.com/alirezarezvani/claude-skills**

---

Here's everything available, grouped by who needs them and why.

---

### 🛠 For Everyone — Session & Workflow Management

These help you manage your day-to-day work with Claude across any project.

| Skill | What it does |
|-------|--------------|
| `/gsd-help` | Show all available GSD commands and how to use them |
| `/gsd-do` | Just type what you want — Claude figures out which command to run |
| `/gsd-next` | Automatically move to the next step in your workflow |
| `/gsd-resume-work` | Pick up exactly where you left off from a previous session |
| `/gsd-pause-work` | Save your context before stopping so nothing gets lost |
| `/gsd-progress` | Check where you are in a project and what's next |
| `/gsd-session-report` | Summary of what was done in this session |
| `/gsd-note` | Quickly capture an idea without interrupting your flow |
| `/gsd-add-todo` | Add a task from what you're currently discussing |
| `/gsd-check-todos` | See your pending tasks and pick one to work on |
| `/gsd-add-backlog` | Park an idea for later without losing it |
| `/gsd-review-backlog` | Go through parked ideas and decide which to act on |
| `/gsd-thread` | Keep context alive across multiple sessions on the same work |
| `/gsd-explore` | Think through an idea before committing to a plan |

---

### 📋 For Project & Milestone Planning

Use these when starting or managing a project with multiple phases of work.

| Skill | What it does |
|-------|--------------|
| `/gsd-new-project` | Start a brand new project — sets up all planning structure |
| `/gsd-new-milestone` | Begin a new phase/version of an existing project |
| `/gsd-discuss-phase` | Talk through a phase before planning it (recommended first step) |
| `/gsd-plan-phase` | Create a detailed step-by-step plan for a phase |
| `/gsd-execute-phase` | Run all the steps in a phase plan automatically |
| `/gsd-autonomous` | Run all remaining phases from start to finish, hands-free |
| `/gsd-fast` | Do a small quick task with no planning overhead |
| `/gsd-quick` | Do a task with proper commits and tracking, but skipping optional steps |
| `/gsd-add-phase` | Add a new phase to the end of your current plan |
| `/gsd-insert-phase` | Squeeze in urgent work between existing phases |
| `/gsd-remove-phase` | Remove a phase that's no longer needed |
| `/gsd-analyze-dependencies` | Check which phases depend on each other |
| `/gsd-list-phase-assumptions` | See what assumptions Claude is making before it starts planning |
| `/gsd-complete-milestone` | Archive a finished milestone and get ready for the next one |
| `/gsd-milestone-summary` | Generate a summary of a milestone for the team |
| `/gsd-audit-milestone` | Check a milestone was actually completed properly before archiving |
| `/gsd-plan-milestone-gaps` | Find and fill anything missing in your milestone |
| `/gsd-stats` | See overall project stats — phases done, time, commits |
| `/gsd-manager` | One screen to manage multiple phases at once |
| `/gsd-workstreams` | Run parallel tracks of work at the same time |
| `/gsd-new-workspace` | Create a separate isolated workspace for a specific piece of work |
| `/gsd-list-workspaces` | See all your active workspaces |
| `/gsd-remove-workspace` | Delete a workspace when it's no longer needed |
| `/gsd-plant-seed` | Save an idea with a trigger — Claude surfaces it at the right moment later |

---

### 🔍 For Developers & Engineers

These are for writing, reviewing, debugging, and shipping code.

| Skill | What it does |
|-------|--------------|
| `/gsd-code-review` | Review code changes for bugs, security issues, and quality |
| `/gsd-code-review-fix` | Automatically fix the issues found in a code review |
| `/gsd-audit-fix` | Find issues, fix them, test, and commit — all in one go |
| `/gsd-audit-uat` | Review all outstanding test items across phases |
| `/gsd-debug` | Systematic debugging that keeps state even if the session resets |
| `/gsd-forensics` | Investigate what went wrong in a failed workflow |
| `/gsd-validate-phase` | Check that a completed phase was properly tested |
| `/gsd-verify-work` | Confirm that built features actually work as expected |
| `/gsd-secure-phase` | Check that security measures were properly implemented |
| `/gsd-add-tests` | Generate tests for a completed phase |
| `/gsd-map-codebase` | Get a deep analysis of the whole codebase |
| `/gsd-scan` | Quick lightweight scan of the codebase |
| `/gsd-intel` | Query or refresh Claude's knowledge about the codebase |
| `/gsd-docs-update` | Create or update project documentation |
| `/gsd-import` | Bring in an external plan and check it against existing decisions |
| `/gsd-undo` | Safely roll back commits from a phase |
| `/gsd-cleanup` | Archive old phase folders to keep things tidy |
| `/gsd-health` | Check and fix the planning directory if something looks off |
| `/gsd-reapply-patches` | Re-apply your local changes after updating GSD |
| `/gsd-update` | Update GSD to the latest version |
| `/gsd-review` | Get a second opinion on your plan from another AI |
| `/gsd-research-phase` | Research how to implement a phase (used inside plan-phase) |
| `/gsd-profile-user` | Build a profile of how you work so Claude gets better over time |
| `/gsd-set-profile` | Switch Claude's quality/speed balance (quality / balanced / budget) |
| `/gsd-settings` | Configure how GSD behaves |

---

### 🎨 For Frontend / UI Work

Use these when building or reviewing user interfaces.

| Skill | What it does |
|-------|--------------|
| `/gsd-ui-phase` | Create a design contract (spec) for a frontend phase before building |
| `/gsd-ui-review` | Audit implemented frontend code across 6 quality dimensions |

---

### 🐙 For GitHub & Shipping

Use these to manage your GitHub workflow — issues, PRs, and code review.

| Skill | What it does |
|-------|--------------|
| `/github` | Do anything with GitHub — check PRs, CI runs, issues, comments |
| `/gh-issues` | Fetch issues, auto-fix them with sub-agents, and open PRs |
| `/gsd-pr-branch` | Create a clean PR branch ready for code review |
| `/gsd-ship` | Create the PR, run review, and get it ready to merge |

---

### 📊 For Data & Analytics Teams

Use these when working with databases, queries, or data notebooks.

| Skill | What it does |
|-------|--------------|
| `/clickhouse-io` | ClickHouse query patterns and analytics optimisation |
| `/notebooklm` | Query your Google NotebookLM notebooks directly from Claude |

---

### 📣 For Marketing Teams

Use these when working on marketing, growth, content, or SEO.

**Strategy & Research**
| Skill | What it does |
|-------|--------------|
| `/product-marketing-context` | Set up your product/audience context so all other marketing skills work better |
| `/customer-research` | Analyse customer interviews, reviews, and research |
| `/marketing-ideas` | Brainstorm marketing strategies and growth ideas |
| `/content-strategy` | Plan what content to create and why |
| `/marketing-psychology` | Apply psychology and behavioural science to your marketing |
| `/pricing-strategy` | Figure out what to charge and how to structure your plans |
| `/launch-strategy` | Plan a product launch or feature announcement |
| `/competitor-alternatives` | Build competitor comparison pages |

**Writing & Copy**
| Skill | What it does |
|-------|--------------|
| `/copywriting` | Write marketing copy for any page |
| `/copy-editing` | Edit and improve existing copy |
| `/cold-email` | Write B2B cold outreach emails |
| `/email-sequence` | Build automated email drip campaigns |
| `/social-content` | Create LinkedIn, Twitter, and other social posts |
| `/ad-creative` | Generate ad headlines, descriptions, and variations at scale |
| `/sales-enablement` | Create pitch decks, one-pagers, and objection-handling docs |

**SEO & Search**
| Skill | What it does |
|-------|--------------|
| `/seo-audit` | Diagnose why your site isn't ranking |
| `/ai-seo` | Optimise content to be cited by AI search engines |
| `/schema-markup` | Add structured data for rich Google search results |
| `/programmatic-seo` | Create hundreds of SEO pages from templates and data |
| `/site-architecture` | Plan your website's page structure and navigation |

**Conversion & Growth**
| Skill | What it does |
|-------|--------------|
| `/page-cro` | Improve conversion rates on any marketing page |
| `/signup-flow-cro` | Reduce drop-off on your signup or registration flow |
| `/onboarding-cro` | Get more users to activate after signing up |
| `/paywall-upgrade-cro` | Convert free users to paid inside your app |
| `/popup-cro` | Optimise popups and modals for conversion |
| `/form-cro` | Improve any lead capture or contact form |
| `/churn-prevention` | Reduce cancellations and recover lost users |
| `/referral-program` | Build a refer-a-friend or affiliate program |
| `/ab-test-setup` | Design and run A/B tests properly |
| `/analytics-tracking` | Set up and audit your analytics and conversion tracking |
| `/free-tool-strategy` | Plan a free tool to generate leads or SEO value |
| `/lead-magnets` | Create ebooks, checklists, or templates for email capture |
| `/paid-ads` | Plan and optimise paid ad campaigns |
| `/revops` | Connect your marketing and sales pipeline |

---

### ⚙️ Skill Management

Use these to find and install new skills.

| Skill | What it does |
|-------|--------------|
| `/find-skills` | Discover new skills you can install |
| `/skill-lookup` | Search and install skills from the registry |

---

## Quick Reference — All the Links

| What | Link |
|------|------|
| VS Code | https://code.visualstudio.com |
| Node.js (required!) | https://nodejs.org |
| Claude Code docs | https://docs.anthropic.com/claude-code |
| GitHub CLI | https://cli.github.com |
| Google Cloud SDK | https://cloud.google.com/sdk/docs/install |
| BigQuery MCP (npm) | https://www.npmjs.com/package/@channel.io/bigquery-mcp |

---

## Checklist — Tick These Off As You Go

- [ ] VS Code installed and open
- [ ] Claude Code extension installed inside VS Code
- [ ] Node.js installed (`node --version` shows a number)
- [ ] Claude Code installed (`claude --version` shows a number)
- [ ] GitHub CLI installed and logged in (`gh auth status` says "Logged in")
- [ ] Google Cloud SDK installed (`gcloud --version` shows a number)
- [ ] Google account authenticated (`gcloud auth application-default login` done)
- [ ] BigQuery MCP added to Claude Code

---

## Something Went Wrong?

**"command not found" errors** — Close the terminal and open a new one inside VS Code. Sometimes the computer needs a fresh start after installing things.

**GitHub login not working** — Try `gh auth login` again and make sure you're using the right GitHub account.

**BigQuery not connecting** — Make sure you ran `gcloud auth application-default login` and that you're logged in with the right Google account (the work one, not personal).

---

*Written for the Quantum Media team — June 2026*
