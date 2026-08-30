# Starter backlog — dreamhouse pipeline demo

Four stories against the dreamhouse app. **DH-1 is deliberately thin** — it's the target for the grooming demo (watch Claude turn it into a sharp, buildable story). **DH-2 to DH-4 are ready to build** — they go straight through plan → build → PR → deploy.

---

## DH-1 · Surface how long a property has been listed

**Type:** Story
**Description:**
Buyers and brokers want a sense of how long a property has been on the market. Show this somewhere useful in the app.

_(No acceptance criteria on purpose — this is the story Claude grooms into shape.)_

---

## DH-2 · Add "Days on Market" to the property tile

**Type:** Story
**Description:**
As a broker, I want each property tile to show how many days it has been listed, so I can spot stale listings at a glance.

**Acceptance criteria:**

- Each property tile in the listing view shows a "Days on Market" value.
- The value is today's date minus the property's listing date.
- A property listed today shows `0` (or "New").
- A property with no listing date shows `—` rather than a blank or negative number.

**Implementation note:** if Property has no listing-date field, add a `Listing_Date__c` (Date) field as part of the story — that new field deploying through the pipeline is part of what we're demonstrating.

---

## DH-3 · Filter properties by minimum number of bedrooms

**Type:** Story
**Description:**
As a buyer, I want to filter the listings by a minimum number of bedrooms, so I only see properties big enough for me.

**Acceptance criteria:**

- The property filter includes a control to set a minimum number of bedrooms.
- Results update to show only properties with at least that many bedrooms.
- Clearing the control (or setting it to 0) shows all properties again.
- The bedroom filter works in combination with the existing filters, not instead of them.

**Implementation note:** extends the existing property filter component and the Apex query behind the list.

---

## DH-4 · Show a broker's active listing count on the broker card

**Type:** Story
**Description:**
As a user viewing a broker, I want to see how many active listings they have, so I can gauge how active they are.

**Acceptance criteria:**

- The broker card/detail shows a count of properties linked to that broker.
- If a status field exists, the count reflects only available listings, not sold ones.
- A broker with no listings shows `0`, not blank.

---

### Suggested order to run them

1. **Groom DH-1** — the grooming demo. Claude reads it over MCP, drafts acceptance criteria, lists affected objects/Apex/LWC, raises open questions.
2. **Build DH-2** — best first build: it creates a new field _and_ touches a component, so it exercises the full deploy path (metadata + code) end to end.
3. **Build DH-3, DH-4** — repeat the loop to show it's repeatable.
