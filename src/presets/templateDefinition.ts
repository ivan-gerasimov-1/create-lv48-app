import path from "node:path";

import { TEMPLATES_ROOT } from "#/packageRoot";
import type { TPackageManager } from "#/prompts/types";

export type TTemplateMetadata = {
  name: "base";
  displayName: string;
  description: string;
  packageManagers: TPackageManager[];
  reservedDirectories?: string[];
  placeholderKeys: string[];
  postGeneration: {
    installDependencies: boolean;
    initializeGit: boolean;
  };
};

export type TTemplateDefinition = TTemplateMetadata & {
  filesRoot: string;
};

export function defineTemplate(config: TTemplateMetadata): TTemplateDefinition {
  let filesRoot = path.resolve(TEMPLATES_ROOT, config.name, "files");

  return {
    ...config,
    filesRoot,
  };
}
