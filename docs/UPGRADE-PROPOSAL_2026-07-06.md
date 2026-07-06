# ai_feautures — Company Productivity Skills: Logic Assessment & Upgrade Proposal

**Date:** 2026-07-06 · **Status:** proposal — fast-track project, everything lands in this repo.
**Scope:** the distribution model, `claude-code-setup-guide.md`, the 5 skills (`prep`, `wrap`, `week`, `month`, `quarter`), the activity dashboard — plus the plan for the company-repo phase (admin targets → auto task tracking → progress rollup) and the indirect rewards-mcp feed.
**Method:** per item — Summary → Hard audit → Rewrite. Same discipline as the rewards-mcp program (`rewards-mcp/docs/program/`), whose verified research directly applies here (cited where it does).

---

## PART 0 — THE LOGIC ASSESSMENT (the distribution & enrichment model)

### The model as designed
1. Original skills live in `ai_feautures` (this repo). 2. Each person installs via the Step-10 one-liner (clone → copy to `~/.claude/skills`). 3. `/prep` bootstraps a **personal** `daily_workflows` repo per user, copies their installed skills into it, and thereafter syncs local skills FROM the personal repo. 4. `/wrap` syncs local skill changes TO the personal repo. 5. Future: a company repo where admin uploads month/quarter targets; users' skills auto-pull targets and track progress against them; aggregate progress feeds rewards-mcp.

### Verdict: the model is fundamentally sound — and it is a personal Flywheel
Per-user enrichment in a personal git repo is the right architecture: each person's skill evolves with their real usage, git history is the evolution record, and ownership is theirs. This is precisely the trace→evolve pattern the rewards-mcp research verified (Reflexion/ACE lineage). The golden rule (everything in GitHub) is right. The hash-based update check is clever. **Keep all of this.**

### The one architectural flaw: the fork problem (must fix before rollout)
Once a user bootstraps, there are **two sources of truth with no merge path between them**:

