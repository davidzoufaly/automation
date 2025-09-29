#!/usr/bin/env node

import { getGitHubSocialAccounts, extractSlackId, writeOutput } from "../utils/index.js";

async function getAuthorSocialAccounts(username) {
  if (!username) {
    console.error("❌ No GitHub username provided");
    process.exit(1);
  }

  try {
    const socialAccounts = await getGitHubSocialAccounts(username, process.env.GITHUB_TOKEN);
    const slackUserId = extractSlackId(socialAccounts);

    if (slackUserId) {
      console.log("Found Slack account for author");
      writeOutput("slack_username", `<@${slackUserId}>`);
    } else {
      console.log("No Slack account found");
      writeOutput("slack_username", username);
    }
  } catch (error) {
    console.error("❌ Error getting social accounts:", error.message);
    // Set empty outputs in case of error
    writeOutput("slack_username", "");
    writeOutput("social_accounts", "[]");
  }
}

getAuthorSocialAccounts(process.env.GITHUB_USERNAME);
