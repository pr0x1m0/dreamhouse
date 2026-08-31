---
description: Propose an implementation plan for a Jira story and stop for approval (no code changes)
argument-hint: '[jira-story-key]'
---

You are planning the implementation of a Jira story for this Salesforce project. **Propose a plan only — do not edit, create, or deploy any code, and do not open a branch yet.**

Story to plan: $ARGUMENTS

If no key was given above, ask which story to plan rather than guessing.

First, gather context:

1. Read the story from Jira over the Atlassian MCP — its description, acceptance criteria, and any comments (grooming notes may live there).
2. Read the **actual code** you'll be changing — the relevant object metadata, Apex, and LWC — so the plan reflects the real structure, not an assumed one.

Then produce an implementation plan with these sections:

1. **Branch** — a proposed feature branch name that references the story key.
2. **Changes** — each file you'll touch, what will change in it and why, in the order you'd make the changes. Name real files.
3. **Tests** — the Apex test classes and/or LWC Jest specs you'll add or update, and the cases they'll cover, including the empty / zero / error cases implied by the acceptance criteria.
4. **Assumptions & decisions** — call out any product or design decision the story leaves open. State the assumption you would proceed with and mark it clearly so a human can confirm or change it. Do not silently pick a direction on an open question.
5. **Out of scope** — anything deliberately deferred.

End by stating the plan is awaiting approval: the human replies **approve** to proceed to build, or gives adjustments. Make no changes until then.
