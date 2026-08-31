---
name: apex-enterprise-patterns
description: Apply Salesforce separation-of-concerns when writing Apex — Selector classes for all SOQL, Domain classes for record behaviour and validation, Service classes for business operations, with DML centralised. Use when adding queries, business logic, or services, or refactoring Apex that mixes these concerns.
---

# Apex enterprise patterns (separation of concerns)

Business logic is split into layers, each with one responsibility. Never mix SOQL, record rules, and orchestration in the same class.

## The layers

- **Selector — all SOQL.** A `<Object>Selector` (or plural, e.g. `PropertiesSelector`) owns every query for that object. Methods return records (`selectById`, `selectByStatus`, …). Enforce field-level security (`WITH USER_MODE`). No SOQL exists anywhere else — not in controllers, services, or triggers.
- **Domain — record behaviour.** A domain class (plural class name, e.g. `Properties`) encapsulates validation, defaulting, and record-level rules for an SObject, operating on a **list** of records. It's invoked from the trigger handler and by services. No cross-object business process here.
- **Service — business operations.** A `<Feature>Service` / `<Object>Service` holds coarse-grained, bulkified business operations and transaction orchestration. It's the entry point for controllers, batch jobs, and other callers. It calls selectors to read and coordinates domain logic and DML to write.
- **DML — centralised.** Commit through a Unit of Work (or a single controlled service method), ordered and committed once. Do not scatter `insert` / `update` / `delete` across classes.

## Rules

- `@AuraEnabled` controller methods and LWC-facing code call **Service** methods — never raw SOQL or DML.
- Everything is **bulkified**: methods take and return collections, never assume one record.
- Respect CRUD/FLS at the boundary (ties in with the security-review skill).
- Keep layers **mockable** so unit tests stub selectors/services instead of hitting the database.

## Naming (default convention)

| Layer           | Class name                                          |
| --------------- | --------------------------------------------------- |
| Selector        | `<Object>Selector` / `<PluralObject>Selector`       |
| Domain          | `<PluralObject>` (or `<Object>Domain`)              |
| Service         | `<Object>Service` / `<Feature>Service`              |
| Trigger handler | `<Object>TriggerHandler` (see apex-trigger-handler) |

## No framework dependency

Implement these layers with **plain Apex classes** — no external pattern library. Do not introduce fflib or any other enterprise-patterns framework. The separation and naming above are the standard; they need no base classes to inherit from. Centralise DML in a small hand-rolled unit-of-work or a single service method rather than a library.

## Brownfield note

This governs new and refactored Apex. Existing classes that query or do DML directly (e.g. a controller with inline SOQL) can be migrated to this structure incrementally, not all at once.
