---
name: skills-status
description: Shows your installed skill versions against upstream company-workflows, plus a summary of your personal-zone customizations. Read-only — run any time to check where you stand.
version: 1.0
origin: company
---

# Skills Status

Read-only diagnostic. Never writes a file, never pushes, never asks a question.

---

## What it does

1. Read `$env:USERPROFILE\.claude\.workflows.json`. If it doesn't exist, say so and stop: *"No `.workflows.json` yet — run `/prep` once first to bootstrap or migrate."*
2. Check upstream: `gh api repos/{upstream}/commits/main --jq .sha` → `latest`.
   - If the call fails (offline): show `upstream: unreachable (offline?)` and skip the up-to-date comparison, everything else still runs.
   - Compare `latest` to `upstream_ref` → `up to date` if equal, otherwise `N commits behind` (count via `git log --oneline {upstream_ref}..{latest}` on a shallow clone, same one `/prep` would use — reuse `$env:TEMP\cw-update` if `/prep` left it, otherwise a quick shallow clone, deleted after).
3. For each skill in `sync_skills`:
   a. Read local file, extract `version:` from front-matter.
   b. Strip company zones (same procedure as `/prep` Phase 1d's "Stripping company zones") and hash. Compare to `company_zone_hashes[skill]`:
      - Match → `clean`
      - Mismatch → `⚠️ customized` (you've hand-edited the company zone since the last update — same detection `/prep` uses, just reported here instead of acted on)
   c. Find every `<!-- personal:{name}:start/end -->` block and report each as `{name} (filled)` if it has non-whitespace content, or `{name} (empty)` if not.
4. Print the table below. Never modify anything.

---

## Output

```
════════════════════════════════════════
  SKILLS STATUS
════════════════════════════════════════
  Upstream: {upstream} @ {short-sha}  —  {up to date | N commits behind | unreachable}

  Skill          Version   Company zone   Personal blocks
  prep           2.4       clean          project-state (filled), daily-checks (empty), briefing-extras (empty)
  wrap           2.2       clean          extra-saves (empty)
  week           2.2       clean          personal-context (empty)
  month          2.2       clean          personal-context (empty)
  quarter        2.2       clean          personal-context (empty)
  radar          1.0       clean          lookup-table (filled), radar-extras (filled)
  skills-status  1.0       clean          (none)

  ⚠️ {skill} — company zone customized since the last update (see backups/{skill}-{date}.md if one exists)
════════════════════════════════════════
  Run /prep to pull any available update.
════════════════════════════════════════
```

Omit the `⚠️` block entirely when nothing is customized. If a skill in `sync_skills` isn't installed locally at all, list it as `— not installed (run /prep)` instead of a version row.

---

## Never-do

1. Never write, push, or prompt — this is read-only, always.
2. Never claim "up to date" without actually checking upstream this run (no caching the last known answer).
3. Never call a company-zone edit "customized" without doing the actual hash comparison — no guessing from a diff of visible text alone.
