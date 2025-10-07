export type Config = {
  base: {
    jira: {
      domain?: string;
      // this user should have write permissions to the projects where the issues are
      email?: string;
      apiToken?: string;
    };
    slack: {
      // this bot should be added to the channels where you want to post messages
      botToken?: string;
      // if commit scope does not match any action, this channel is used
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

export type UserConfig = Omit<Config, "base"> & {
  base: {
    jira: {
      domain?: string;
    };
    slack: {
      defaultChannel?: string;
    };
  };
};

export type ValidTriggers = NonNullable<Config["actions"][number]["trigger"]>;
