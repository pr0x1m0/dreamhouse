---
description: Draft or update a Confluence doc page for a story, following the two-layer doc template
argument-hint: '[jira-story-key]'
---

Draft or update documentation for a completed story, following the project documentation template at @DOC_TEMPLATE.md.

Story: $ARGUMENTS

Steps:

1. Read the story and its merged change (the PR / diff) to see what actually changed.
2. Use the feature-to-page map to find which Confluence page owns this area. If none fits, propose a new page and say so rather than guessing.
3. Read the current Confluence page over the Atlassian MCP, so you update it in place instead of duplicating it.
4. Produce two things, both following @DOC_TEMPLATE.md:
    - a **change-history note** — a short, dated entry of what changed, to append;
    - the **living-reference edits** — the specific changes to the "For everyone" and "For developers" sections so the page reflects the new behaviour. Show them as clearly marked edits, don't just append.
5. Present the draft for review. **Do not publish until I approve.** On approval, write it back via the MCP.

Keep the business layer plain-language and the technical layer specific, per the template. Never merge the two audiences.
