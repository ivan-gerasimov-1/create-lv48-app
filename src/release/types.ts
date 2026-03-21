export type TPackedFile = {
  path: string;
};

export type TReleaseVerificationResult = {
  expectedFiles: string[];
  missingFiles: string[];
  unexpectedFiles: string[];
};
