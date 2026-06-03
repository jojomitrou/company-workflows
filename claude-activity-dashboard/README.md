# Claude Code Activity Dashboard

A local dashboard that visualises your Claude Code usage: daily prompts, token consumption, prompt intent classification, and project breakdown.

## Requirements

- Node.js v18+
- Claude Code installed (reads `~/.claude/history.jsonl` and session files)

## Usage

### Live local server (recommended)

```bash
node serve.js
```

Open http://localhost:3000 — refreshes serve fresh data on every page load.

Use a custom port:
```bash
PORT=4000 node serve.js
```

### Generate a static HTML file

```bash
node generate.js
```

Opens `dashboard.html` in the current directory — double-click to view.

## Dashboard features

- **Daily prompts** bar chart with token tooltips
- **By project** and **by intent** doughnut charts
- **Date filters**: 7 days / 30 days / 90 days / All time
- **Recent prompts** table with relative timestamps and token counts
- Dark theme, Chart.js via CDN

## Tests

```bash
node --test generate.test.js serve.test.js
```

25 tests, no npm dependencies.
