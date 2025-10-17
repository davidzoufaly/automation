import { defaultActionToHacking, defaultActionToReview, defaultActionToVerification } from "@services";
import { UserConfig, Config, ValidTriggers } from "@types";

export const mergeConfigs = (
  secrets: {
    jiraApiToken: string;
    jiraEmail: string;
    slackbotToken: string;
    githubToken: string;
  },
  userConfig: UserConfig,
) => {
  const configBase: Config["base"] = {
    ...userConfig.base,
    jira: {
      ...userConfig.base.jira,
      email: secrets.jiraEmail,
      apiToken: secrets.jiraApiToken,
    },
    slack: {
      ...userConfig.base.slack,
      botToken: secrets.slackbotToken,
    },
    github: {
      token: secrets.githubToken,
    },
  };

  const actions = userConfig.actions;

  const defaultActions = [];
  const customActions = [];

  let toHackingCount = 0;

  for (const action of actions) {
    if (action.extends) {
      defaultActions.push(action);
    } else {
      customActions.push(action);
    }
  }

  const defaultActionsModifiedByUserConfig = defaultActions.map((defaultActionUtilizedByUser) => {
    if (defaultActionUtilizedByUser.trigger) {
      throw new Error("Default action cannot have trigger property, it is defined by 'extends' property");
    }

    if (!defaultActionUtilizedByUser.transitionId) {
      throw new Error(
        "Default action must not have transitionId property, it is defined by 'extends' property",
      );
    }

    if (defaultActionUtilizedByUser.extends === "to-hacking") {
      if (
        defaultActionUtilizedByUser.commitScopes ||
        defaultActionUtilizedByUser.commitTypes ||
        defaultActionUtilizedByUser.message ||
        defaultActionUtilizedByUser.channel
      ) {
        throw new Error(
          "Default to-hacking action does not support commitScopes, commitTypes, message or channel property",
        );
      }

      toHackingCount += 1;

      if (toHackingCount > 1) {
        throw new Error("There can be only one default to-hacking action");
      }

      return {
        name: defaultActionUtilizedByUser.name || defaultActionToHacking.name,
        description: defaultActionUtilizedByUser.description || defaultActionToHacking.description,
        trigger: defaultActionToHacking.trigger,
        transitionId: defaultActionUtilizedByUser.transitionId || defaultActionToHacking.transitionId,
      };
    }

    if (defaultActionUtilizedByUser.extends === "to-review") {
      return {
        name: defaultActionUtilizedByUser.name || defaultActionToReview.name,
        description: defaultActionUtilizedByUser.description || defaultActionToReview.description,
        trigger: defaultActionToReview.trigger,
        transitionId: defaultActionToReview.transitionId,
        message: defaultActionUtilizedByUser.message || defaultActionToReview.message,
        commitScopes: defaultActionUtilizedByUser.commitScopes,
        commitTypes: defaultActionUtilizedByUser.commitTypes,
        channel: defaultActionUtilizedByUser.channel,
        reviewers: defaultActionUtilizedByUser.reviewers,
        codeownersPath: defaultActionUtilizedByUser.codeownersPath,
      };
    }

    if (defaultActionUtilizedByUser.extends === "to-verification") {
      return {
        name: defaultActionUtilizedByUser.name || defaultActionToVerification.name,
        description: defaultActionUtilizedByUser.description || defaultActionToVerification.description,
        trigger: defaultActionToVerification.trigger,
        transitionId: defaultActionToVerification.transitionId,
        message: defaultActionUtilizedByUser.message || defaultActionToVerification.message,
        commitScopes: defaultActionUtilizedByUser.commitScopes,
        commitTypes: defaultActionUtilizedByUser.commitTypes,
        channel: defaultActionUtilizedByUser.channel,
        reviewers: defaultActionUtilizedByUser.reviewers,
        codeownersPath: defaultActionUtilizedByUser.codeownersPath,
      };
    }

    throw new Error("Unknown extends property value in default action");
  });

  const validTriggers: ValidTriggers[] = ["pr-as-draft", "pr-ready-for-review", "pr-merged"];

  const validCustomActions = customActions.map((customAction) => {
    if (customAction.trigger && validTriggers.includes(customAction.trigger) && customAction.name) {
      throw new Error("Custom action must have a valid trigger");
    }

    if (!customAction.transitionId && !customAction.message) {
      throw new Error("Custom action must have at least transitionId or message property");
    }

    return customAction;
  });

  const config = {
    base: configBase,
    actions: [...validCustomActions, ...defaultActionsModifiedByUserConfig],
  } as { base: Partial<Config["base"]>; actions: Config["actions"] };

  return config;
};
