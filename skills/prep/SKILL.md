---
name: prep
description: Use at the start of every VS Code session to verify GitHub, BigQuery, and Obsidian are connected and ready before starting any work.
---

# Session Prep

Run this at the start of every session. Check all three connections and report status before doing anything else.

## Step 1 — GitHub

Run this command:
```
gh auth status
```

- **Pass:** output includes "Logged in to github.com as [username]"
- **Fail:** run `gh auth login` to fix, then re-check

---

## Step 2 — BigQuery

Run both commands:
```
gcloud auth list
gcloud auth application-default print-access-token
```

- **Pass:** an account is marked ACTIVE in the list, and a token string prints
- **Fail:** run `gcloud auth application-default login` to fix, then re-check

---

## Step 3 — Obsidian Vault

Check whether the vault folder exists by looking in these locations (in order):
1. `C:\Users\jomit\OneDrive\Documents\vault`
2. `C:\Users\jomit\Documents\vault`
3. `C:\Users\jomit\vault`

List the number of `.md` files found.

- **Pass:** folder exists and contains at least one `.md` file
- **Fail:** ask the user to confirm the correct vault path, then update this skill with it

---

## Report

After all three checks, print a single status block:

```
────────────────────────────────
  SESSION PREP
────────────────────────────────
  GitHub      ✅  logged in as @[username]
  BigQuery    ✅  active account: [email]
  Obsidian    ✅  vault found — [N] notes
────────────────────────────────
  All systems go. Ready to work!
────────────────────────────────
```

If anything fails:

```
────────────────────────────────
  SESSION PREP
────────────────────────────────
  GitHub      ✅  OK
  BigQuery    ❌  not authenticated
              → run: gcloud auth application-default login
  Obsidian    ✅  OK
────────────────────────────────
  Fix the above before starting work.
────────────────────────────────
```

Do not proceed with any other task until all three show ✅.
