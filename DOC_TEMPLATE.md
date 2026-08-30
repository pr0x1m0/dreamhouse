# Documentation template

Every documentation page follows this two-layer structure: **business context first, technical detail second.** One page, two audiences — a plain-language top a business user can read, and a technical section below for whoever will change it. Never blur the two into one undifferentiated block.

## [Page title]

### For everyone

Plain language, no jargon. Cover:

- **What it is / does** — one or two sentences a non-technical reader understands.
- **Why it matters / who uses it** — the business value and the audience.
- **What you can see or do** — the user-facing behaviour.

Keep object names, class names, and code references _out_ of this section. If a business user couldn't follow a sentence, it belongs below.

### For developers

Technical detail for someone who will change this. Cover, as applicable:

- **Data model** — objects and fields involved.
- **Components** — the LWC / Apex and their roles.
- **Logic & data flow** — how it actually works, key methods, message channels.
- **Notes & gotchas** — edge cases, constraints, things to watch.

Name real components and fields. This is the layer engineers own.

---

## Update rules

- **Change history** (append-only): a short, dated note of what changed, drafted from the merged PR / story. Safe to auto-append at release.
- **Living reference** (edit in place): revise the affected parts of _both_ layers — the "For everyone" behaviour and the matching "For developers" detail — so the page stays true. Do **not** just append to a living-reference page; find and edit the lines that are now wrong. An append-only bot makes the page longer and eventually incorrect.
- When a change alters behaviour, update the business layer in plain language **and** the technical layer with specifics.
- A human reviews every living-reference edit before it publishes.
