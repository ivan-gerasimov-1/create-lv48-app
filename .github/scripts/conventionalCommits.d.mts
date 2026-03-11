export type ConventionalCommitPolicy = {
  mergeStrategy: string;
  breakingChangeFooter: string;
  types: Record<
    string,
    {
      release: string;
      description: string;
    }
  >;
};

export type ParsedConventionalCommit = {
  description: string;
  isBreaking: boolean;
  release: string;
  scope: string | null;
  type: string;
};

export type ReleaseIntentValidationResult =
  | {
      acceptedBy: 'pull_request_title';
      parsedTitle: ParsedConventionalCommit;
    }
  | {
      acceptedBy: 'commit_messages';
      commitCount: number;
    };

export function loadConventionalCommitPolicy(cwd?: string): Promise<ConventionalCommitPolicy>;
export function parseConventionalCommit(
  message: string,
  policy: ConventionalCommitPolicy,
): ParsedConventionalCommit | null;
export function validateReleaseIntent(
  input: {
    prTitle?: string;
    commitMessages: string[];
  },
  policy: ConventionalCommitPolicy,
): ReleaseIntentValidationResult;
