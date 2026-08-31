---
name: apex-trigger-handler
description: Scaffold or modify Apex triggers using the one-trigger-per-object handler pattern — a thin trigger that delegates all logic to a dedicated handler class. Use when creating or editing an Apex trigger, or adding trigger-based behaviour to an SObject.
---

# Apex trigger handler pattern

Triggers must be thin. All logic lives in a handler class, never in the trigger body.

## Rules

- **One trigger per SObject**, named `<Object>Trigger`, covering all relevant events in a single trigger (`before insert, before update, before delete, after insert, after update, after delete, after undelete`). Never create multiple triggers on the same object.
- **The trigger body contains no logic** — it instantiates the handler and dispatches the current context to it. Nothing else.
- **The handler** is `<Object>TriggerHandler`, with a method per context (`onBeforeInsert`, `onAfterUpdate`, …) or a single `run()` dispatcher. The handler orchestrates; it does not itself hold SOQL or complex rules.
- **Delegate downward:** record validation and defaulting go to the Domain layer; cross-object and business logic goes to the Service layer (see the apex-enterprise-patterns skill). The handler wires context to those, it doesn't reimplement them.
- **Bulkify:** always operate on `Trigger.new` / `Trigger.old` collections and maps — never assume a single record.
- **Guard recursion** where a handler can re-enter (e.g. a static flag), and keep the guard in the handler, not the trigger.

## Skeleton

```apex
// <Object>Trigger.trigger — no logic here
trigger AccountTrigger on Account(
    before insert,
    before update,
    before delete,
    after insert,
    after update,
    after delete,
    after undelete
) {
    new AccountTriggerHandler().run();
}
```

```apex
// <Object>TriggerHandler.cls — dispatch + orchestration only
public with sharing class AccountTriggerHandler {
    public void run() {
        switch on Trigger.operationType {
            when BEFORE_INSERT {
                onBeforeInsert(Trigger.new);
            }
            when AFTER_UPDATE {
                onAfterUpdate(Trigger.new, (Map<Id, Account>) Trigger.oldMap);
            }
            // …other contexts
        }
    }
    // each method delegates to Domain/Service — no SOQL/DML here
}
```

Keep triggers logic-free so behaviour is unit-testable at the handler and domain level rather than only through DML.
