#!/usr/bin/env node

import { writeOutput } from "../utils/index.js";

function formatSlackMentions(slackIds, prAuthor) {
  try {
    console.log("Processing slack IDs:", slackIds);
    console.log("PR Author:", prAuthor);

    if (!slackIds) {
      console.log("No Slack IDs provided, using default fallback");
      const defaultMention = "team members";
      writeOutput("mentions", defaultMention);
      return;
    }

    // Split pipe-separated values into user pairs (format: "username:slackId|username2:slackId2")
    const userPairs = slackIds.split("|").filter((pair) => pair.trim());
    const mentions = [];

    for (const userPair of userPairs) {
      const [username, slackId] = userPair.split(":").map((part) => part.trim());

      // Skip if this is the PR author
      if (username === prAuthor) {
        console.log(`Skipping PR author ${username} from mentions`);
        continue;
      }

      if (slackId && slackId !== "no_slack") {
        mentions.push(`<@${slackId}>`);
        console.log(`Added mention for ${username}: <@${slackId}>`);
      } else {
        console.log(`No Slack ID for ${username}, skipping mention`);
      }
    }

    const finalMentions = mentions.length > 0 ? mentions.join(" ") : "team members";
    console.log("Final mentions:", finalMentions);

    writeOutput("mentions", finalMentions);
  } catch (error) {
    console.error("❌ Error formatting mentions:", error.message);
    const defaultMention = "team members";
    writeOutput("mentions", defaultMention);
  }
}

formatSlackMentions(process.env.SLACK_IDS, process.env.PR_AUTHOR);
