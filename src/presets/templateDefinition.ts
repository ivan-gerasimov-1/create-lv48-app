import path from "node:path";

import { PACKAGE_ROOT } from "../packageRoot.js";
import type { TPackageManager } from "../prompts/types.js";

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
  let filesRoot = path.resolve(PACKAGE_ROOT, "templates", config.name, "files");

  return {
    ...config,
    filesRoot,
  };
}
