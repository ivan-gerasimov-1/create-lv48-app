import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

await main();

async function main() {
  await execStep('npm', ['run', 'release:check']);
  await execStep('npm', ['publish', '--access', 'public']);
}

async function execStep(command, args) {
  await execFileAsync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
}
