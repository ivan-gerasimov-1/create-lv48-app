import { execStep } from './execStep.mjs';

await main();

async function main() {
  await execStep('npm', ['run', 'release:check']);
  await execStep('npm', ['publish']);
}
