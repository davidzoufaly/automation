export const SLACK_CHANNELS = {
  EXTERNAL: "test-cust-external",
  FI: "test-cust-fi",
  LIST: "test-cust-list",
  PLUGINS: "test-cust-plugins",
  NUTADATA: "test-cust-nudata",
};

export const CODEOWNERS_PATHS = {
  EXTERNAL: "/packages/external",
  FI: "/apps/fi",
  LIST: "/packages/list",
  NUTADATA: "/packages/nudata",
  PLUGINS: "/packages/plugins",
};

export const MONOREPO_COMPONENTS = [
  {
    commitScope: /external/i,
    slackChannel: SLACK_CHANNELS.EXTERNAL,
    codeownersPath: CODEOWNERS_PATHS.EXTERNAL,
  },
  {
    commitScope: /fi/i,
    slackChannel: SLACK_CHANNELS.FI,
    codeownersPath: CODEOWNERS_PATHS.FI,
  },
  {
    commitScope: /list/i,
    slackChannel: SLACK_CHANNELS.LIST,
    codeownersPath: CODEOWNERS_PATHS.LIST,
  },
  {
    commitScope: /nudata/i,
    slackChannel: SLACK_CHANNELS.NUTADATA,
    codeownersPath: CODEOWNERS_PATHS.NUTADATA,
  },
  {
    commitScope: /plugins/i,
    slackChannel: SLACK_CHANNELS.PLUGINS,
    codeownersPath: CODEOWNERS_PATHS.PLUGINS,
  },
];
