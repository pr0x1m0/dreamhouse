# Salesforce MCP spotlight (live org data → instant visuals)

## Demo A — Properties on a status-coded map

**Prompt:**

> Using the Salesforce MCP, query `Property__c` where `City__c = 'Boston'` and return Name, `Address__c`, `Status__c`, `Price__c`, `Beds__c`, `Baths__c`, `Location__Latitude__s`, `Location__Longitude__s` and `Broker__r.Name`.
>
> Then build me an interactive map as an Artifact: one pin per property positioned by lat/long, colour-coded by `Status__c` (Pre Market / Available / Under Agreement / Contracted / Closed), with a legend and clickable status filters. Clicking a pin shows address, price, beds/baths and broker. Show the record count and median price for whatever is currently filtered.
>
> Draw the map yourself as inline SVG — do not load map tiles or any external image, they are blocked in Artifacts.

## Demo B — Broker cards

**Prompt:**

> Using the Salesforce MCP, query all `Broker__c` records — Name, `Title__c`, `Phone__c`, `Mobile_Phone__c`, `Email__c`, `Picture__c` — plus, for each, the count of related `Property__c` records and their total list price.
>
> Build an Artifact showing each broker as a card: photo, name, title, contact details, and their portfolio stats. Sortable by listing count and portfolio value.
>
> The photo URLs are external and Artifacts block external images — download each one and embed it as a base64 data URI in the page.

## Demo C — the full listing dashboard

**Prompt:**

> Using the Salesforce MCP, query all `Property__c` records with Name, `Address__c`, `City__c`, `Status__c`, `Price__c`, `Beds__c`, `Baths__c`, `Location__Latitude__s`, `Location__Longitude__s`, and `Broker__r.Name`.
>
> Build me a dashboard as an Artifact: KPI tiles for listing count, total portfolio value and median price; a map plotting each property by lat/long with pins coloured by `Status__c`; a bar chart of the pipeline stages; and a broker table with listing count and book value. Clicking a status filters the whole page.
>
> Draw the map as inline SVG — external map tiles and images are blocked in Artifacts.

## Demo D — data quality scorecard

**Prompt:**

> Using the Salesforce MCP, audit `Property__c` and `Broker__c` for completeness — which records are missing photos, descriptions, geolocation, broker, price or list date? Show me a visual scorecard by field, worst first.

## Demo # - Digital Catalog (Victorian)

**Promt:**

> Build a buyer-facing HTML brochure as a downloadable file (not a published artifact, so the Picture__c photos load). Use only verified field values — no invented marketing copy, and drop any field that looks wrong rather than printing it. Include the broker's contact block, and a particulars disclaimer. Flag what's missing before it's client-ready.
