import { defineTemplate } from "#/presets/templateDefinition";

export const baseTemplate = defineTemplate({
  name: "base",
  displayName: "Base SaaS Monorepo",
  description: "Baseline npm-workspaces monorepo for TS-first SaaS projects.",
  packageManagers: ["npm"],
  reservedDirectories: ["packages"],
  placeholderKeys: [
    "projectName",
    "packageName",
    "displayName",
    "targetDirectory",
    "webPackageName",
    "sitePackageName",
    "apiPackageName",
    "webWorkspacePath",
    "siteWorkspacePath",
    "apiWorkspacePath",
    "workspaceLayout",
    "appProjectName",
  ],
  postGeneration: {
    installDependencies: true,
    initializeGit: true,
  },
});
