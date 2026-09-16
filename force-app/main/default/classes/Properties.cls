public with sharing class Properties {
    public static final String STATUS_CLOSED = 'Closed';

    /**
     * Stamps Date_Closed__c with today's date (running user's time zone) when a
     * property is inserted as Closed or its status changes to Closed, unless a
     * date is already present. Intended for before-save contexts, so no DML.
     *
     * @param records records being saved (Trigger.new)
     * @param oldMap  prior versions (Trigger.oldMap); null on insert
     */
    public static void setDateClosedOnClose(
        List<Property__c> records,
        Map<Id, Property__c> oldMap
    ) {
        Date today = Date.today();
        for (Property__c property : records) {
            if (
                property.Status__c != STATUS_CLOSED ||
                property.Date_Closed__c != null
            ) {
                continue;
            }
            Boolean isNewlyClosed =
                oldMap == null ||
                oldMap.get(property.Id).Status__c != STATUS_CLOSED;
            if (isNewlyClosed) {
                property.Date_Closed__c = today;
            }
        }
    }
}
