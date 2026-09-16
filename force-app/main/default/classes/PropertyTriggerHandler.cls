public with sharing class PropertyTriggerHandler {
    // Before-save field assignments only, so no re-entry and no recursion guard.
    public void run() {
        switch on Trigger.operationType {
            when BEFORE_INSERT {
                onBeforeInsert((List<Property__c>) Trigger.new);
            }
            when BEFORE_UPDATE {
                onBeforeUpdate(
                    (List<Property__c>) Trigger.new,
                    (Map<Id, Property__c>) Trigger.oldMap
                );
            }
        }
    }

    private void onBeforeInsert(List<Property__c> newRecords) {
        Properties.setDateClosedOnClose(newRecords, null);
    }

    private void onBeforeUpdate(
        List<Property__c> newRecords,
        Map<Id, Property__c> oldMap
    ) {
        Properties.setDateClosedOnClose(newRecords, oldMap);
    }
}
