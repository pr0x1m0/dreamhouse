---
description: Review the open pull request for a Jira story against its acceptance criteria and code quality
argument-hint: '[jira-story-key]'
---

You are reviewing the pull request for a Jira story in this Salesforce project. **Review only — do not edit code, and do not post anything to GitHub until I approve.**

Story key: $ARGUMENTS

Steps:

1. Read the story from Jira over the Atlassian MCP — its description, acceptance criteria, and comments (grooming/plan notes may live there).
2. Find the open pull request for this story: `gh pr list --state open --search "<story-key> in:title,body"`. If none is found, or more than one matches, stop and tell me rather than guessing which PR to review.
3. Read the PR's diff (`gh pr diff <number>`) and check it against the story's acceptance criteria, one by one — call out anything unmet, partially met, or ambiguous.
4. Run the `code-review` skill against that PR for correctness and simplification findings, and fold its results in alongside the acceptance-criteria check.
5. Present combined findings — acceptance-criteria gaps first, then code-quality findings, most important first. If there's nothing to flag, say so plainly rather than inventing minor nits.
6. Ask whether to post the findings to the PR. On approval, post a single summary comment via `gh pr comment <number> --body "..."`. Do not post anything until I say to.

Do not merge, approve, or request changes on the PR — this command only reviews and optionally comments.
