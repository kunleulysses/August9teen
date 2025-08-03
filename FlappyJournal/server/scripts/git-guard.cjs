import { execSync } from 'child_process';
import { exit } from 'process';

const output = execSync('git diff --cached --name-only').toString();
const forbidden = /(\.backup|\.bak|\.orig|\.rej|\.patch)$/;
const offenders = output.split('\n').filter((f) => forbidden.test(f));
if (offenders.length) {
  console.error('\u274C Commit rejected: forbidden file types detected:\n', offenders.join('\n'));
  exit(1);
}