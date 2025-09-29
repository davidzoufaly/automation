import dotenv from "dotenv";
dotenv.config();

// TODO: mergování user configu s default configem
// TODO: jak zamezit toho aby se akce neduplikovaly
// TODO: fake MC config to see if it is designed well
// TODO: create testing config

type Config = {
  base: {
    jira: {
      domain?: string;
      email?: string;
      apiToken?: string;
    };
    slack: {
      botToken?: string;
      defaultChannel?: string;
    };
    github: {
      token?: string;
    };
  };
  actions: {
    // TODO: log name in workflow
    // mandatory - used for identifying the action in logs
    name: string;
    // TODO: create github action mapping
    // optional for default actions, mandatory for custom actions. This is used to github action mapping
    trigger?: "pr-as-draft" | "pr-ready-for-review" | "pr-merged";
    // TODO: log description in workflow
    // optional - used for logging the action execution
    description?: string;
    // TODO: create default action templates
    // optional - if used there are automatically taken messages templates (and other optional properties, such a description), which can be overridden in the action definition
    extends?: "to-hacking" | "to-review" | "to-verification";
    // optional - if used only specific commit scopes will trigger this action
    commitScopes?: string[];
    // optional - if used only specific commit types will trigger this action
    commitTypes?: string[];
    // optional - if used, the bot will post the message to this channel instead of the default one
    channel?: string;
    // TODO: creaate messages and templates
    // optional - if used, the bot will post this message to slack when the action is triggered, supports template variables, if ommitted, when 'extends' property is used, default message is sent, if extends is ommited and no message is provided it won't trigger any slack automation.
    message?: string;
    // optional - for JIRA state change when adding custom actions, if ommited and 'extends' property is used, default transitionId is used, if ommited and 'extends' is ommited, no JIRA transition is performed
    // TODO: discover if this is enough in JIRA to move issues between states
    transitionId?: string;
    // optional - if used, the bot will request a review from these users when the PR is ready for review, by default using CODEOWNERS file, should be in the format of Slack ID's
    // TODO: document slack ID format and how to get them in README.md
    reviewers?: string[];
    // TODO: document in README that this is about subpath of packages/app, path to CODEOWNERS files is always in .github folder of repository (otherwise it won't work for git anyway)
    // optional - if used, and 'reviewers' property is not specified, it search for this path inside CODEOWNERS file, if path not found it will fallback to default codeowners or do nothing if there are no default owners.
    codeownersPath?: string;
  }[]; // Array of action configurations
};

export const defaultConfig: Config = {
  base: {
    jira: {
      domain: undefined,
      email: undefined,
      apiToken: undefined,
    },
    slack: {
      botToken: undefined,
      defaultChannel: undefined,
    },
    github: {
      token: undefined,
    },
  },
  actions: [
    {
      name: "Default to Hacking",
      description:
        "Default to hacking action, triggers when PR is marked as draft and moves the linked JIRA issue to 'Hacking' status.",
      trigger: "pr-as-draft",
      // This is default action so it isn't extending anything but it is used to match the custom action with default one.
      extends: "to-hacking",
      // TODO: Document this fact in README.md
      // Transition ID is considering "Production Line 3.0 - Stories & Bugs" JIRA workflow (id: ae4174cd-4a18-4f91-a1c2-3ab7f1c9f4d4) as this one is used in Scrum implementation of Professional Services department.
      transitionId: "61",
    },
    {
      name: "Default to Review",
      description:
        "Default to review action, triggers when PR is marked as ready for review and moves the linked JIRA issue to 'Code Review' status and sends a slack message.",
      trigger: "pr-ready-for-review",
      // This is default action so it isn't extending anything but it is used to match the custom action with default one.
      extends: "to-review",
      message:
        "Hey, PR from {{pr_author}} for {{pr_title}} is ready to review, for the context here is JIRA: {{jira_id}}, PTAL {{reviewers}} :review:",
      transitionId: "251",
    },
    {
      name: "Default to Verification",
      description:
        "Default to verification action, triggers when PR is merged and moves the linked JIRA issue to 'Verification' status and sends a slack message.",
      trigger: "pr-merged",
      transitionId: "81",
      message:
        "Hey, ticket {{jira_id}}: {{jira_title}} is now ready for verification, PTAL {{reviewers}} :test_tube:",
    },
  ],
};

