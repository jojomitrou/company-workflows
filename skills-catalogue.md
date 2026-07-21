# Skills Catalogue — What You Can Ask Claude to Do

This is the full reference of installable skills, grouped by who needs them. It's split out from the main setup guide (`claude-code-setup-guide.md`) so that guide can stay focused on getting you up and running — come back here any time you want to see what else is available.

Your 6 core company skills (`/prep`, `/wrap`, `/week`, `/month`, `/quarter`, `/radar`) are covered in the main guide's Core Setup and aren't repeated here.

---

## 🛠 For Everyone — Session & Workflow Management

These help you manage your day-to-day work with Claude across any project. Installed via the GSD pack (see the main guide's Engineering role add-on) — anyone can use them once installed.

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

## 📋 For Project & Milestone Planning

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

## 🔍 For Developers & Engineers

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

## 🎨 For Frontend / UI Work

Use these when building or reviewing user interfaces.

| Skill | What it does |
|-------|--------------|
| `/gsd-ui-phase` | Create a design contract (spec) for a frontend phase before building |
| `/gsd-ui-review` | Audit implemented frontend code across 6 quality dimensions |

---

## 🐙 For GitHub & Shipping

Use these to manage your GitHub workflow — issues, PRs, and code review.

| Skill | What it does |
|-------|--------------|
| `/github` | Do anything with GitHub — check PRs, CI runs, issues, comments |
| `/gh-issues` | Fetch issues, auto-fix them with sub-agents, and open PRs |
| `/gsd-pr-branch` | Create a clean PR branch ready for code review |
| `/gsd-ship` | Create the PR, run review, and get it ready to merge |

---

## 📊 For Data & Analytics Teams

Use these when working with databases, queries, or data notebooks.

| Skill | What it does |
|-------|--------------|
| `/clickhouse-io` | ClickHouse query patterns and analytics optimisation |

---

## 📣 For Marketing Teams

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

## 📣 For Marketing Teams (expanded pack)

Installed separately (see the main guide's Marketing role add-on) — adds many more skills on top of the originals above.

**Content & Social**
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

**SEO & Discovery**
| Skill | What it does |
|-------|--------------|
| `/marketing-skills:aeo` | Answer engine optimisation (AI search) |
| `/marketing-skills:app-store-optimization` | Improve App Store / Play Store rankings |
| `/marketing-skills:prompt-engineer-toolkit` | Use prompts to power marketing workflows |

**Strategy & Ops**
| Skill | What it does |
|-------|--------------|
| `/marketing-skills:marketing-context` | Set shared context for all marketing work |
| `/marketing-skills:marketing-strategy-pmm` | Product marketing strategy |
| `/marketing-skills:marketing-demand-acquisition` | Demand generation and acquisition strategy |
| `/marketing-skills:marketing-ops` | Marketing operations and tooling |
| `/marketing-skills:campaign-analytics` | Track and analyse campaign performance |
| `/marketing-skills:brand-guidelines` | Define and enforce brand guidelines |

---

## Advanced / Optional Packs

Not tied to a specific role — install if you want more depth.

| What it installs | Command | Notes |
|-----------------|---------|-------|
| Advanced engineering | `/plugin install engineering-advanced-skills@claude-code-skills` | 25 POWERFUL-tier skills, on top of the core engineering pack |
| Auto-memory curation | `/plugin install self-improving-agent@claude-code-skills` | Learns from your sessions and curates Claude's memory automatically |
