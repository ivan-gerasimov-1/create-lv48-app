import { execStep } from './execStep.mjs';

let steps = [
  { label: 'typecheck', command: 'npm', args: ['run', 'typecheck'] },
  { label: 'build', command: 'npm', args: ['run', 'build'] },
  { label: 'test', command: 'npm', args: ['run', 'test'] },
  { label: 'verify-pack', command: 'npm', args: ['run', 'release:verify-pack'] },
  { label: 'smoke', command: 'npm', args: ['run', 'release:smoke'] },
];

await main();

async function main() {
  for (let step of steps) {
    console.log(`Running ${step.label}...`);
    await execStep(step.command, step.args);
  }
}
