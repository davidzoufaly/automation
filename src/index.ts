import * as core from "@actions/core";
import * as github from "@actions/github";

async function run(): Promise<void> {
  try {
    const JIRA_EMAIL = core.getInput("jira-email", { required: true });
    const JIRA_API_TOKEN = core.getInput("jira-api-token", { required: true });
    const SLACK_BOT_TOKEN = core.getInput("slack-bot-token", { required: true });
    const GITHUB_TOKEN = core.getInput("github-token", { required: true });

    const name = core.getInput("name", { required: true });

    const msg = `Hello, ${name}! From repo ${github.context.repo.owner}/${github.context.repo.repo} on ${github.context.eventName} and ${JIRA_EMAIL} ${JIRA_API_TOKEN} ${SLACK_BOT_TOKEN} ${GITHUB_TOKEN}.`;
    core.setOutput("message", msg);
  } catch (err: any) {
    core.setFailed(err?.message ?? String(err));
  }
}

run();
