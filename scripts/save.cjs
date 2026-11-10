// save.cjs: makes a save point (git commit) of everything. Usage: npm run save
const { spawnSync } = require('child_process');
const readline = require('readline');

function git(args) {
  return spawnSync('git', args, { encoding: 'utf8', shell: false });
}

if (git(['--version']).error) {
  console.log('Git is not installed (or not in PATH). Install it from git-scm.com, then restart the terminal.');
  process.exit(1);
}
if (git(['rev-parse', '--is-inside-work-tree']).status !== 0) {
  console.log('This folder is not tracked yet. Run these once:  git init   then run: npm run save');
  process.exit(1);
}

const status = git(['status', '--porcelain']).stdout.trim();
if (!status) {
  console.log('Nothing changed since the last save point. Nothing to save.');
  process.exit(0);
}
console.log('Files changed since the last save:\n' + status + '\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Short note for this save point (example: step 2 done): ', (answer) => {
  rl.close();
  const msg = answer.trim() || 'save';
  git(['add', '-A']);
  const r = git(['commit', '-m', msg]);
  if (r.status !== 0) {
    console.log('Save failed:\n' + r.stdout + r.stderr);
    console.log('If it says "Please tell me who you are", run these two lines once, then try again:');
    console.log('  git config --global user.name "Your name"');
    console.log('  git config --global user.email "you@example.com"');
    process.exit(1);
  }
  console.log('Saved: "' + msg + '"');
});
