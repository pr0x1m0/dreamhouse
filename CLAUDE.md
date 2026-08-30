# CLAUDE.md — dreamhouse delivery-pipeline demo

Guidance for working in this repo. Read this at the start of every session.

## What this project is

Dreamhouse is a Salesforce real-estate sample app (property listings + brokers). This fork is the codebase for an **AI-augmented delivery pipeline demo**: stories come from Jira, work is built here on feature branches, and merges to `main` auto-deploy to a Salesforce Dev org via GitHub Actions. Keep changes small, story-driven, and reviewable.

## Stack & layout

- **Salesforce DX**, source format. The only package directory is `force-app` (see `sfdx-project.json`).
- **Apex** controllers/services in `force-app/main/default/classes`.
- **Lightning Web Components** in `force-app/main/default/lwc`.
- **Custom objects** `Property__c` and `Broker__c` in `force-app/main/default/objects` (fields use the `__c` suffix; note `Date_Listed__c`, `Days_On_Market__c`, `Status__c`, `Beds__c`, `Baths__c`, `Price__c`, `Broker__c`).

## Commands (use these, don't guess)

- Lint LWC JS: `npm run lint`
- LWC unit tests (Jest): `npm run test:unit`
- Format / check formatting: `npm run prettier` / `npm run prettier:verify`
- Run Apex tests against the dev org: `sf apex run test --target-org ai-poc --result-format human --code-coverage --wait 10`
- Local deploy for testing: `sf project deploy start --source-dir force-app --target-org ai-poc`
- Retrieve from org: `sf project retrieve start --target-org ai-poc`

A pre-commit hook (husky + lint-staged) runs Prettier/ESLint on staged files, so keep code formatted.

## Org access — hard rules

- The **only** org this environment may target is the Dev org aliased **`ai-poc`**. Never target, deploy to, or authenticate any other org.
- **Production is never authenticated here.** Do not attempt production deploys under any circumstances.
- Real deploys happen through the pipeline (merge → GitHub Actions **delta** deploy). Local `sf project deploy start` to `ai-poc` is for your own testing only.
- If a command names no target org, do not run it — resolve the target explicitly to `ai-poc` first.

## Workflow

1. Read the Jira story by key over the Atlassian MCP before starting. Non-trivial stories: **propose a plan and get it approved before editing** (plan mode).
2. Work on a feature branch, never directly on `main`.
3. When grooming a story, produce parseable acceptance criteria and list the affected objects / Apex / LWC by reading the actual code — flag when something the story asks for already exists.
4. Open a PR against `main`. A human reviews and merges. The merge triggers the delta deploy — so a merged PR is a release to the dev org.
5. Docs: change-history drafts go to Confluence at release time via MCP; a human reviews before publish.

## Conventions

- LWC ↔ LWC communication for the listing/filter uses the Lightning Message Service channel `FiltersChange__c` (see `propertyFilter` publishing and the list subscribing). Follow that pattern rather than inventing new events.
- Apex list endpoints return the `PagedResult` wrapper for pagination (see `PropertyController`). Reuse it.
- Match the existing component and method style; prefer small, focused components.

## Testing expectations

- New or changed **Apex** needs a corresponding test class. The repo mixes two naming styles (`FileUtilitiesTest` and `TestPropertyController`) — match whichever the class you're touching already uses.
- New or changed **LWC** needs a Jest spec under the component's `__tests__` folder.
- Run `npm run test:unit` and the relevant Apex tests locally before opening a PR.

## Security musts

- Enforce CRUD/FLS in Apex (`WITH USER_MODE` / `Security.stripInaccessible`); never bypass sharing without a stated reason.
- Use bind variables in SOQL — never string-concatenate user input into queries.
- No hardcoded record IDs, credentials, or secrets. No `eval` or unescaped user input in LWC.
