import type { BuildSummaryOptions, InitializationSummary } from './types.js';

export function buildInitializationSummary(
  options: BuildSummaryOptions,
): InitializationSummary {
  const hasPostSetupFailure = options.postSetup.some((status) => !status.ok);

  return {
    projectName: options.projectName,
    targetDirectory: options.targetDirectory,
    scaffold: {
      ok: true,
      filesCreated: options.record.createdFiles.length,
    },
    postSetup: options.postSetup,
    nextSteps: hasPostSetupFailure
      ? [
          `cd ${options.targetDirectory}`,
          'Review the failed optional steps above and rerun them manually if needed.',
        ]
      : [
          `cd ${options.targetDirectory}`,
          'npm run dev:web',
          'npm run dev:site',
          'npm run dev:api',
        ],
  };
}

export function formatInitializationSummary(summary: InitializationSummary): string {
  const postSetupLines = summary.postSetup.map((status) => {
    const label = status.ok ? 'OK' : 'FAILED';
    return `- ${status.name}: ${label} (${status.detail})`;
  });
  const nextStepLines = summary.nextSteps.map((step) => `- ${step}`);

  return [
    '',
    `Project: ${summary.projectName}`,
    `Target: ${summary.targetDirectory}`,
    `Scaffold: created ${summary.scaffold.filesCreated} files`,
    'Post-setup:',
    ...postSetupLines,
    'Next steps:',
    ...nextStepLines,
  ].join('\n');
}
