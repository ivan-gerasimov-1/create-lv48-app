import { spawn } from 'node:child_process';
import process from 'node:process';

const steps = [
  { label: 'typecheck', command: 'npm', args: ['run', 'typecheck'] },
  { label: 'build', command: 'npm', args: ['run', 'build'] },
  { label: 'test', command: 'npm', args: ['run', 'test'] },
  { label: 'verify-pack', command: 'npm', args: ['run', 'release:verify-pack'] },
  { label: 'smoke', command: 'npm', args: ['run', 'release:smoke'] },
];

await main();

async function main() {
  for (const step of steps) {
    console.log(`Running ${step.label}...`);
    await execStep(step.command, step.args);
  }
}

function execStep(command, args) {
  return new Promise((resolve, reject) => {
    let child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        return;
      }

      resolve();
    });
  });
}