- Setup guide says "to update, run the same command" → that **overwrites** `~/.claude/skills` with company versions, destroying personal enrichments the moment `/wrap` syncs the clobbered files to the personal repo.
- Or the user never re-runs it → **company updates never arrive** (the guide's claim that "/prep checks for updates in the background every time" is false as written — prep 1d checks the *personal* repo, not `ai_feautures`).
- Both directions use `Copy-Item -Recurse -Force` — whole-file overwrite. Someone always silently loses.

Evidence it's already biting: the author's own personal repo contains all ~70 third-party GSD skills, because `/wrap` Step 1b syncs `~/.claude/skills\*` wholesale — company skills, third-party packs, and personal work all mixed into one unversioned blob.

**The fix (verified pattern, not invention):** the ACE research from the rewards-mcp program proved full-file rewrites collapse evolving instruction files; the answer is **zones + deltas**:
- Every company skill gets two zones: a **company zone** (the process spine — updated by upstream releases) and a **personal zone** (marked `<!-- personal -->` sections: the user's context, extra checks, their repos/tools — never touched by updates).
- `/prep`'s update step pulls from **`ai_feautures` (upstream)** and applies company-zone updates only, preserving personal zones; personal repo remains the user's full copy.
- `/wrap` syncs **only the 5 company skills + the user's own skills** to the personal repo — never third-party packs.
- Skills carry `version:` front-matter + a changelog line per release, so "what changed" is always answerable and the briefing's "SKILLS UPDATED" box becomes real.

### Two decisions to make now (flagged, yours)
1. **The repo is PUBLIC and contains company internals** — `BIGQUERY_PROJECT_ID=qih-data-prod`, "Written for the Quantum Media team," internal tool stack. Recommendation: make it private now (installs use `gh`-authenticated clone anyway), or scrub identifiers; mandatory before the company-repo phase.
2. **The name typo `ai_feautures`** — visible in every install command. GitHub redirects renames, so `gh repo rename ai-features` is low-risk *now* (gets riskier the more people install). Recommendation: rename now, update Step 10; or accept the typo permanently.

---

## PART 1 — PER-ITEM AUDITS

## 1.1 The distribution workflow (Step 10 + prep 1d + wrap 1b as one system)

**Summary:** Installs company skills to each user's machine and keeps them synced between a shared origin and a personal enrichment repo — for every employee.

**Hard audit:**
- The fork problem (Part 0) — no merge path, mutual clobbering, false "auto-update" claim.
- prep 1d asks "What's your company or team name?" and stores it, but bootstrap creates a repo with the **hardcoded name** `daily_workflows` while the confirmation message references an unbound `[name]` placeholder — three inconsistencies in one flow; company name is stored "(used in briefing headers)" but the briefing template never uses it.
- Hardcoded Windows path `C:\Users\[username]\Documents\git repos\daily_workflows` — breaks for Mac users and anyone with a different layout; `[username]` (Windows) vs GitHub login conflated in the same step.
- wrap 1b syncs ALL of `~/.claude/skills` — third-party packs (GSD, superpowers, marketing) get committed into personal repos: bloat, license mixing, and upstream-update conflicts for skills the company doesn't own.
- No uninstall/reset path; no "what version am I on" command; `.skills-hash` tracks the personal repo, so a fresh machine restore has no notion of upstream state.

**Rewrite (spec):**
- One config file `~/.claude/.workflows.json` replacing the three dotfiles (`.workflows-repo`, `.company`, `.skills-hash`): `{company, upstream: "jojomitrou/ai_feautures", upstream_hash, personal_repo, personal_path}`.
- **Update flow (in prep):** fetch upstream HEAD hash → if changed: for each company skill, replace company zones only, preserve `<!-- personal -->` blocks, bump local copy, report per-skill changelog lines in the briefing box. Never `Copy-Item -Force` a whole skill file.
- **Sync flow (in wrap):** copy ONLY `prep|wrap|week|month|quarter` + any skill whose front-matter has `origin: personal` to the personal repo. Explicit allowlist, never glob-everything.
- **Bootstrap:** ask company name AND repo name (default `daily_workflows`); derive path from `$env:USERPROFILE` not a hardcoded Documents layout; write the JSON config; confirmation message uses the actual values.
- Never-do: never overwrite a personal zone; never sync third-party skills; never claim an update happened without showing the changelog lines.
- *Example of done well:* user runs /prep Monday → briefing shows `🆕 SKILLS UPDATED · /week v1.3 — added target cascade from month goals` → their personal "always check the campaign dashboard" line inside `/prep` is still there.

## 1.2 `claude-code-setup-guide.md`

**Summary:** Zero-to-running onboarding for non-technical company staff: installs VS Code, Node, Claude Code, gh, gcloud, Obsidian, MCPs, and all skill packs.

**Hard audit:**
- **Assumed knowledge / wrong-shell bugs:** Step 7 uses `set BIGQUERY_PROJECT_ID=...` (cmd syntax — silently does nothing in PowerShell, and doesn't persist in any shell) while Step 10 is PowerShell; a novice cannot diagnose this. Duplicate step numbering (two 4s in Step 2, two 5s in Step 4). Step 8 depends on Step 10/11 ("pm-skills plugin") that never actually installs a pm-skills plugin — the Jira MCP's actual source is unnamed; a user following linearly hits a dead reference.
- **Risk defaults:** instructs every novice to set permission mode to **Auto** with a soft warning — for non-technical staff whose sessions can `git push` and run arbitrary commands, that's the wrong default to *recommend company-wide* (fine to offer). No mention of what Auto can do to shared repos.
- **Supply-chain surface:** Step 11 installs ~150 third-party skills from 5+ external repos, unpinned, for everyone regardless of role. Cognitive overload (the Step-13 catalogue is 250+ lines) and an unvetted execution surface on company machines.
- **No role-based path:** a marketer and an engineer get identical instructions; "pick the ones relevant to your role" appears once, late.
- **Missing:** Gmail/Google-Calendar MCP setup — yet `/prep` checks Gmail and Calendar every morning → every user sees ⚠️ forever for services the guide never wired (guaranteed trust erosion on day one). No troubleshooting for the most common real failure (corporate proxy/admin rights). No "verify your install" end-to-end test.
- Tone is genuinely good (plain-language, checklists) — keep it.

**Rewrite (spec):**
- Restructure: **Core path (Steps 1–10, everyone)** → **Role add-ons (per role: Analyst adds gcloud+BigQuery MCP; PM adds Jira; Marketer adds marketing pack; Engineer adds superpowers/GSD)** → **Optional extras**. The 150-skill catalogue moves to a separate `skills-catalogue.md`.
- Fix shell consistency (all PowerShell, env vars via `setx`/profile or `claude mcp add -e`), fix numbering, resolve the pm-skills dead reference with the actual Jira MCP install command, add Gmail/Calendar MCP steps or remove them from /prep's checks (must match — see 1.3).
- Permission guidance rewritten: default = ask; Auto presented as opt-in with a concrete "what this means" example.
- Add "Verify your install" final step: one command per tool + run `/prep` and expect the briefing box.
- Never-do: never instruct unpinned mass-installs as mandatory; never reference a step that doesn't exist; never mix shells in one guide.
- *Example of done well:* a new marketer finishes the Core path in ~30 min, runs `/prep`, and their briefing shows ✅ for exactly the services their role installed — zero permanent ⚠️s.

## 1.3 `/prep`

**Summary:** Session-start ritual: verifies connections, saves stray work, syncs skills, gathers context, and plans the day into Must Do / Should Do / Check Later — for every employee, daily.

**Hard audit:**
- **Checks services the setup never installs** (Gmail, Calendar) — permanent ⚠️s for most users (see 1.2). No rule for rendering a service the user hasn't configured (should be "—  not set up," not ⚠️).
- **Auto-commit-push on session start with no confirmation** ("commit and push immediately — no need to ask"): pushes whatever junk/secrets landed in the folder since last session; commit message "Session save — [date]" pollutes history; on a shared/protected repo this fails or spams. Also **blocking** repo creation forces every opened folder to become a private GitHub repo — opening `Downloads` by mistake creates `jsmith/Downloads`.
- **Duplicated end-of-session logic:** Phase 5 re-implements `/wrap` (drift guaranteed — wrap has the log-closing steps, prep's Phase 5 doesn't; a user who ends via prep loses their log).
- **Duplicated Monday logic:** Phase 4 asks weekly goals on Mondays; `/week` PLAN also does — no orchestration rule (should be: prep detects Monday → *offers* to run /week, never re-implements it). Same for month/quarter boundary days: on July 1st (a Monday, Q3 day 1), prep + week + month + quarter all want to fire with no defined order.
- **Task files live outside git:** `carry_over_tasks.md`/`task_log.md` sit in `~/.claude` which is not a repo — **the golden rule ("nothing lives only on the laptop") is violated by the skill's own storage design.** They belong in the personal workflows repo.
- `carry_over_tasks.md` schema never defined (numbered? checkboxes? priorities?) — every user's file drifts into a different shape, which breaks /week//month counting and any future company rollup.
- Undefined: timezone/date source; what "blocked Jira tickets" means (filter?); behavior when calendar has 9 meetings (cap?); the `.company` value is collected but unused.

**Rewrite (key sections verbatim-ready):**
- **1a–1b:** keep GitHub check; repo check becomes: *if uncommitted changes → show a 3-line summary and ask "Save these to GitHub now?" (one question, default yes)*; *if not a repo → say so and offer setup — never block the whole prep, never auto-create; add a folder sanity check (refuse to repo-ify home/Desktop/Downloads).* 
- **1c:** service table driven by `~/.claude/.workflows.json → services: []` set at install per role; unconfigured services render `— not set up (see setup guide §X)`, never ⚠️.
- **New Phase 0 — orchestration:** on Mon → offer `/week`; day 1–3 of month → offer `/month`; first 3 days of quarter → offer `/quarter`; run at most ONE planning skill, then continue prep with its output.
- **Task files move to `[personal_path]\tasks\`** (inside the personal repo) with a defined schema: `- [ ] {id} | {priority M/S/L} | {text} | added:{date} | target:{target-id|—}` (the `target:` field is the future company-targets hook, present from day one).
- **Phase 5 deleted** — replaced by one line: "When the user is done, run `/wrap`."
- Output format: the briefing box (keep — it's good), plus the two rules above.
- Never-do: never push without showing what's being pushed; never create repos from home-level folders; never re-ask a question another skill owns; never show ⚠️ for a service the user never set up; never store tasks outside the personal repo.
- *Example of done well:* Monday 9am → prep offers /week, user accepts, week's 3 goals cascade into the briefing's Must Do; briefing shows Gmail as "— not set up"; nothing was pushed without the user seeing the 3-line diff summary first.

## 1.4 `/wrap`

**Summary:** Session-end ritual: saves work to GitHub, syncs skills to the personal repo, logs completed/added tasks, and sets up tomorrow — for every employee, daily.

**Hard audit:**
- Step 1 auto-commits `git add -A` of the *current folder* — same unreviewed-push risk as prep; commit message template is better here but still no diff summary shown.
- Step 1b whole-glob skill sync (the third-party contamination — Part 0 evidence).
- Steps 2–3 are good questions but the completed-detection is fully manual — git commits this session already tell most of the story; wrap should propose ("Looks like you finished #2 and #4 — confirm?") instead of open-ended asking.
- Log closing assumes prep opened a session block — no rule when it didn't (mid-day first run).
- Task files outside git (same as prep) — and wrap is exactly the moment they should be committed to the personal repo.
- No hook for tomorrow's calendar (asks "anything for tomorrow?" blind).

**Rewrite (spec):** Step 1 shows a 3-line summary + one confirm; Step 1b becomes the allowlist sync (1.1) **plus committing the tasks folder to the personal repo — this is where the golden rule actually gets enforced**; Step 2 proposes completions from the session's commits/log before asking; add graceful no-open-session behavior (create a minimal block); wrap box (keep format) gains one line: `📊 synced: skills vX, tasks pushed`. Never-do: never sync third-party skills; never close a log that was never opened without noting it; never skip the tasks-folder commit.
- *Example of done well:* wrap box shows "COMPLETED: #2 dashboards QA (from your 3 commits)" — user typed nothing but "yes."

## 1.5 `/week` · 1.6 `/month` · 1.7 `/quarter` (audited together — same skeleton, same defects)

**Summary:** Cadence rituals — plan at period start (3 goals + context buckets), retro at period end (counts + reflective questions), all logged and pushed — for every employee.

**Hard audit (shared):**
- **No cascade between levels.** Quarter goals, month goals, week goals, and daily Must-Dos are collected by four independent skills that never read each other. Month PLAN doesn't surface quarter goals; week PLAN doesn't check month goals; retros count tasks but not against the level above. This is *the* gap — and it's precisely the plumbing the company-targets phase needs (admin quarter targets → user month goals → week goals → daily buckets). Without the cascade, targets can't flow.
- **Commit-to-wherever bug:** every mode ends `git add -A; git commit; git push` in the *current folder* — but the files just written (`task_log.md`) live in `~/.claude`, outside any repo. The commit therefore packages unrelated working-folder changes under a "Week 28 plan" message, while the plan itself is never versioned. Broken in all three skills, both modes.
- Week number `[XX]` undefined (ISO 8601? US?); month RETRO window days 28–31 misses "last 3 days" of Feb (28th is both start-adjacent and end — ambiguous rule); quarter boundary days overlap month boundary days with no orchestration (see 1.3 Phase 0).
- Retro counting depends on the undefined task-file schema (1.3) — "count ✅/❌/➕" is unimplementable consistently across users today.
- Goal achievement in retros is self-assessed with no criteria captured at plan time (a goal is just a string — no "how we'll know").
- No output beyond the box: plans aren't machine-readable, which blocks both the future admin rollup and the rewards-mcp feed.

**Rewrite (shared spec + per-skill deltas):**
- **The cascade (new, all three):** PLAN mode step 0 reads the level above — quarter reads company targets (when they exist) + last quarter's carry-overs; month reads the quarter entry's goals and asks "which of these does this month advance?"; week reads the month entry. Every goal line gets `↳ advances: {parent-goal-id}` (or `standalone`). RETRO mode reports achievement *against the parent* too.
- **Machine-readable plan blocks:** each plan/retro appends a fenced `yaml` block (id, period, goals[{id,text,measure,parent}], carryovers) below the human text in `task_log.md` — humans read the prose, tooling reads the YAML. This single change unlocks the entire Phase C/D pipeline (targets, progress rollup, rewards-mcp feed).
- **Goals get a measure at plan time:** the ask becomes "What are the 3 most important outcomes — and for each, how will we know it happened?" (one sentence each; retro then scores against it instead of vibes).
- **Fix the commit target:** all three commit the **personal workflows repo tasks folder** (where the log now lives per 1.3), never the arbitrary current folder.
- Definitions: week = ISO 8601 (`Get-Date -UFormat %V`); month RETRO = last 3 calendar days computed from month length; boundary orchestration per 1.3 Phase 0.
- Never-do (all three): never plan without reading the level above; never commit the working folder as part of a planning ritual; never accept a goal without a measure; never double-fire with prep/each other on boundary days.
- *Example of done well (week):* Monday: `/week` shows "July goals: ①ship briefing ②hire H1 ③CO% fix — which does this week advance?" → 3 week goals each tagged ↳①/②; Friday retro: "Goal ① advanced: 2 of 3 week-goals shipped (evidence: 11 commits, tasks #4 #7 closed)."

## 1.8 `claude-activity-dashboard`

**Summary:** Local Node dashboard visualizing personal Claude Code usage (prompts, tokens, intent, projects) from `~/.claude/history.jsonl` — currently a solo tool.

**Hard audit:** Not integrated with anything — prep/wrap/retros never reference it, though retros would love its numbers ("sessions this month" is already counted by hand from task_log). Chart.js via CDN (needs internet; some corporate networks block CDNs). No privacy story yet for the company phase (usage data is sensitive — aggregation must be opt-in/anonymized). Has tests (good) — untested against non-Windows paths per README claims. Intent classification method undefined in README.
**Rewrite (spec):** Phase-C role: this is the seed of the progress/usage rollup. Near-term: `/wrap` and retro modes read its aggregates (`node generate.js --json` mode to add) for the "Task summary" counts instead of hand-counting; vendor Chart.js locally. Company phase: an explicit opt-in `--export-weekly` producing an **anonymized, aggregate-only** JSON (counts, no prompt text) that the company repo collects. Never-do: never export prompt contents; never make sharing default-on.

---

## PART 2 — THE PLAN (fast track)

**Strategy:** fix the base skills and the fork problem FIRST (they're being installed company-wide via Step 10 — every day of delay multiplies migration pain), then wire the cascade, then the company layer, then the rewards-mcp feed. Sized for the established 2–3 sessions/week alongside the rewards-mcp program; this project is deliberately small-batch: **Phases A+B ship in ~2 weeks.**

### Phase A — Fix the base (2–3 sessions)
| ID | Task | Acceptance |
|---|---|---|
| A1 | Skills v2: apply rewrites 1.3–1.7 (zones marked, versions in front-matter, cascade, task-file schema + relocation, orchestration Phase 0, fixed commit targets, never-do lists) | All 5 skills carry `version: 2.0` + changelog; a dry-run Monday-on-quarter-boundary fires exactly one planning skill; task files live in personal repo; `grep 'git add -A' skills/` only hits reviewed-push patterns |
| A2 | Setup guide v2 (rewrite 1.2: role paths, shell fixes, dead-ref fix, verify step, catalogue extracted) | A novice transcript test: every command runs as pasted in PowerShell; no step references a nonexistent artifact; /prep after guide completion shows zero permanent ⚠️ |
| A3 | Decisions: repo private? rename `ai-features`? | DEC recorded in `docs/decisions.md`; Step-10 one-liner updated accordingly |

### Phase B — Distribution v2 (1–2 sessions)
| ID | Task | Acceptance |
|---|---|---|
| B1 | Zone-aware update flow in /prep + allowlist sync in /wrap + `.workflows.json` migration (auto-migrates the three dotfiles) | Test matrix passes: (fresh install), (upstream update + personal zone preserved), (personal edit survives update), (third-party skills NOT synced) |
| B2 | `/skills-status` mini-skill: shows installed versions vs upstream, personal-zone diff summary | Command output matches git reality in the three test states |

### Phase C — Company layer (2–3 sessions, gated on A+B live)
| ID | Task | Acceptance |
|---|---|---|
| C1 | Company repo design doc: `targets/{year}-{Qx}.md` + `targets/{year}-{month}.md` schema (admin-authored, per-team or per-person blocks, each target: id, text, measure, owner-scope); privacy model (personal logs stay personal; only the YAML plan/retro blocks + opt-in usage aggregates roll up) | Doc reviewed + DEC'd; schemas validate |
| C2 | Cascade goes live end-to-end: /quarter and /month PLAN pull admin targets (when repo configured) → goals tagged `↳ advances: {target-id}` → retro YAML blocks report per-target progress | Demo: admin writes a Q3 target → user's /month shows it → week goals tag it → retro block carries target-id + achievement |
| C3 | Rollup job (in company repo): collects users' retro YAML blocks (PR or push from wrap, opt-in) → `progress/{period}.json` per target | Aggregated file shows N users' progress against each target; no prompt text or personal task detail leaves personal repos |
| C4 | Admin view: minimal HTML (reuse activity-dashboard patterns) showing targets vs progress | Renders from progress JSONs alone |

### Phase D — rewards-mcp feed (1 session + 1 rewards-mcp-side task)
| ID | Task | Acceptance |
|---|---|---|
| D1 | Export: company repo publishes `progress/{period}.json` (already aggregate/anonymized) in a stable schema | Schema documented in this repo + versioned |
| D2 | rewards-mcp side (goes on its program backlog, per its own rules): a `productivity` dataset job ingesting D1 → catalogue file `productivity.md` (definitions: target attainment %, plan-adherence, cadence health) → eligible for the **Briefing** (an "Ops/Team" department config) and conversational queries | Added to `rewards-mcp/docs/program/backlog.md`; builds only via that program's plan-then-push |

**Rhythm:** same operating discipline as the rewards-mcp program (its Operating Rules §2 apply verbatim here — this repo IS the upload target, plan-then-push per item, never touch third-party repos). Progress tracked in `docs/PROGRESS.md` here.

**Risks:** rollout race (people installing v1 while v2 lands — mitigate: ship A+B before wider announcement; the update flow itself migrates early installers); privacy backlash on usage rollup (mitigate: opt-in, aggregates only, show users exactly what leaves their machine); skill sprawl from Step 11 packs diluting the company core (mitigate: role paths + catalogue separation); cross-platform (skills are PowerShell-assuming — decide Windows-only officially or add a Mac task).
