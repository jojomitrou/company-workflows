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

## Step 6 — Install Obsidian (Your Knowledge Base)

Obsidian is a note-taking app that works like a second brain. It stores everything as plain text files on your computer — so Claude Code can read and write into it directly, no syncing needed.

**Why do we use it?** It gives you a permanent place to store decisions, research, meeting notes, and context that Claude can access in future sessions. Think of it as the memory that lives outside Claude.

1. Go to: **https://obsidian.md**
2. Click **Download** and choose **Windows**
3. Run the installer — keep clicking Next
4. Open Obsidian and create a new **Vault** — this is just a folder on your computer where all your notes will live. Pick somewhere easy to find (e.g. `Documents\vault`)
5. That's it — you can now point Claude Code at your vault folder and it will be able to read and search your notes

> **Tip:** When you open VS Code, set your project folder to your Obsidian vault (or a subfolder inside it) so Claude always has access to your notes.

---

## Step 7 — Set Up the BigQuery MCP

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

## Step 8 — Start Claude Code in VS Code

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

### 🧑‍💻 Engineering Specialists (engineering-skills pack)

These give Claude a specialist persona for specific engineering domains.

| Skill | What it does |
|-------|--------------|
| `/engineering-skills:senior-architect` | System design and architecture decisions |
| `/engineering-skills:senior-backend` | Backend engineering — APIs, databases, services |
| `/engineering-skills:senior-frontend` | Frontend engineering — React, UI, performance |
| `/engineering-skills:senior-fullstack` | Full-stack development across the whole app |
| `/engineering-skills:senior-devops` | DevOps, CI/CD, infrastructure, deployments |
| `/engineering-skills:senior-data-engineer` | Data pipelines, warehouses, ETL |
| `/engineering-skills:senior-data-scientist` | Data science, ML experiments, analysis |
| `/engineering-skills:senior-ml-engineer` | Machine learning engineering and deployment |
| `/engineering-skills:senior-computer-vision` | Computer vision and image processing |
| `/engineering-skills:senior-qa` | Quality assurance and test strategy |
| `/engineering-skills:senior-security` | Security engineering and threat modelling |
| `/engineering-skills:senior-secops` | Security operations and monitoring |
| `/engineering-skills:senior-prompt-engineer` | LLM prompt design and optimisation |
| `/engineering-skills:code-reviewer` | Deep code review with actionable feedback |
| `/engineering-skills:adversarial-reviewer` | Aggressive devil's advocate code review |
| `/engineering-skills:tdd-guide` | Test-driven development guidance |
| `/engineering-skills:epic-design` | Design and break down large engineering epics |
| `/engineering-skills:tech-stack-evaluator` | Evaluate and compare technology choices |
| `/engineering-skills:incident-commander` | Lead incident response in real time |
| `/engineering-skills:incident-response` | Post-incident analysis and runbooks |
| `/engineering-skills:red-team` | Offensive security and penetration mindset |
| `/engineering-skills:security-pen-testing` | Structured penetration testing |
| `/engineering-skills:ai-security` | AI-specific security risks and mitigations |
| `/engineering-skills:cloud-security` | Cloud security architecture and controls |
| `/engineering-skills:aws-solution-architect` | AWS architecture and best practices |
| `/engineering-skills:azure-cloud-architect` | Azure architecture and best practices |
| `/engineering-skills:gcp-cloud-architect` | Google Cloud architecture and best practices |
| `/engineering-skills:threat-detection` | Detect and respond to security threats |
| `/engineering-skills:ms365-tenant-manager` | Microsoft 365 tenant management |
| `/engineering-skills:stripe-integration-expert` | Stripe payments integration |
| `/engineering-skills:email-template-builder` | Build HTML email templates |

---

### 🧩 Product Skills (product-skills pack)

For product managers, designers, and anyone building features.

