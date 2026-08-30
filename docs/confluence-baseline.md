# Confluence baseline — dreamhouse (initial state)

The "living reference" pages describing how the app works **today**, before the pipeline starts generating change history. Each `## Page:` block is one Confluence page and follows the two-layer template (`DOC_TEMPLATE.md`): **For everyone** first, **For developers** below. The final section is the feature-to-page map the release-time doc job needs.

These describe _current_ behaviour on purpose — so the first real story (CRM-2) produces a visible before/after: an automated change-history note, plus a human edit to the living-reference page it affects.

---

## Page: Dreamhouse — project overview

### For everyone

Dreamhouse is a real-estate app: brokers manage property listings, and buyers browse and filter them to find a home. It's the reference project for our AI-augmented delivery pipeline — the app we use to show stories flowing from idea to live change.

### For developers

Runs on the `ai-poc` Developer org. Core objects: `Property__c` (listings) and `Broker__c` (agents), linked by a `Broker__c` lookup on the property. App pages: Property Explorer (browse + filter + map), Property Finder (buyer selection flow), Property / Broker record pages, and Settings. Delivery pipeline: stories in Jira → build in Claude Code → GitHub Actions delta-deploy on merge to `main` → docs drafted in Confluence. (For the pipeline itself, see the kickoff page.)

---

## Page: Property browsing & search

### For everyone

Buyers see a grid of property cards next to a map. A filter panel narrows the list by search text, maximum price, minimum bedrooms, and minimum bathrooms. Selecting a property shows a summary of it beside the grid. Each card shows the city, name, beds and baths, and price.

### For developers

**Components:** `propertyTileList` / `propertyTile` (the grid and each card), `propertyFilter` (the filter panel), `propertyListMap` / `propertyMap` / `propertyLocation` (the map), `paginator` (page navigation).
**Data:** `PropertyController.getPagedPropertyList` runs a single paged SOQL query and returns a `PagedResult` (records + page info); `PropertyController.getPictures` supplies images. The grid re-renders per page with no extra round trip.
**Communication:** two Lightning message channels — `FiltersChange` (filter → list) and `PropertySelected` (tile → summary).

---

## Page: Days on Market

> This page will be updated by CRM-2 — a good example of a living-reference page a human owns.

### For everyone

Shows how long a property has been on the market, so buyers and brokers can tell a fresh listing from a stale one. Today it appears on a property's detail view, and when a buyer selects a property in the finder — but **not** on the search-results cards a buyer scans before clicking in.

### For developers

**Data:** `Property__c.Days_On_Market__c` — a formula field, `TODAY() - Date_Listed__c`, with blank listing dates treated as zero.
**Component:** the `daysOnMarket` LWC renders a colour-coded badge with a bar, in three tiers: normal (under 30 days), warning (30–59), alert (60+); the bar caps its scale at 90 days.
**Where it's surfaced:** the Property record page sidebar (visible when `Days_On_Market__c > 0`) and the Property Finder page beside the summary (via `PropertySelected`). It is **not** on the `propertyTile` grid — the gap CRM-2 addresses.

---

## Page: Brokers

### For everyone

Brokers are the agents who list properties. Each has contact details and a photo, and you can see the properties they represent.

### For developers

**Data:** `Broker__c` holds title, phone, mobile, email, picture, and a broker id; properties link via the `Broker__c` lookup.
**Components:** `brokerCard` displays a broker's details; the Broker record page presents the broker and their linked properties.

---

## Page: Feature-to-page map

_(A routing table, not a feature page — exempt from the two-layer structure.)_

Which Confluence page owns which part of the app. The release-time doc job uses this to route a change's documentation to the right place; keep it current as features are added.

| Feature / module                    | Owning page                   | Owner           |
| ----------------------------------- | ----------------------------- | --------------- |
| Property objects & data model       | Dreamhouse — project overview | You / tech lead |
| Browse, filter, map, paging         | Property browsing & search    | You / tech lead |
| Days-on-market field & display      | Days on Market                | You / tech lead |
| Broker object & display             | Brokers                       | You / tech lead |
| Delivery pipeline & ways of working | Kickoff page                  | You / tech lead |

---

### How the two doc types work against these pages

- **Change history** (automatable): at release, the pipeline drafts a "what changed" note from the merged PRs/stories and appends it — e.g. CRM-2 → _"Days-on-market now shown on search-result cards."_
- **Living reference** (human-owned): the body of a page like _Days on Market_ is edited in place — after CRM-2 ships, a human updates both layers' "where it's surfaced" wording to include the grid. This is why living-reference pages need an owner, not an append-only bot.
