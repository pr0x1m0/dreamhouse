---
name: security-review
description: Review Salesforce code changes for security risks — CRUD/FLS enforcement, SOQL/SOSL injection, sharing model, hardcoded secrets/IDs, and unsafe client-side rendering. Use when reviewing a branch, diff, or pull request before merge, or whenever asked to security-check Apex or LWC. Read-only for reports findings, never edits.
argument-hint: '[optional: branch, path, or PR to review]'
allowed-tools: Read, Grep, Glob, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(git branch:*), Bash(git merge-base:*)
---

# Salesforce security review

Perform a security review of code changes for this Salesforce project. **This is review-only — do not edit, fix, or deploy anything. Report findings only.**

Scope: $ARGUMENTS

If no scope is given, review the changes on the current branch against `main` (e.g. `git diff main...HEAD`). Read the full files around each change for context where needed — a vulnerability often depends on code outside the diff.

Check for these Salesforce-specific risks:

- **CRUD / FLS enforcement** — Apex that reads or writes data without object- and field-level checks. Look for SOQL/DML not running in user mode (`WITH USER_MODE` / `WITH SECURITY_ENFORCED`), or results not passed through `Security.stripInaccessible`. `@AuraEnabled` methods matter most — they're reachable from the client.
- **SOQL / SOSL injection** — dynamic queries built by concatenating user-controllable input. Require bind variables or `String.escapeSingleQuotes`.
- **Sharing** — classes touching records without a declared sharing model (`with sharing` / `inherited sharing`), or `without sharing` used without a stated reason.
- **Hardcoded secrets / IDs** — credentials, tokens, or record IDs baked into code.
- **LWC / client** — unescaped user input rendered to the DOM, `lwc:dom="manual"` / `innerHTML` misuse, or secrets exposed client-side.
- **Test gaps** — security-relevant paths (permission checks, negative cases) with no test coverage.

Report findings grouped by severity — **High / Medium / Low** — and for each give: the file and line, the specific problem, why it's a risk, and the concrete fix. If a change is clean, say so plainly rather than inventing issues. End with a one-line verdict: safe to merge, or changes needed.
