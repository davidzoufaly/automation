import * as core from "@actions/core";
import * as github from "@actions/github";
import { mergeConfigs, readConfigFile } from "@utils";

async function run(): Promise<void> {
  try {
    const JIRA_EMAIL = core.getInput("jira-email", { required: true });
    const JIRA_API_TOKEN = core.getInput("jira-api-token", { required: true });
    const SLACKBOT_TOKEN = core.getInput("slackbot-token", { required: true });
    const GITHUB_TOKEN = core.getInput("github-token", { required: true });

    const userConfig = await readConfigFile();

    if (!userConfig) {
      throw new Error("Failed to load user configuration");
    }

    const config = mergeConfigs(
      {
        jiraApiToken: JIRA_API_TOKEN,
        jiraEmail: JIRA_EMAIL,
        slackbotToken: SLACKBOT_TOKEN,
        githubToken: GITHUB_TOKEN,
      },
      userConfig,
    );
    const name = core.getInput("name", { required: true });

    const msg = `Hello, ${name}! From repo ${github.context.repo.owner}/${github.context.repo.repo} on ${github.context.eventName} and ${JIRA_EMAIL} ${JIRA_API_TOKEN} ${SLACKBOT_TOKEN} ${GITHUB_TOKEN}.`;
    core.setOutput("message", msg);

    const msg2 = `Configuration: ${JSON.stringify(config, null, 2)}`;
    console.log(msg2);
  } catch (err: any) {
    core.setFailed(err?.message ?? String(err));
  }
}

run();
