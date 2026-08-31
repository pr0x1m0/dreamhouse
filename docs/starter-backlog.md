# Starter backlog — dreamhouse pipeline demo

Stories against the dreamhouse app. **DH-1 is the thin, business-written grooming target** — and now also the trigger showcase. **DH-2 to DH-4 are build-oriented**, with notes on what already exists in the codebase (discovered during grooming), so the real remaining scope is clear.

---

## DH-1 · Automatically record when a property is sold

_(thin — grooming + trigger demo · this is **CRM-2** in Jira)_

**Type:** Story
**Description (written as a business user would):**
When one of our properties is sold, we want the system to record the date it happened, on its own. Right now brokers are meant to type the sold date in themselves and they keep forgetting, so our reporting on how long deals take is unreliable. It should just fill in the sold date automatically when a property is marked as sold.

_(No acceptance criteria on purpose — this is the story `/groom` sharpens.)_

**Why this story:** it's small and instantly demonstrable, and it's the **trigger showcase**. No triggers exist in the repo yet, so building it exercises the `apex-trigger-handler` and `apex-enterprise-patterns` skills from scratch — a thin trigger delegating to `PropertyTriggerHandler`, with the "stamp the sold date" rule in a domain/service class. Grooming should also catch that the business says "sold" while the real `Status__c` value is **Closed**.

---

## DH-2 · Add "Days on Market" to the property tile

_(build-ready · code-only)_

**Type:** Story
**Description:**
As a broker, I want each property tile in the search results to show how many days it has been listed, so I can spot stale listings at a glance.

**Already exists — do not rebuild:** `Property__c.Days_On_Market__c` (formula) and the `daysOnMarket` LWC already exist, and the component is already placed on the Property record page and the Property Finder. The gap is the **search-results grid**.

**Remaining scope:** add `Days_On_Market__c` (and `Date_Listed__c`) to the `PropertyController.getPagedPropertyList` SOQL, surface the existing `daysOnMarket` component on `propertyTile`, and cover it with tests. No new metadata — code-only.

---

## DH-3 · Filter properties by minimum number of bedrooms

_(verify — may already be implemented)_

**Type:** Story
**Description:**
As a buyer, I want to filter the listings by a minimum number of bedrooms, so I only see properties big enough for me.

**Note:** `propertyFilter` already tracks `minBedrooms` with a change handler, so this may already work end to end. Treat as **verify / complete / add tests** rather than a from-scratch build — or swap it for a fresh small story if you want a clean build to demo.

---

## DH-4 · Show a broker's active listing count on the broker card

_(build-ready)_

**Type:** Story
**Description:**
As a user viewing a broker, I want to see how many active listings they have, so I can gauge how active they are.

**Acceptance criteria:**

- The broker card/detail shows a count of properties linked to that broker.
- The count reflects only available listings, not Closed ones.
- A broker with no listings shows `0`, not blank.

---

### Suggested order to run them

1. **Groom DH-1 (CRM-2)** — the grooming + trigger demo. Watch `/groom` catch the "sold" vs "Closed" gap; then `/plan` → build exercises the Apex skills on the first trigger in the repo.
2. **Build DH-2** — wires an existing component into the tile and extends one SOQL query; code-only, exercises the delta deploy.
3. **DH-3** — verify/complete the bedroom filter, or swap for a fresh small story.
4. **DH-4** — repeat the loop to show it's repeatable.
