# Demo runsheet — AI-augmented Salesforce delivery pipeline

Walking a client from a vague business request to a live Salesforce change, with Claude at every step and guardrails that make it safe. **Story used:** CRM-2 — "Automatically record when a property is sold."

---

## 0. Pre-flight (do before you present)

- [ ] **Delta deploy proven** — push a one-line change to a single class and confirm the Actions run deploys _only_ that component, not all 93.
- [ ] **`npm install` run** (optional) — so `npm run lint` / `test:unit` and the pre-commit hook work.
- [ ] **`argument-hint` quoted** in the four command files (`"[jira-story-key]"`), so nothing fails frontmatter validation.
- [ ] **Org-access hook installed and proven** — `org-guard.js` in `.claude\hooks\`, `settings.json` merged, and a blocked-command test passing (see §4).
- [ ] **Confluence baseline pages exist** — so `/document` has somewhere to land.
- [ ] **Jira tickets updated in place** to the new backlog; the stale grooming comment removed from CRM-2.
- [ ] **`gh auth login` done** (or plan the push-and-open-URL fallback for `/pr`).
- [ ] **Everything committed** — `.claude\` commands + skills, `CLAUDE.md`, `DOC_TEMPLATE.md`, workflow.
- [ ] **Repeatability decided** — CRM-2 can only be built once on `main`. Rehearse on CRM-2, then present on a fresh clone/branch, or plan to revert the merge between runs (see §6).
- [ ] **One full dry run** end to end before the real thing.

---

## 1. Set up your screen

Have these open and ready to switch between:

- **Claude Code** (terminal or IDE) — started _inside_ the repo folder.
- **VS Code** — repo open, so you can show `CLAUDE.md`, the `.claude` folder, and diffs.
- **GitHub** — two tabs: **Actions** and **Pull requests**.
- **Jira** — the CRM-2 story.
- **Confluence** — the space with the baseline pages.
- **Salesforce (`ai-poc`)** — a Property record open, plus the App Launcher.

---

## 2. Framing (say this up front, ~30 seconds)

> "This is one developer taking a business request from Jira all the way to live in Salesforce — with Claude helping at every step, and guardrails that keep it safe. Watch for three things: Claude reads our real code and Jira, not a generic template; it follows _our_ standards, not its own; and at the key moments a human decides and the tooling enforces."

Name the three layers as they appear:

- **Guidance** — `CLAUDE.md` (what the project is).
- **Procedures** — the `/commands` and skills (how we work).
- **Enforcement** — the org hook (what's deterministically blocked).

Scope, if asked: **in scope** = plan → build → deploy → document. **Deliberately out** = AI review in CI and AI test generation — named next steps, not gaps.

---

## 3. The walkthrough

### Stage 1 — The story (Jira)

**Do:** Show CRM-2 in Jira.
**Say:** "A business person wrote this. It's vague on purpose — no fields, no rules, just the ask."
**Beat:** Point at what's _missing_ — which status is 'sold'? what date? what if it's already set?

### Stage 2 — Groom it (`/groom CRM-2`)

**Do:** Run `/groom CRM-2` in Claude Code.
**Beat — the standout:** it reads the actual code and catches that the business said **"sold"** but the real picklist value is **"Closed"**. It also notices **no trigger exists yet**, sharpens the acceptance criteria, and raises genuine questions (only-if-empty? on insert too? revert behaviour? trigger vs Flow?).
**Say:** "A vague two-line story just became a precise, codebase-aware spec — and it caught a vocabulary mismatch a human might miss."

### Stage 3 — Human review + write back

**Do:** Skim the grooming. Answer the open questions out loud (e.g. "only stamp if empty; on insert and update; don't clear on revert; trigger, per our standards"). Then have Claude post the groomed criteria back onto CRM-2 via MCP.
**Beat:** Claude _writes_ to Jira, not just reads. The human made the decisions.

### Stage 4 — Plan it (`/plan CRM-2`)

**Do:** Run `/plan CRM-2`.
**Beat:** the plan proposes a **thin trigger → `PropertyTriggerHandler` → a domain/service rule**, not logic stuffed in the trigger. That's the Apex skills shaping the plan before a line is written.
**Say:** "It's planning to our architecture — one trigger per object, logic in the right layer — because those standards are skills in the repo."
Point at the **Assumptions** section — the decisions from Stage 3, restated for confirmation.

### Stage 5 — Approve (human gate)

**Do:** Approve the plan.
**Say:** "Cheapest place to correct course — a minute here saves a rewrite later."

### Stage 6 — Build

**Do:** Let Claude Code implement.
**Beat:** open the new files — the trigger is a one-liner that calls the handler; the real logic sits in the handler/domain class; there's a test. Show the thin trigger next to the handler.
**Say:** "First trigger in this repo, and it already follows our pattern — no one had to remember it."

### Stage 7 — Security review (`security-review` skill)

**Do:** Run `/security-review` — or let it auto-offer (it's a model-invoked skill).
**Beat:** it's read-only and _can't_ edit; the checks are Salesforce-specific (CRUD/FLS, injection, sharing).
**Say:** "This is the local flavour of AI review — a developer's self-check before the PR."

### Stage 8 — Open the PR (`/pr CRM-2`)

**Do:** Run `/pr CRM-2`.
**Beat:** it pushes the branch and opens a PR with a story-linked description. Show it in the GitHub PR tab.

### Stage 9 — Review + merge (human gate)

**Do:** Read the diff in GitHub, change model and run /review then merge.
**Say:** "A person still owns the merge. We deliberately left the automated AI reviewer out of CI for this phase — that's a known next step."

### Stage 10 — Deploy (delta, automatic)

**Do:** Switch to the Actions tab; watch the run trigger on merge.
**Beat — the payoff:** in the _Generate delta manifest_ step, the `package.xml` lists **only** the new trigger/handler/class — not the whole app. The pipeline deploys just the change.

### Stage 11 — See it live (Salesforce)

**Do:** Open a Property in `ai-poc`, set **Status = Closed**, save.
**Beat:** the **Date Closed** field populates automatically. The business ask, working.

### Stage 12 — Document (`/document CRM-2`)

**Do:** Run `/document CRM-2`.
**Beat:** it produces two things — a **dated change-history note** (append) _and_ the **living-reference edits** (edit in place), both in the two-layer _For everyone / For developers_ template. It stops for your review before publishing.
**Note:** CRM-2 has no existing owning page, so per the feature-to-page map rule it should **propose a new page** (e.g. "Property lifecycle") — a clean demonstration of the human deciding where docs live. (Or pre-create that page if you'd rather show an in-place edit.)
**Say:** "Append vs edit-in-place — that distinction is what keeps living docs from rotting. And a human reviews before it publishes."

---

## 4. Guardrail spotlight (slot in near Stage 6 or 10)

**Do:** Ask Claude Code to run each:

- `sf --version` → runs (harmless).
- `sf project deploy start --target-org ai-poc` → runs (the allowed org, named).
- `sf project deploy start` → **blocked** — "names no target… failing closed."
- `sf org open --target-org some-other-org` → **blocked** — "not permitted."

**Say:** "This is the difference between telling the agent 'only use our org' and it _not being able_ to do otherwise. The hook runs before the command — even if I explicitly ask for the wrong org, it refuses."
**Honest caveat if asked:** governs local Claude Code sessions; CI is scoped separately by its credential. Full 'can't-remove-it' needs enterprise managed settings — the checked-in config is the POC-scale version.

---

## 5. If something breaks

- **Terminal rejects pasted multi-line content** → it's PowerShell; create files in VS Code, not by pasting.
- **`/pr` fails** → `gh` isn't authed; fall back to letting Claude `git push` and open the compare URL it prints.
- **A push deploys nothing** ("No metadata changes") → correct for a doc/config/workflow-only commit; not a failure.
- **First delta run errors on `github.event.before`** → run one full-source deploy, then delta works.
- **Hook doesn't fire** → check `org-guard.js` is at `.claude\hooks\` and `settings.json` has the `hooks` block; test with `sf org open --target-org other`.
- **Grooming looks generic** → confirm the session started _inside_ the repo (so `CLAUDE.md` loads) and the MCP is connected (`/mcp`).

---

## 6. Reset / re-run

CRM-2's trigger lives on `main` once merged, so you can't cleanly re-demo the same story. To run again:

- **Revert:** revert the merge PR (which delta-deploys the removal), delete the feature branch, and reset CRM-2's status in Jira — or
- **Fresh story:** keep a second thin story in reserve and run the flow on that, or
- **Fresh clone:** present from a clean clone where CRM-2 hasn't been built.

Rehearse on CRM-2; present on whichever reset path you chose.
