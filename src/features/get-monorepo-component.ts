#!/usr/bin/env node
import { MONOREPO_COMPONENTS, SLACK_CHANNELS, CODEOWNERS_PATHS } from "../../slack-bot-config.js";
import { writeOutput } from "../utils/index.js";

// Get the directory name of the current module

const FALLBACK_COMPONENT = {
  slackChannel: SLACK_CHANNELS.MONOREPO,
  codeownersPath: CODEOWNERS_PATHS.ALL,
};

function determineMonorepoComponent(commitMessage) {
  const matchedMonorepoComponent = MONOREPO_COMPONENTS.find((monorepoComponent) =>
    monorepoComponent.commitScope.test(commitMessage),
  );

  return matchedMonorepoComponent || FALLBACK_COMPONENT;
}

const gitCommitMessage = process.env.GIT_COMMIT_MESSAGE;

const monorepoComponent = determineMonorepoComponent(gitCommitMessage);
console.log(`Slack channel: ${monorepoComponent.slackChannel}`);
console.log(`CODEOWNERS path: ${monorepoComponent.codeownersPath}`);

writeOutput("slack_channel_name", monorepoComponent.slackChannel);
writeOutput("codeowners_path", monorepoComponent.codeownersPath);