| Skill | What it does |
|-------|--------------|
| `/product-skills:product-manager-toolkit` | Full PM toolkit — specs, prioritisation, stakeholders |
| `/product-skills:product-strategist` | Product strategy and vision |
| `/product-skills:product-discovery` | User research and problem discovery |
| `/product-skills:product-analytics` | Metrics, funnels, and product data analysis |
| `/product-skills:ux-researcher-designer` | UX research and design thinking |
| `/product-skills:ui-design-system` | Design system planning and consistency |
| `/product-skills:experiment-designer` | Design product experiments and A/B tests |
| `/product-skills:competitive-teardown` | Deep competitive analysis of rival products |
| `/product-skills:roadmap-communicator` | Communicate roadmap to stakeholders |
| `/product-skills:landing-page-generator` | Generate landing page copy and structure |
| `/product-skills:saas-scaffolder` | Scaffold a new SaaS product structure |
| `/product-skills:spec-to-repo` | Turn a spec into a working code repository |

---

### 📣 For Marketing Teams (expanded)

The marketing-skills pack adds many more skills on top of the originals.

**New — Content & Social**
| Skill | What it does |
|-------|--------------|
| `/marketing-skills:content-creator` | End-to-end content creation |
| `/marketing-skills:content-humanizer` | Make AI content sound natural and human |
| `/marketing-skills:content-production` | Manage content production workflows |
| `/marketing-skills:social-media-manager` | Full social media management |
| `/marketing-skills:social-media-analyzer` | Analyse social media performance |
| `/marketing-skills:x-twitter-growth` | Grow an audience on X/Twitter |
| `/marketing-skills:youtube-full` | Full YouTube channel strategy and content |
| `/marketing-skills:webinar-marketing` | Plan and promote webinars |

**New — SEO & Discovery**
| Skill | What it does |
|-------|--------------|
| `/marketing-skills:aeo` | Answer engine optimisation (AI search) |
| `/marketing-skills:app-store-optimization` | Improve App Store / Play Store rankings |
| `/marketing-skills:prompt-engineer-toolkit` | Use prompts to power marketing workflows |

**New — Strategy & Ops**
| Skill | What it does |
|-------|--------------|
| `/marketing-skills:marketing-context` | Set shared context for all marketing work |
| `/marketing-skills:marketing-strategy-pmm` | Product marketing strategy |
| `/marketing-skills:marketing-demand-acquisition` | Demand generation and acquisition strategy |
| `/marketing-skills:marketing-ops` | Marketing operations and tooling |
| `/marketing-skills:campaign-analytics` | Track and analyse campaign performance |
| `/marketing-skills:brand-guidelines` | Define and enforce brand guidelines |

---

### 📋 Project Management (pm-skills pack)

For project managers and anyone running team workflows.

| Skill | What it does |
|-------|--------------|
| `/pm-skills:senior-pm` | Senior PM perspective on planning and delivery |
| `/pm-skills:scrum-master` | Agile/Scrum facilitation and ceremonies |
| `/pm-skills:jira-expert` | Jira setup, automation, and best practices |
| `/pm-skills:confluence-expert` | Confluence pages, templates, and spaces |
| `/pm-skills:atlassian-admin` | Atlassian admin and configuration |
| `/pm-skills:atlassian-templates` | Ready-made Atlassian templates |
| `/pm-skills:meeting-analyzer` | Analyse meeting notes and extract actions |
| `/pm-skills:team-communications` | Write clear team updates and announcements |

---

### 🏛 C-Level Advisory (c-level-skills pack)

Give Claude a C-suite advisor persona for strategic thinking.

