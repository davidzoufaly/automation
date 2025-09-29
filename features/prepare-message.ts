import { PR_TYPES } from "../constants/index.ts";
import { writeOutput } from "../utils/index.js";

// Configuration constants
const SLACK_QA_MENTIONS = "<@UUSH95T71> <@U08DRGS3DK6>";
const JIRA_BASE_URL = "https://gooddata.atlassian.net/browse";

const config = {
  messageType: process.env.MESSAGE_TYPE,
  pr: {
    url: process.env.PR_URL,
    title: process.env.PR_TITLE,
    type: process.env.PR_TYPE,
  },
  jira: {
    ticket: process.env.JIRA_TICKET,
    ticketTitle: process.env.TICKET_TITLE,
    ticketParent: process.env.TICKET_PARENT,
    ticketParentTitle: process.env.TICKET_PARENT_TITLE,
  },
  slack: {
    username: process.env.SLACK_USERNAME,
    developerMentions: process.env.SLACK_MENTIONS,
  },
};

// Helper functions
function createJiraLink(ticket, title) {
  return `<${JIRA_BASE_URL}/${ticket} | ${title || ticket}>`;
}

function createPRLink(url, title) {
  return `<${url} | ${title}>`;
}

function cretaJiraParentLink(ticket, title) {
  return `<${JIRA_BASE_URL}/${ticket} | ${title || ticket}>`;
}

function shouldUseTeamReview(prType) {
  const teamReviewTypes = PR_TYPES.filter((type) => type !== "feat" && type !== "fix");
  return teamReviewTypes.includes(prType);
}

function generatePRReviewMessage() {
  const { pr, jira, slack } = config;

  const jiraParentLink =
    jira.ticketParent && jira.ticketParentTitle
      ? `and parent is ${cretaJiraParentLink(jira.ticketParent, jira.ticketParentTitle)}`
      : "";
  const jiraContext = jira.ticket
    ? `for the context here is JIRA: ${createJiraLink(jira.ticket)} ${jiraParentLink},`
    : "";

  return `Hey, PR from ${slack.username} for ${createPRLink(
    pr.url,
    pr.title,
  )} is ready to review, ${jiraContext} PTAL ${slack.developerMentions} :review:`;
}

function generateVerificationMessage() {
  const { pr, jira, slack } = config;
  const isTeamReviewType = shouldUseTeamReview(pr.type);

  const jiraParentLink =
    jira.ticketParent && jira.ticketParentTitle
      ? `and parent is ${cretaJiraParentLink(jira.ticketParent, jira.ticketParentTitle)}`
      : "";

  const taskLink = jira.ticket
    ? `ticket ${createJiraLink(jira.ticket, jira.ticketTitle)} ${jiraParentLink}`
    : `PR ${createPRLink(pr.url, pr.title)}`;

  const mentions = isTeamReviewType ? `DEVS ${slack.developerMentions}` : `QA ${SLACK_QA_MENTIONS}`;

  return `Hey, ${taskLink} is ready for verification from ${mentions} :test_tube: `;
}

function prepareMessage() {
  try {
    const message =
      config.messageType === "pr-review" ? generatePRReviewMessage() : generateVerificationMessage();

    writeOutput("text", message);
  } catch (error) {
    console.error("Error preparing message:", error);
    process.exit(1);
  }
}

prepareMessage();
