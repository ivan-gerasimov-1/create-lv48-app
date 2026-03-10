export type ManagedChangesetConfig = {
  directory: string;
  filenamePrefix?: string;
  filenameTemplate: string;
  summarySource?: string;
  removeWhenLabelMissing?: boolean;
};

export type ReleaseAutomationConfig = {
  defaultBranch?: string;
  releaseLabels: Record<string, string>;
  managedChangeset: ManagedChangesetConfig;
};

export type ReleaseIntent = {
  label: string;
  bumpType: string;
};

export type SyncManagedChangesetOptions = {
  cwd: string;
  prNumber: number;
  prTitle: string;
  labels: string[];
};

export type SyncManagedChangesetResult = {
  action: 'written' | 'removed';
  relativeChangesetPath: string;
  releaseLabel: string;
};

export function loadReleaseAutomationConfig(cwd?: string): Promise<ReleaseAutomationConfig>;
export function loadPackageName(cwd?: string): Promise<string>;
export function resolveManagedChangesetPath(
  config: { managedChangeset: ManagedChangesetConfig },
  prNumber: number,
): string;
export function resolveReleaseIntent(
  config: ReleaseAutomationConfig,
  labels: string[],
): ReleaseIntent;
export function createManagedChangesetContent(
  packageName: string,
  bumpType: string,
  summary: string,
): string;
export function syncManagedChangeset(
  options: SyncManagedChangesetOptions,
): Promise<SyncManagedChangesetResult>;
