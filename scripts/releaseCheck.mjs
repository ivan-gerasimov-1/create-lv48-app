import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const steps = [
  { label: 'typecheck', command: 'npm', args: ['run', 'typecheck'] },
  { label: 'build', command: 'npm', args: ['run', 'build'] },
  { label: 'test', command: 'npm', args: ['run', 'test'] },
  { label: 'verify-pack', command: 'npm', args: ['run', 'release:verify-pack'] },
];

await main();

async function main() {
  for (const step of steps) {
    console.log(`Running ${step.label}...`);
    await execStep(step.command, step.args);
  }
}

async function execStep(command, args) {
  await execFileAsync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
}
