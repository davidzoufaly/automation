#!/usr/bin/env node
import { writeOutput } from "../utils/index.js";

export function extractJiraIssueReferences(message) {
  const jiraIssueRegex = /\s*?\b([A-Z]+?-\d+?)\b\s*?/gim;
  const normalized = [...message.matchAll(jiraIssueRegex)].map((match) => match[1].toUpperCase());
  return [...new Set(normalized)];
}

function extractJiraTicket(message) {
  if (!message) {
    console.error("❌ No Message provided");
    process.exit(1);
  }

  console.log("Message:", message);

  const jiraMatch = extractJiraIssueReferences(message);

  if (jiraMatch.length === 0) {
    console.log(
      "NO JIRA ticket found in message. (Expected format 2–10 uppercase letters)-(one or more digits)",
    );
    writeOutput("jira_ticket", "");

    return;
  }

  const jiraTicket = jiraMatch[0];
  console.log("✅ Found JIRA ticket:", jiraTicket);
  writeOutput("jira_ticket", jiraTicket);

  return;
}

extractJiraTicket(process.env.GIT_COMMIT_MESSAGE);
