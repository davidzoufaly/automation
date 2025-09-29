import * as core from "@actions/core";
import * as github from "@actions/github";

async function run(): Promise<void> {
  try {
    const name = core.getInput("name", { required: true });
    const msg = `Hello, ${name}! From repo ${github.context.repo.owner}/${github.context.repo.repo} on ${github.context.eventName}.`;
    core.setOutput("message", msg);
  } catch (err: any) {
    core.setFailed(err?.message ?? String(err));
  }
}

run();
