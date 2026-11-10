// undo.cjs: throws away everything changed since the last save point. Usage: npm run undo
// New files the AI created are removed too (except node_modules, which git ignores).
const { spawnSync } = require('child_process');
const readline = require('readline');

function git(args) {
  return spawnSync('git', args, { encoding: 'utf8', shell: false });
}

if (git(['rev-parse', '--is-inside-work-tree']).status !== 0) {
  console.log('This folder is not tracked by git yet. Nothing to undo.');
  process.exit(1);
}
if (git(['rev-parse', '--verify', 'HEAD']).status !== 0) {
  console.log('There is no save point yet. Run "npm run save" first.');
  process.exit(1);
}
const status = git(['status', '--porcelain']).stdout.trim();
if (!status) {
  console.log('Nothing changed since the last save point. Nothing to undo.');
  process.exit(0);
}
console.log('These changes will be LOST:\n' + status + '\n');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Type YES to go back to the last save point: ', (answer) => {
  rl.close();
  if (answer.trim() !== 'YES') { console.log('Cancelled. Nothing was changed.'); return; }
  git(['reset', '--hard', 'HEAD']);
  git(['clean', '-fd']);
  console.log('Done. The project is back at the last save point.');
});
