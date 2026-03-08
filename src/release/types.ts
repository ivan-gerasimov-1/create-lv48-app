export type PackedFile = {
  path: string;
};

export type ReleaseVerificationResult = {
  expectedFiles: string[];
  missingFiles: string[];
  unexpectedFiles: string[];
};
