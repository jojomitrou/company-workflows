# The Fork Problem — Definitive Resolution Guide

**Date:** 2026-07-06 · **Status:** implementation spec for Phase B1 (supersedes the B1 sketch in `UPGRADE-PROPOSAL_2026-07-06.md` §1.1/Phase B).
**Audience:** whoever implements this (human or AI) — complete enough to build without inventing decisions.

---

## 1 · The flaw, restated precisely

Two sources of truth exist per user — `ai_feautures` (company skills) and the personal `daily_workflows` repo — connected only by **whole-file overwrites** (`Copy-Item -Recurse -Force`), in both directions, with no merge concept. Four concrete failure modes:

| # | Failure | Trigger | Who loses |
|---|---|---|---|
| F1 | Company update never arrives | User never re-runs the Step-10 one-liner; `/prep` syncs from the *personal* repo only | User (stale skills, thinks they're current — the guide claims background updates) |
| F2 | Personal enrichment destroyed | User re-runs Step-10; company files overwrite local; next `/wrap` pushes the clobbered files to the personal repo | User (their enrichments, silently) |
| F3 | Company update reverted | User runs Step-10 (updates local), then `/prep` copies personal-repo versions back over local | Company (update silently undone) |
| F4 | Third-party contamination | `/wrap` Step 1b globs ALL of `~/.claude/skills` into the personal repo | Everyone (observed: ~70 GSD skills in the author's own personal repo — bloat, license mixing, future update conflicts) |

## 2 · The resolution architecture (four pieces, all required)

1. **Two zones inside every company skill file.** Everything is company-owned EXCEPT explicitly delimited personal blocks:
   ```markdown
   <!-- personal:daily-checks:start -->
   (user's own additions — e.g. "always check the campaign dashboard before standup")
   <!-- personal:daily-checks:end -->
   ```
   Each company skill v2 ships with 2–3 empty, **named** personal blocks at the logical extension points (e.g. `prep`: `daily-checks`, `briefing-extras`; `wrap`: `extra-saves`; `week/month/quarter`: `personal-context`). Users may add their own blocks anywhere with any unique name.

2. **Anchored extract-and-reinject updates — NOT merges.** The update takes the upstream file wholesale, then re-inserts the user's personal blocks by **name** (not by line position). Deterministic, always succeeds, zero conflicts for the user to resolve.

3. **One config file** `~/.claude/.workflows.json` (replaces `.workflows-repo`, `.company`, `.skills-hash`):
   ```json
   {
     "company": "Quantum Media",
     "upstream": "jojomitrou/ai_feautures",
     "upstream_ref": "<last-applied commit sha>",
     "personal_repo": "https://github.com/<user>/daily_workflows",
     "personal_path": "<local clone path>",
     "sync_skills": ["prep","wrap","week","month","quarter"],
     "company_zone_hashes": { "prep": "<sha256 of company-zone content as installed>" },
     "pin_updates": false
   }
   ```

4. **Versioned releases.** Every company skill carries front-matter `version: X.Y` + `origin: company`; upstream keeps `docs/CHANGELOG.md` with one line per skill per release. No version bump without a changelog line — ever.

## 3 · The update algorithm (runs in `/prep` step 1d — exact sequence)

```
1. gh api upstream HEAD sha → if == upstream_ref: done (say nothing).
2. If pin_updates: true → briefing line "updates available (pinned)" → done.
3. For each company skill file in upstream/skills/:
   a. Read upstream file (U) and local file (L).
   b. EXTRACT from L: every <!-- personal:NAME:start/end --> block → {NAME: content}.
   c. INTEGRITY CHECK: strip personal blocks from L → hash → compare to
      company_zone_hashes[skill].
      - MATCH → user never touched the company zone → proceed.
      - MISMATCH → user edited inside the company zone:
        · save full L to [personal_path]/backups/{skill}-{date}.md (commit it)
        · proceed with update anyway
        · queue LOUD briefing notice: "your edits inside /{skill}'s company
          zone were preserved at backups/… — move them into a personal block."
   d. REINJECT: take U wholesale; for each extracted {NAME: content}, find the
      matching <!-- personal:NAME:start --> anchor in U and insert content.
      - Anchor missing in U (upstream removed/renamed a block) → append the
        orphan under "## Recovered personal content" at end of file + notice.
   e. Write result to ~/.claude/skills/{skill}/SKILL.md.
   f. Update company_zone_hashes[skill] from U's company-zone hash.
4. Set upstream_ref = new sha. Collect changelog lines for the applied range.
5. Briefing box gets: 🆕 SKILLS UPDATED · /{skill} vX.Y — {changelog line}.
6. New skill exists upstream but not locally → install it + note it.
```

**Sync flow (in `/wrap`):** copy ONLY skills named in `sync_skills` + any local skill with `origin: personal` front-matter → personal repo → commit `skills: sync — {date}` → push. Everything else (GSD, superpowers, marketplace packs) is never synced — they have their own updaters.

**Single update channel:** after this ships, the Step-10 one-liner is **install-only** (first run). The setup guide's "run it again to update" instruction is deleted; `/prep` is the only updater. One channel, no F3.

## 4 · Migration for existing installs (one-time, automatic in `/prep`)

```
1. Detect old dotfiles (.workflows-repo / .company / .skills-hash) → build
   .workflows.json from them → delete old files.
2. Personal-repo cleanup offer (one question): "Your workflows repo contains
   N third-party skills (GSD etc.). Remove them from the repo? They stay
   installed locally — they just stop being synced." → yes: git rm + tag
   `pre-cleanup-{date}` first (recoverable), commit.
3. Customization rescue: diff each local company skill vs upstream v1 base.
   If different → wrap the whole diff's additions into
   <!-- personal:migrated:start/end --> at end of file + notice to review.
4. Record company_zone_hashes from current upstream; set upstream_ref.
```

## 5 · Edge cases — decided here so nobody improvises

| Case | Handling |
|---|---|
| User edited company zone | Backup + update + loud notice (3c). Never silent-keep (blocks all future updates), never silent-discard. |
| Upstream removes a personal anchor | Orphan block recovered at file end + notice (3d). Personal content is never deleted by an update, period. |
| Duplicate personal block names in one file | wrap refuses the sync with a clear message naming the duplicates. |
| Personal repo missing/deleted | prep re-offers bootstrap; local skills keep working meanwhile (degraded, noted). |
| Upstream renames a skill | Requires a `renames:` map entry in upstream `docs/CHANGELOG.md`; update treats it as remove+add and migrates personal blocks by map. Don't rename casually. |
| Two machines, same user | Personal repo is the source of truth for personal blocks; .workflows.json is per-machine; last-wrap-wins on personal repo (git history preserves everything). |
| gh offline / upstream unreachable | Skip silently, note "update check skipped (offline)" in briefing. Never block prep on the update. |

## 6 · What to AVOID — and why (each grounded)

| Avoid | Why |
|---|---|
| Whole-file overwrites in any direction | The root cause of F1–F3. Also the verified ACE finding from the rewards-mcp research: full-file rewrites of evolving instruction files destroy accumulated content (context collapse) — here it's literal, not just an LLM failure mode. |
| Git merge/rebase as the user-facing mechanism | Prose markdown merges conflict constantly; non-technical staff cannot resolve `<<<<<<<` markers; support burden kills the rollout. Anchored reinjection is deterministic. |
| Glob-everything sync | F4, observed in production (70 GSD skills in the personal repo): bloat, license mixing, and those skills' own updaters now fight your sync. |
| Two update channels | Step-10-rerun + prep-sync is exactly how F2/F3 happen. One channel (prep), one direction per artifact. |
| Auto-applying updates with no visibility | Silent behavior changes mid-week erode trust in the whole system — the changelog line in the briefing is not optional. (Users who want stability get `pin_updates: true`, and see "updates available (pinned)".) |
| Version bumps without changelog lines | "What changed?" becomes unanswerable; the briefing's SKILLS UPDATED box goes back to being decorative. |
| Authoring user-specific content into company zones upstream | Every user inherits your machine's paths/context (this is exactly the rewards-dashboard-skill A4 defect — `C:\Users\jomit\Downloads\...` in a shared skill). Upstream authoring rule: company zones contain only universal process. |
| Renaming skills or personal-block anchors casually upstream | Breaks anchor matching and muscle memory; requires the renames map + a migration entry. |

## 7 · NEVER-DO (hard rules for the implementation and for upstream authors)

1. **Never** delete or overwrite personal-block content — not on update, not on migration, not on conflict. Worst case is "recovered at end of file with a notice."
2. **Never** `Copy-Item -Force` a company skill file. The update algorithm (3) is the only write path.
3. **Never** sync third-party skills to personal repos.
4. **Never** resolve a company-zone edit silently (either direction).
5. **Never** ship an upstream release without version bump + changelog line.
6. **Never** block `/prep` on update failures — degrade with a notice.
7. **Never** reintroduce a second update channel in docs or guides.

## 8 · Test matrix (all 8 must pass before announcing v2; commit the transcript to `docs/test-evidence/`)

| # | Case | Pass = |
|---|---|---|
| 1 | Fresh install → bootstrap | .workflows.json valid; personal repo created; briefing clean |
| 2 | Upstream bump, no personal edits | Skill updated; version + changelog line in briefing |
| 3 | Upstream bump + filled personal blocks | Blocks byte-identical after update |
| 4 | Company-zone edit + upstream bump | Backup file committed in personal repo; update applied; loud notice |
| 5 | Upstream removes an anchor | Orphan recovered at end; notice shown; nothing lost |
| 6 | New skill added upstream | Installed + noted |
| 7 | /wrap sync with GSD skills present locally | Personal repo receives ONLY allowlisted skills |
| 8 | Old three-dotfile install runs new /prep | Migrated to .workflows.json; cleanup offered; no data loss (tag exists) |

## 9 · Acceptance for "flaw resolved"

- All 8 tests pass with committed evidence.
- The four failure modes F1–F4 each map to a passing test proving it can no longer occur (F1→2, F2→3, F3→7+one-channel doc change, F4→7).
- Setup guide contains exactly one update instruction (prep), zero overwrite instructions.
- A user who enriched their skills for a month, then receives 3 upstream releases, retains 100% of their personal content without touching git once.
