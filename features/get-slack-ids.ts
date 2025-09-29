#!/usr/bin/env node

// Script to map GitHub usernames to Slack IDs using GitHub social accounts
import { getGitHubSocialAccounts, extractSlackId, writeOutput } from "../utils/index.js";

async function mapGitHubUsersToSlackIds() {
  const userList = process.env.USER_LIST;
  const githubToken = process.env.GITHUB_TOKEN;

  console.log("Processing user list:", userList);

  if (!userList) {
    throw new Error("Userlist is empty");
  }

  const usernames = userList
    .split(",")
    .map((u) => u.trim().replace(/^@/, ""))
    .filter(Boolean);
  console.log("Extracted usernames:", usernames);

  const slackIdsResult = [];

  for (const username of usernames) {
    console.log("Fetching social links for user:", username);

    try {
      const socialAccounts = await getGitHubSocialAccounts(username, githubToken);
      const slackId = extractSlackId(socialAccounts);

      if (slackId) {
        slackIdsResult.push(`${username}:${slackId}`);
      } else {
        console.log("No Slack ID found for", username);
        slackIdsResult.push(`${username}:no_slack`);
      }
    } catch (error) {
      console.error("Error processing user:", username, error);
      slackIdsResult.push(`${username}:no_slack`);
    }
  }

  const resultString = slackIdsResult.join("|");
  console.log("Final result:", resultString);

  writeOutput("slack_ids", resultString);
}

mapGitHubUsersToSlackIds().catch((error) => {
  console.error(error);
  writeOutput("slack_ids", "");
  process.exit(1);
});
