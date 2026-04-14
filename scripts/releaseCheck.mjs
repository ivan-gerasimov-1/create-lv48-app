import { execStep } from "./execStep.mjs";

let steps = [
  { label: "build", command: "npm", args: ["run", "build"] },
  { label: "test", command: "npm", args: ["run", "test"] },
  {
    label: "verify-pack",
    command: "npm",
    args: ["run", "release:verify-pack"],
  },
];

await main();

async function main() {
  for (let step of steps) {
    console.log(`Running ${step.label}...`);
    await execStep(step.command, step.args);
  }
}
