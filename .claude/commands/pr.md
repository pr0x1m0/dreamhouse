---
description: Open a pull request for the current branch, linked to its Jira story
argument-hint: '[jira-story-key]'
---

Open a pull request for the work on the current branch.

Story key: $ARGUMENTS

Steps:

1. Confirm the current branch is a feature branch, not `main`, and that all changes are committed. If there are uncommitted changes, stop and tell me rather than committing silently.
2. Push the current branch to origin.
3. Create a pull request against `main` using the GitHub CLI (`gh pr create`), with:
    - a title that includes the story key and a short summary of the change;
    - a body that briefly describes what changed and why, lists the tests added or updated, and references the Jira story key so the PR is traceable back to it.
4. Print the URL of the created pull request.

Do not merge the pull request — a human reviews and merges it, and the merge is what triggers the deploy.
