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
