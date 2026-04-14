import { spawn } from 'node:child_process';
import process from 'node:process';

export function execStep(command, args) {
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
