import { run } from 'node:test';
import { spec } from 'node:test/reporters';

const stream = run({
  concurrency: false,
  globPatterns: ['tests/**/*.test.ts'],
});

stream.on('test:fail', () => {
  process.exitCode = 1;
});

stream.compose(spec).pipe(process.stdout);
