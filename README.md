# GoodData Slack, JIRA, GIT automation package

## Ownership

- This is internal tooling owned by the Professional Services Department

## Prerequisites

### Must have

- Repository MUST use conventional commits
- Commit subjects should contain JIRA ID

// TODO Verify this functionality:

- PRs are squashed and merged, not merged

### Optional

- Use GitHub Socials for setting Slack ID

## Configuration

- You need to create single github workflow with this 'on' setting. The package handles the rest.

```yml
on:
  pull_request:
    types: [opened, ready_for_review, closed]
```

## Features

### Variables

- JIRA ID -> JIRA ID is taken from the commit subject. If missing, automation won't fail, but the possible
  actions are limited. Messages do not include links to JIRA and tickets cannot be moved to different states.

### Supported Actions

- To hacking
- To review
- To verification

### Business Logic

- PR authors are automatically removed from reviewers.

### Message template variables

- All message template variables act as links.

// TODO: table from this

- {{pr_author}} | GitHub username OR Slack ID (when added in GitHub Social) of Pull Request Author taken from
  GitHub.
- {{pr_title}} | PR title taken from GitHub variables.
- {{jira_id}} | JIRA ID taken from commit subject.
- {{jira_title}} | JIRA ticket title taken by API call to JIRA, only possible when JIRA ID is set in the
  commit subject.
- {{reviewers}} | List of names tagged in Slack message. It can process Slack IDs provided via the reviewers
  property in the action, or it falls back to the CODEOWNERS file. When the codeowners path property is
  defined in the action, it is used; otherwise, default owners are used from the CODEOWNERS file.