export const mcCustomConfig = {
  base: {
    jira: {
      domain: "https://gooddata.atlassian.net",
      // this user should have write permissions to the projects where the issues are
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    },
    slack: {
      // this bot should be added to the channels where you want to post messages
      botToken: process.env.SLACK_BOT_TOKEN,
      // if commit scope does not match any action, this channel is used
      defaultChannel: "cust-mc_monorepo",
    },
    github: {
      token: process.env.GITHUB_TOKEN,
    },
  },
  actions: [
    // This enables to-hacking action
    {
      name: "Tickets to hacking",
      extends: "to-hacking",
    },
    // This configures to-review action for all MC packages/apps
    // mic
    {
      name: "MIC to review",
      extends: "to-review",
      channel: "cust-mc_mic-fe",
      commitScopes: ["mic-lib"],
      codeownersPath: "/packages/mic-components",
    },
    // fi-e2e
    {
      name: "FI-E2E to review",
      extends: "to-review",
      commitScopes: ["fi-e2e"],
      channel: "cust-mc_fi-fe",
      codeownersPath: "/packages/fi-e2e",
    },
    // mic-e2e
    {
      name: "MIC-E2E to review",
      extends: "to-review",
      channel: "cust-mc_mic-fe",
      commitScopes: ["mic-e2e"],
      codeownersPath: "/packages/mic-e2e",
    },
    // fi-app
    {
      name: "FI-App to review",
      extends: "to-review",
      channel: "cust-mc_fi-fe",
      commitScopes: ["fi-app"],
      codeownersPath: "/apps/fi-app",
    },
    // mic-app
    {
      name: "MIC-App to review",
      extends: "to-review",
      channel: "cust-mc_mic-fe",
      commitScopes: ["mic-app"],
      codeownersPath: "/apps/mic-parent-mock",
    },
    // nudata-app
    {
      name: "NuData-App to review",
      extends: "to-review",
      channel: "cust-mc_nudata-fe",
      commitScopes: ["nudata-app"],
      codeownersPath: "/apps/nudata-app",
    },
    // ext-serv -> default channel
    {
      name: "Ext-Serv to review",
      extends: "to-review",
      commitScopes: ["ext-serv"],
      codeownersPath: "/packages/external-services",
    },
    // repo|UI -> default channel
    {
      name: "Repo UI to review",
      extends: "to-review",
      commitScopes: ["repo", "ui"],
      codeownersPath: "/packages/repo|UI",
    },
    // This configures to-verification action for all MC packages/apps
    // mic lib, app QA
    {
      name: "MIC to verification QA",
      description:
        "Verification Slack message and JIRA ticket transition for MIC library changes that should be verified by QA.",
      extends: "to-verification",
      commitScopes: ["mic-lib, mic-app"],
      channel: "cust-mc_mic-fe",
      commitTypes: ["feat", "fix"],
      reviewers: ["UUSH95T71", "U08DRGS3DK6"], // thao, giao
    },
    // mic lib DEV
    {
      name: "MIC package to verification by DEV",
      description:
        "Verification Slack message and JIRA ticket transition for MIC library changes that should be verified by DEV.",
      extends: "to-verification",
      commitScopes: ["mic-lib"],
      channel: "cust-mc_mic-fe",
      commitTypes: ["chore", "docs", "style", "refactor", "perf", "test"],
      codeownersPath: "/packages/mic-components",
    },
    // mic app DEV
    {
      name: "MIC app to Verification by DEV",
      description:
        "Verification Slack message and JIRA ticket transition for MIC app changes that should be verified by DEV.",
      extends: "to-verification",
      commitScopes: ["mic-app"],
      channel: "cust-mc_mic-fe",
      commitTypes: ["chore", "docs", "style", "refactor", "perf", "test"],
      codeownersPath: "/apps/mic-parent-mock",
    },
    // mic app QA
    {
      name: "MIC app to Verification by QA",
      description:
        "Verification Slack message and JIRA ticket transition for MIC app changes that should be verified by QA.",
      extends: "to-verification",
      commitScopes: ["mic-app"],
      channel: "cust-mc_mic-fe",
      commitTypes: ["feat", "fix"],
      reviewers: ["UUSH95T71", "U08DRGS3DK6"], // thao, giao
    },
    // mic e2e
    {
      name: "MIC E2E to Verification by DEV",
      description:
        "Verification Slack message and JIRA ticket transition for MIC e2e test changes that should be verified by DEV.",
      extends: "to-verification",
      commitScopes: ["mic-e2e"],
      channel: "cust-mc_mic-fe",
      codeownersPath: "/packages/mic-e2e",
    },
    // fi app Dev
    {
      name: "FI App to Verification by DEV",
      description:
        "Verification Slack message and JIRA ticket transition for FI app changes that should be verified by DEV.",
      extends: "to-verification",
      commitScopes: ["fi-app"],
      commitTypes: ["chore", "docs", "style", "refactor", "perf", "test"],
      channel: "cust-mc_fi-fe",
      codeownersPath: "/apps/fi-app",
    },
    // fi app QA
    {
      name: "FI App to Verification by QA",
      description:
        "Verification Slack message and JIRA ticket transition for FI app changes that should be verified by QA.",
      extends: "to-verification",
      commitScopes: ["fi-app"],
      commitTypes: ["feat", "fix"],
      channel: "cust-mc_fi-fe",
      reviewers: ["UUSH95T71", "U08DRGS3DK6"], // thao, giao
    },
    // fi e2e
    {
      name: "FI E2E to Verification by DEV",
      description:
        "Verification Slack message and JIRA ticket transition for FI e2e test changes that should be verified by DEV.",
      extends: "to-verification",
      commitScopes: ["fi-e2e"],
      channel: "cust-mc_fi-fe",
      codeownersPath: "/packages/fi-e2e",
    },
    // monorepo DEV
    {
      name: "Monorepo to Verification by DEV",
      description:
        "Verification Slack message and JIRA ticket transition for monorepo changes that should be verified by DEV.",
      extends: "to-verification",
      commitScopes: ["ext-serv", "repo", "ui"],
      commitTypes: ["chore", "docs", "style", "refactor", "perf", "test"],
      codeownersPath: "*",
    },
    // monorepo QA
    {
      name: "Monorepo to Verification by QA",
      description:
        "Verification Slack message and JIRA ticket transition for monorepo changes that should be verified by QA.",
      extends: "to-verification",
      commitScopes: ["ext-serv", "repo", "ui"],
      commitTypes: ["feat", "fix"],
      reviewers: ["UUSH95T71", "U08DRGS3DK6"], // thao, giao
    },
  ],
};
