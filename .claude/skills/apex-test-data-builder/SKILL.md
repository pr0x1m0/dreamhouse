---
name: apex-test-data-builder
description: Construct Apex test records through a fluent per-object builder class instead of hand-rolled record literals inline in test methods. Use when writing or updating an Apex test class (@isTest) that needs Property__c, Broker__c, or other SObject test data.
---

# Apex test-data builder pattern

Test classes get their SObject records from a per-object builder, not by re-typing `new Property__c(...)` field-by-field in every test method.

## Rules

- **One builder per SObject**: `<Object>TestDataBuilder` (e.g. `PropertyTestDataBuilder`, `BrokerTestDataBuilder`).
- **Annotate the builder `@isTest`** — it's test-support code, not production logic, and doesn't need code coverage.
- **Sensible defaults**: the builder's constructor seeds every required/commonly-asserted field with a valid default, so a test only overrides what it actually cares about.
- **Fluent setters**: each field gets a `with<Field>(value)` method that mutates and returns `this`, so calls chain: `new PropertyTestDataBuilder().withStatus('Closed').withPrice(500000)`.
- **Two terminal methods**: `.build()` returns the uncommitted SObject (for assembling several records or relationships before one bulk DML); `.insertRecord()` inserts it and returns it, for the common single-record case.
- **Bulk creation stays in the builder**: a static helper (e.g. `PropertyTestDataBuilder.insertList(Integer count)`) returns a list of inserted records — don't hand-roll a second `for` loop of literals next to the builder.
- **No external framework** — plain Apex classes, same as `apex-enterprise-patterns`' "no fflib" rule. The pattern needs no base class to inherit from.

## Skeleton

```apex
@isTest
public class PropertyTestDataBuilder {
    private Property__c record = new Property__c(
        Name = 'Test Property',
        Price__c = 100000,
        Beds__c = 3,
        Baths__c = 2
    );

    public PropertyTestDataBuilder withName(String name) {
        record.Name = name;
        return this;
    }

    public PropertyTestDataBuilder withStatus(String status) {
        record.Status__c = status;
        return this;
    }

    public PropertyTestDataBuilder withPrice(Decimal price) {
        record.Price__c = price;
        return this;
    }

    public Property__c build() {
        return record;
    }

    public Property__c insertRecord() {
        insert record;
        return record;
    }
}
```

Usage in a test:

```apex
Property__c closedProperty = new PropertyTestDataBuilder()
    .withStatus('Closed')
    .insertRecord();
```

## When to introduce or extend a builder

- Writing a new Apex test, or adding new test records to an existing one, for an object that already has a builder: use it instead of an inline literal.
- Writing the first test that needs records for an object with **no builder yet**: create `<Object>TestDataBuilder` with defaults covering that test's needs — add more `with<Field>` methods later, as tests need them, rather than pre-building every field up front.
- Touching a test method that already works with inline literals: leave it as-is. Migrating existing passing tests to the builder is not required just because the file was opened — that's scope creep beyond the story at hand.

## Brownfield note

No builder classes exist yet for `Property__c` or `Broker__c` — every current test (`TestPropertyController`, `FileUtilitiesTest`) constructs records inline. The first new Apex test class that needs `Property__c` test data should introduce `PropertyTestDataBuilder` rather than repeating the inline style; existing tests keep working unchanged and migrate opportunistically, not all at once.
