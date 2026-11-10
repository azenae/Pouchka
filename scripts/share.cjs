// share.cjs: bundles the whole project state into ONE text file you can send to Claude. Usage: npm run share
// Output: project-state.txt (attach it to the chat). It contains: versions, save-point history, uncommitted changes,
// the result of "npm run build", the file list, and the full text of every source file.
// Add --no-build to skip the build step.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'project-state.txt');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vite']);
const SKIP_FILES = new Set(['project-state.txt', 'package-lock.json', 'check.png']);
const TEXT_EXT = new Set(['.js', '.cjs', '.mjs', '.json', '.html', '.css', '.md', '.txt', '.glsl', '.gitignore', '']);
const MAX_FILE = 60 * 1024;
const MAX_TOTAL = 600 * 1024;

function run(cmd, args, timeout) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32', timeout: timeout || 30000 });
  if (r.error) return '(could not run: ' + r.error.message + ')';
  return ((r.stdout || '') + (r.stderr || '')).trim() || '(no output)';
}
function tail(text, lines) {
  const a = text.split('\n');
  return a.length > lines ? '...(cut)...\n' + a.slice(-lines).join('\n') : text;
}
function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) { if (!SKIP_DIRS.has(name)) walk(full, list); }
    else if (!SKIP_FILES.has(name)) list.push({ full, rel: path.relative(ROOT, full).split(path.sep).join('/'), size: st.size });
  }
  return list;
}

const parts = [];
const add = (title, body) => parts.push('==== ' + title + ' ====\n' + body + '\n');

add('GENERATED', new Date().toISOString() + '  |  folder: ' + path.basename(ROOT));
add('VERSIONS', 'node ' + process.version + '\nnpm ' + run('npm', ['--version']) + '\ngit ' + run('git', ['--version']));

const inGit = run('git', ['rev-parse', '--is-inside-work-tree']) === 'true';
if (inGit) {
  add('SAVE POINTS (last 15)', run('git', ['log', '--oneline', '-15']));
  add('CHANGED SINCE LAST SAVE', run('git', ['status', '--short']));
  add('SIZE OF CHANGES', run('git', ['diff', 'HEAD', '--stat']));
} else {
  add('GIT', 'Not tracked by git yet.');
}

if (process.argv.includes('--no-build')) add('BUILD', 'skipped (--no-build)');
else add('BUILD (npm run build, last lines)', tail(run('npm', ['run', 'build'], 120000), 40));

const files = walk(ROOT, []).sort((a, b) => a.rel.localeCompare(b.rel));
add('FILE LIST', files.map((f) => f.rel + '  (' + f.size + ' bytes)').join('\n'));

let total = 0;
for (const f of files) {
  const ext = path.extname(f.rel).toLowerCase();
  if (!TEXT_EXT.has(ext) || f.rel.startsWith('assets/')) continue;
  if (total > MAX_TOTAL) { add('FILE ' + f.rel, '(skipped: project-state size limit reached)'); continue; }
  let text = fs.readFileSync(f.full, 'utf8');
  if (text.length > MAX_FILE) text = text.slice(0, MAX_FILE) + '\n...(file cut at ' + MAX_FILE + ' characters)';
  total += text.length;
  add('FILE ' + f.rel, text);
}

fs.writeFileSync(OUT, parts.join('\n'), 'utf8');
console.log('Created project-state.txt (' + Math.round(fs.statSync(OUT).size / 1024) + ' KB).');
console.log('Attach this file to your message to Claude. If the AI acted strangely, also attach the OpenCode session text.');