| Skill | What it does |
|-------|--------------|
| `/c-level-skills:ceo-advisor` | CEO-level strategic advice |
| `/c-level-skills:cto-advisor` | CTO-level technology strategy |
| `/c-level-skills:cfo-advisor` | CFO-level financial strategy |
| `/c-level-skills:cmo-advisor` | CMO-level marketing strategy |
| `/c-level-skills:coo-advisor` | COO-level operations strategy |
| `/c-level-skills:cpo-advisor` | CPO-level product strategy |
| `/c-level-skills:cro-advisor` | CRO-level revenue strategy |
| `/c-level-skills:ciso-advisor` | CISO-level security strategy |
| `/c-level-skills:chro-advisor` | CHRO-level people and HR strategy |
| `/c-level-skills:vpe-advisor` | VP Engineering perspective |
| `/c-level-skills:chief-ai-officer-advisor` | AI strategy and governance |
| `/c-level-skills:chief-data-officer-advisor` | Data strategy and governance |
| `/c-level-skills:chief-customer-officer-advisor` | Customer experience strategy |
| `/c-level-skills:chief-of-staff` | Chief of Staff — cross-functional coordination |
| `/c-level-skills:founder-coach` | Founder coaching and guidance |
| `/c-level-skills:board-deck-builder` | Build board presentation decks |
| `/c-level-skills:board-meeting` | Prepare for and run board meetings |
| `/c-level-skills:strategic-alignment` | Align teams around strategy |
| `/c-level-skills:competitive-intel` | Competitive intelligence and analysis |
| `/c-level-skills:scenario-war-room` | Scenario planning and stress testing |
| `/c-level-skills:decision-logger` | Log and track key decisions |
| `/c-level-skills:internal-narrative` | Shape internal communications and culture |
| `/c-level-skills:culture-architect` | Design company culture and values |
| `/c-level-skills:change-management` | Lead organisational change |
| `/c-level-skills:org-health-diagnostic` | Diagnose organisational health |
| `/c-level-skills:company-os` | Build a company operating system |
| `/c-level-skills:context-engine` | Maintain and share company context |
| `/c-level-skills:agent-protocol` | Define how AI agents operate in your org |
| `/c-level-skills:general-counsel-advisor` | Legal and compliance advisory |
| `/c-level-skills:intl-expansion` | International expansion strategy |
| `/c-level-skills:ma-playbook` | M&A strategy and playbooks |
| `/c-level-skills:cs-onboard` | Customer success onboarding |

---

### 💼 Business Growth (business-growth-skills pack)

| Skill | What it does |
|-------|--------------|
| `/business-growth-skills:customer-success-manager` | Customer success strategy and playbooks |
| `/business-growth-skills:sales-engineer` | Technical sales and pre-sales support |
| `/business-growth-skills:revenue-operations` | Revenue ops, pipeline, and forecasting |
| `/business-growth-skills:contract-and-proposal-writer` | Write contracts, proposals, and SOWs |

---

### 💰 Finance (finance-skills pack)

| Skill | What it does |
|-------|--------------|
| `/finance-skills:financial-analyst` | Financial analysis, modelling, and reporting |
| `/finance-skills:saas-metrics-coach` | SaaS metrics — ARR, churn, LTV, CAC |

---

### 🔬 Regulatory & Quality Management (ra-qm-skills pack)

For compliance, quality, and regulatory teams.

| Skill | What it does |
|-------|--------------|
| `/ra-qm-skills:quality-manager-qmr` | Quality Management Representative |
| `/ra-qm-skills:quality-manager-qms-iso13485` | ISO 13485 quality management (medical devices) |
| `/ra-qm-skills:quality-documentation-manager` | Manage quality documentation and SOPs |
| `/ra-qm-skills:qms-audit-expert` | Conduct QMS audits |
| `/ra-qm-skills:capa-officer` | Corrective and preventive action management |
| `/ra-qm-skills:risk-management-specialist` | Risk management frameworks and assessments |
| `/ra-qm-skills:regulatory-affairs-head` | Regulatory affairs strategy and submissions |
| `/ra-qm-skills:fda-consultant-specialist` | FDA regulatory compliance |
| `/ra-qm-skills:mdr-745-specialist` | EU MDR 2017/745 (medical device regulation) |
| `/ra-qm-skills:eu-ai-act-specialist` | EU AI Act compliance |
| `/ra-qm-skills:gdpr-dsgvo-expert` | GDPR / DSGVO data protection compliance |
| `/ra-qm-skills:information-security-manager-iso27001` | ISO 27001 information security management |
| `/ra-qm-skills:isms-audit-expert` | ISMS audits and gap assessments |
| `/ra-qm-skills:iso42001-specialist` | ISO 42001 AI management system |
| `/ra-qm-skills:soc2-compliance` | SOC 2 compliance and readiness |

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
