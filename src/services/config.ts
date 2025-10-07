// TODO: mergování user configu s default configem
// TODO: jak zamezit toho aby se akce neduplikovaly
// TODO: fake MC config to see if it is designed well
// TODO: create testing config

export const defaultActionToHacking = {
  name: "Default to Hacking",
  description:
    "Default to hacking action, triggers when PR is marked as draft and moves the linked JIRA issue to 'Hacking' status.",
  trigger: "pr-as-draft",
  // This is default action so it isn't extending anything but it is used to match the custom action with default one.
  extends: "to-hacking",
  // TODO: Document this fact in README.md
  // Transition ID is considering "Production Line 3.0 - Stories & Bugs" JIRA workflow (id: ae4174cd-4a18-4f91-a1c2-3ab7f1c9f4d4) as this one is used in Scrum implementation of Professional Services department.
  transitionId: "61",
};

export const defaultActionToReview = {
  name: "Default to Review",
  description:
    "Default to review action, triggers when PR is marked as ready for review and moves the linked JIRA issue to 'Code Review' status and sends a slack message.",
  trigger: "pr-ready-for-review",
  // This is default action so it isn't extending anything but it is used to match the custom action with default one.
  extends: "to-review",
  message:
    "Hey, PR from {{pr_author}} for {{pr_title}} is ready to review, for the context here is JIRA: {{jira_id}}, PTAL {{reviewers}} :review:",
  transitionId: "251",
};

export const defaultActionToVerification = {
  name: "Default to Verification",
  description:
    "Default to verification action, triggers when PR is merged and moves the linked JIRA issue to 'Verification' status and sends a slack message.",
  trigger: "pr-merged",
  transitionId: "81",
  message:
    "Hey, ticket {{jira_id}}: {{jira_title}} is now ready for verification, PTAL {{reviewers}} :test_tube:",
};
