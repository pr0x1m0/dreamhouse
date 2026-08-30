---
description: Groom a Jira story into buildable, codebase-aware acceptance criteria (no code changes)
argument-hint: [jira-story-key]
---

You are grooming a Jira story for this Salesforce project. This is **technical grooming only — do not write, edit, or deploy any code, and do not open a plan or branch.**

Story to groom: $ARGUMENTS

If no key was given above, search Jira over the Atlassian MCP for the most likely matching story and state which one you're grooming before continuing.

First, gather context:

1. Read the story from Jira via the Atlassian MCP — its summary, description, and any acceptance criteria or comments already on it.
2. Inspect the **actual repository** to ground everything — open the real object metadata, Apex classes, and LWC components. Do not guess at names; read the files.

Then produce, in this order:

1. **Sharpened acceptance criteria** — testable, in a consistent bullet format. Favour concrete, checkable statements (e.g. exact values, empty/zero cases) over restatements of the ask.
2. **Impact** — the specific fields, Apex classes, and LWC components this would actually touch, each named from the code you just read.
3. **Already exists** — anything the story asks for that is already present in the codebase (fields, components, methods), so the true remaining scope is explicit.
4. **Edge cases & open questions** — realistic edge cases, plus one or two genuine product questions to take back to the business.

End there. Do not make changes — the output is the groomed story, ready for a human to review and for a later plan/build pass.
