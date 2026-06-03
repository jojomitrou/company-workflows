'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const INTENT_RULES = [
  { category: 'Debug/Fix',    keywords: ['fix', 'bug', 'error', 'debug', 'broken', 'issue'] },
  { category: 'Question',     keywords: ['explain', 'what', 'how', 'why', 'understand', 'tell me'] },
  { category: 'Create/Build', keywords: ['write', 'create', 'make', 'build', 'generate', 'add'] },
  { category: 'Review',       keywords: ['review', 'check', 'test', 'verify'] },
  { category: 'Refactor',     keywords: ['refactor', 'improve', 'optimize', 'clean'] },
];

function classifyIntent(text) {
  const lower = (text || '').toLowerCase();
  for (const rule of INTENT_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) return rule.category;
  }
  return 'Other';
}
function getProjectName(projectPath) {
  if (!projectPath) return 'Unknown';
  const parts = projectPath.replace(/[/\\]+$/, '').split(/[/\\]/);
  const last = parts[parts.length - 1];
  return last || 'Unknown';
}

function parseHistoryLine(line) {
  if (!line || !line.trim()) return null;
  try {
    const entry = JSON.parse(line);
    const timestamp = new Date(entry.timestamp);
    if (isNaN(timestamp.getTime())) return null;
    return {
      timestamp,
      text: entry.display || '',
      project: getProjectName(entry.project),
      sessionId: entry.sessionId || '',
      intent: classifyIntent(entry.display || ''),
      inputTokens: 0,
      outputTokens: 0,
      cacheTokens: 0,
    };
  } catch {
    return null;
  }
}
function extractTokensFromSession(filePath) {
  const tokenMap = new Map();
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      if (!line.trim()) continue;
      let entry;
      try { entry = JSON.parse(line); } catch { continue; }
      if (entry.type === 'assistant' && entry.parentUuid && entry.message && entry.message.usage) {
        const u = entry.message.usage;
        tokenMap.set(entry.parentUuid, {
          inputTokens: u.input_tokens || 0,
          outputTokens: u.output_tokens || 0,
          cacheTokens: (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0),
        });
      }
    }
  } catch { /* unreadable file */ }
  return tokenMap;
}
function findUserMessageUuid(sessionFilePath, targetTimestamp) {
  try {
    const content = fs.readFileSync(sessionFilePath, 'utf8');
    let bestUuid = null;
    let bestDiff = Infinity;
    for (const line of content.split('\n')) {
      if (!line.trim()) continue;
      let entry;
      try { entry = JSON.parse(line); } catch { continue; }
      if (entry.type === 'user' && entry.uuid && entry.timestamp) {
        const diff = Math.abs(new Date(entry.timestamp).getTime() - targetTimestamp.getTime());
        if (diff < bestDiff) { bestDiff = diff; bestUuid = entry.uuid; }
      }
    }
    return bestDiff < 5000 ? bestUuid : null;
  } catch { return null; }
}

function findSessionFile(projectsDir, sessionId) {
  try {
    for (const dir of fs.readdirSync(projectsDir)) {
      const candidate = path.join(projectsDir, dir, `${sessionId}.jsonl`);
      if (fs.existsSync(candidate)) return candidate;
    }
  } catch { /* ignore */ }
  return null;
}

function buildPromptDataset(historyPath, projectsDir) {
  const content = fs.readFileSync(historyPath, 'utf8');
  const prompts = [];
  let skipped = 0;
  const sessionCache = new Map(); // sessionId → { tokenMap, sessionFile }

  for (const line of content.split('\n')) {
    const prompt = parseHistoryLine(line);
    if (!prompt) { if (line.trim()) skipped++; continue; }

    if (!sessionCache.has(prompt.sessionId)) {
      const sessionFile = findSessionFile(projectsDir, prompt.sessionId);
      const tokenMap = sessionFile ? extractTokensFromSession(sessionFile) : new Map();
      sessionCache.set(prompt.sessionId, { tokenMap, sessionFile });
    }

    const { tokenMap, sessionFile } = sessionCache.get(prompt.sessionId);
    if (sessionFile) {
      const uuid = findUserMessageUuid(sessionFile, prompt.timestamp);
      if (uuid && tokenMap.has(uuid)) Object.assign(prompt, tokenMap.get(uuid));
    }

    prompts.push(prompt);
  }
  return { prompts, skipped };
}

