#!/usr/bin/env node

import { writeOutput } from "../utils/index.js";

async function getJiraDetails() {
  const jiraTicket = process.env.JIRA_TICKET;
  const jiraToken = process.env.JIRA_API_TOKEN;
  const jiraEmail = process.env.JIRA_EMAIL;

  if (!jiraTicket) {
    console.warn("No Jira ticket found in commit message");
    return;
  }

  try {
    const response = await fetch(`https://gooddata.atlassian.net/rest/api/3/issue/${jiraTicket}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Jira ticket: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract relevant information
    const ticketDetails = {
      summary: data.fields.summary,
      parentTicket: data.fields.parent?.key,
      parentTitle: data.fields.parent?.fields?.summary,
    };
    console.log("Ticket details:", ticketDetails.summary);
    console.log("Ticket parent:", ticketDetails.parentTicket);
    console.log("Ticket parent title:", ticketDetails.parentTitle);
    writeOutput("ticket_title", ticketDetails.summary);
    writeOutput("ticket_parent", ticketDetails.parentTicket);
    writeOutput("ticket_parent_title", ticketDetails.parentTitle);
  } catch (error) {
    console.error(`Error fetching Jira ticket details: ${error.message}`);
  }
}

getJiraDetails();