function generateHtml(historyPath, projectsDir) {
  if (!fs.existsSync(historyPath)) {
    return `<!DOCTYPE html><html><body style="font-family:system-ui;padding:2rem;background:#0f172a;color:#e2e8f0"><h1>Error</h1><p>history.jsonl not found at ${historyPath}</p></body></html>`;
  }
  const { prompts } = buildPromptDataset(historyPath, projectsDir);
  const projectCount = new Set(prompts.map(p => p.project)).size;
  const serialized = prompts.map(p => ({
    ts: p.timestamp.getTime(),
    t: p.text,
    project: p.project,
    intent: p.intent,
    i: p.inputTokens,
    o: p.outputTokens,
    c: p.cacheTokens,
  }));
  return TEMPLATE
    .replace('/*__DATA__*/[]', JSON.stringify(serialized))
    .replace("/*__GENERATED_AT__*/''", `'${new Date().toLocaleString()}'`)
    .replace('/*__PROJECT_COUNT__*/0', String(projectCount));
}

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Claude Code Activity</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"><\/script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0f172a;color:#e2e8f0;font-family:system-ui,sans-serif;min-height:100vh}
.header{padding:20px 24px 0;border-bottom:1px solid #1e293b;margin-bottom:16px}
.header-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
h1{font-size:1.3em;font-weight:700;color:#f8fafc}
.sub{font-size:0.75em;color:#64748b;margin-top:2px}
.filters{display:flex;gap:6px}
.fbtn{padding:5px 14px;background:#1e293b;color:#94a3b8;border:none;border-radius:6px 6px 0 0;font-size:0.8em;cursor:pointer}
.fbtn.active{background:#1d4ed8;color:#fff;font-weight:600}
.main{padding:16px 24px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.stat{background:#1e293b;border-radius:8px;padding:14px}
.slabel{font-size:0.7em;color:#64748b;text-transform:uppercase;letter-spacing:.05em}
.sval{font-size:1.8em;font-weight:700;margin-top:4px}
.ssub{font-size:.72em;color:#94a3b8;margin-top:2px}
.card{background:#1e293b;border-radius:8px;padding:16px;margin-bottom:16px}
.ctitle{font-size:.85em;font-weight:600;color:#f1f5f9;margin-bottom:12px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
.card2{background:#1e293b;border-radius:8px;padding:16px}
table{width:100%;border-collapse:collapse;font-size:.75em}
th{text-align:left;padding:4px 8px;font-weight:500;color:#64748b;border-bottom:1px solid #334155}
td{padding:6px 8px;border-bottom:1px solid #1e293b}
.badge{padding:1px 6px;border-radius:4px;background:#1e3a5f;color:#60a5fa;font-size:.85em}
.empty{text-align:center;padding:32px;color:#64748b}
@media(max-width:600px){.stats{grid-template-columns:repeat(2,1fr)}.row2{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="header">
  <div class="header-top">
    <div><h1>Claude Code Activity</h1><div class="sub" id="meta"></div></div>
  </div>
  <div class="filters" id="filters"></div>
</div>
<div class="main">
  <div class="stats" id="stats"></div>
  <div class="card"><div class="ctitle">Daily prompts</div><canvas id="dailyChart" height="80"></canvas></div>
  <div class="row2">
    <div class="card2"><div class="ctitle">By project</div><canvas id="projectChart"></canvas></div>
    <div class="card2"><div class="ctitle">By intent</div><canvas id="intentChart"></canvas></div>
  </div>
  <div class="card"><div class="ctitle">Recent prompts</div><div id="tbl"></div></div>
</div>
<script>
const DATA = /*__DATA__*/[];
const GENERATED_AT = /*__GENERATED_AT__*/'';
const PROJECT_COUNT = /*__PROJECT_COUNT__*/0;

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#f87171','#a78bfa','#34d399','#60a5fa'];
const FILTERS = [{label:'7 days',key:'7d',days:7},{label:'30 days',key:'30d',days:30},{label:'90 days',key:'90d',days:90},{label:'All time',key:'all',days:null}];
let dailyChart, projectChart, intentChart;

function fmtNum(n){if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1000)return(n/1000).toFixed(0)+'k';return String(n)}
function fmtRel(ts){const d=Math.floor((Date.now()-ts)/86400000);const h=Math.floor((Date.now()-ts)/3600000);const m=Math.floor((Date.now()-ts)/60000);if(d>30)return new Date(ts).toLocaleDateString();if(d>1)return d+' days ago';if(d===1)return 'yesterday';if(h>1)return h+'h ago';if(m>1)return m+'m ago';return 'just now'}
function filterData(key){const f=FILTERS.find(x=>x.key===key);if(!f.days)return DATA;const cut=Date.now()-f.days*86400000;return DATA.filter(p=>p.ts>=cut)}
function groupDay(ps){const m={};ps.forEach(p=>{const d=new Date(p.ts).toISOString().slice(0,10);if(!m[d])m[d]={c:0,i:0,o:0};m[d].c++;m[d].i+=p.i;m[d].o+=p.o});return m}
function countBy(ps,k){const m={};ps.forEach(p=>{m[p[k]]=(m[p[k]]||0)+1});return m}

function render(key){
  document.querySelectorAll('.fbtn').forEach(b=>b.classList.toggle('active',b.dataset.key===key));
  const ps=filterData(key);
  const lbl=FILTERS.find(f=>f.key===key).label.toLowerCase();
  const totalIn=ps.reduce((s,p)=>s+p.i+p.c,0);
  const totalOut=ps.reduce((s,p)=>s+p.o,0);
  const days=new Set(ps.map(p=>new Date(p.ts).toISOString().slice(0,10))).size;
  document.getElementById('stats').innerHTML=\`
    <div class="stat"><div class="slabel">Prompts</div><div class="sval" style="color:#f8fafc">\${ps.length}</div><div class="ssub">\${lbl}</div></div>
    <div class="stat"><div class="slabel">Input tokens</div><div class="sval" style="color:#60a5fa">\${fmtNum(totalIn)}</div><div class="ssub">\${lbl}</div></div>
    <div class="stat"><div class="slabel">Output tokens</div><div class="sval" style="color:#34d399">\${fmtNum(totalOut)}</div><div class="ssub">\${lbl}</div></div>
    <div class="stat"><div class="slabel">Active days</div><div class="sval" style="color:#f8fafc">\${days}</div><div class="ssub">\${lbl}</div></div>
  \`;
  const dm=groupDay(ps);const dl=Object.keys(dm).sort();
  if(dailyChart)dailyChart.destroy();
  dailyChart=new Chart(document.getElementById('dailyChart'),{type:'bar',data:{labels:dl,datasets:[{label:'Prompts',data:dl.map(d=>dm[d].c),backgroundColor:'#1d4ed8',borderRadius:3}]},options:{responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false},tooltip:{callbacks:{afterLabel:(ctx)=>{const d=dm[dl[ctx.dataIndex]];return'In: '+fmtNum(d.i)+'  Out: '+fmtNum(d.o)}}}},scales:{x:{ticks:{color:'#64748b'},grid:{color:'#1e293b'}},y:{ticks:{color:'#64748b'},grid:{color:'#1e293b'}}}}});
  const pm=countBy(ps,'project');const pl=Object.keys(pm);
  if(projectChart)projectChart.destroy();
  projectChart=new Chart(document.getElementById('projectChart'),{type:'doughnut',data:{labels:pl,datasets:[{data:pl.map(l=>pm[l]),backgroundColor:COLORS}]},options:{plugins:{legend:{labels:{color:'#94a3b8',font:{size:11}}}}}});
  const im=countBy(ps,'intent');const il=Object.keys(im);
  if(intentChart)intentChart.destroy();
  intentChart=new Chart(document.getElementById('intentChart'),{type:'doughnut',data:{labels:il,datasets:[{data:il.map(l=>im[l]),backgroundColor:COLORS.slice(2)}]},options:{plugins:{legend:{labels:{color:'#94a3b8',font:{size:11}}}}}});
  const recent=[...ps].sort((a,b)=>b.ts-a.ts).slice(0,20);
  document.getElementById('tbl').innerHTML=recent.length===0?'<div class="empty">No prompts in this period</div>':\`<table><tr><th>Time</th><th>Prompt</th><th>Project</th><th style="text-align:right">In / Out</th></tr>\${recent.map(p=>\`<tr><td style="color:#64748b;white-space:nowrap">\${fmtRel(p.ts)}</td><td>\${p.t.slice(0,80)+(p.t.length>80?'…':'')}</td><td><span class="badge">\${p.project}</span></td><td style="text-align:right;color:#94a3b8">\${p.i?fmtNum(p.i+p.c)+' / '+fmtNum(p.o):'—'}</td></tr>\`).join('')}</table>\`;
}

document.getElementById('meta').textContent='Generated '+GENERATED_AT+' · '+DATA.length+' prompts · '+PROJECT_COUNT+' projects';
document.getElementById('filters').innerHTML=FILTERS.map(f=>\`<button class="fbtn" data-key="\${f.key}" onclick="render('\${f.key}')">\${f.label}</button>\`).join('');
render('all');
<\/script>
</body>
</html>`;

function main() {
  const historyPath = path.join(os.homedir(), '.claude', 'history.jsonl');
  const projectsDir = path.join(os.homedir(), '.claude', 'projects');
  const outputPath = path.join(process.cwd(), 'dashboard.html');

  if (!fs.existsSync(historyPath)) {
    console.error(`Error: history.jsonl not found at ${historyPath}`);
    process.exit(1);
  }

  console.log('Reading history...');
  const html = generateHtml(historyPath, projectsDir);
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`Dashboard written to ${outputPath}`);
}

module.exports = { classifyIntent, getProjectName, parseHistoryLine, extractTokensFromSession, findUserMessageUuid, buildPromptDataset, generateHtml };

if (require.main === module) main();
