@isTest
private class PropertyTriggerTest {
    private static Date getDateClosed(Id propertyId) {
        return [SELECT Date_Closed__c FROM Property__c WHERE Id = :propertyId]
        .Date_Closed__c;
    }

    @isTest
    static void closingSetsDateClosed() {
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Available')
            .insertRecord();

        Test.startTest();
        property.Status__c = 'Closed';
        update property;
        Test.stopTest();

        Assert.areEqual(Date.today(), getDateClosed(property.Id));
    }

    @isTest
    static void closingFromBlankStatusSetsDateClosed() {
        Property__c property = new PropertyTestDataBuilder().insertRecord();

        Test.startTest();
        property.Status__c = 'Closed';
        update property;
        Test.stopTest();

        Assert.areEqual(Date.today(), getDateClosed(property.Id));
    }

    @isTest
    static void insertAsClosedSetsDateClosed() {
        Test.startTest();
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Closed')
            .insertRecord();
        Test.stopTest();

        Assert.areEqual(Date.today(), getDateClosed(property.Id));
    }

    @isTest
    static void insertAsNonClosedLeavesDateBlank() {
        Test.startTest();
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Available')
            .insertRecord();
        Test.stopTest();

        Assert.isNull(getDateClosed(property.Id));
    }

    @isTest
    static void closingKeepsExistingDateClosed() {
        Date backdated = Date.today().addDays(-30);
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Under Agreement')
            .withDateClosed(backdated)
            .insertRecord();

        Test.startTest();
        property.Status__c = 'Closed';
        update property;
        Test.stopTest();

        Assert.areEqual(backdated, getDateClosed(property.Id));
    }

    @isTest
    static void closingWithBackdateInSameSaveKeepsIt() {
        Date backdated = Date.today().addDays(-10);
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Under Agreement')
            .insertRecord();

        Test.startTest();
        property.Status__c = 'Closed';
        property.Date_Closed__c = backdated;
        update property;
        Test.stopTest();

        Assert.areEqual(backdated, getDateClosed(property.Id));
    }

    @isTest
    static void insertAsClosedWithDateKeepsIt() {
        Date backdated = Date.today().addDays(-5);

        Test.startTest();
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Closed')
            .withDateClosed(backdated)
            .insertRecord();
        Test.stopTest();

        Assert.areEqual(backdated, getDateClosed(property.Id));
    }

    @isTest
    static void resavingClosedRecordLeavesDateUnchanged() {
        Date backdated = Date.today().addDays(-60);
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Closed')
            .withDateClosed(backdated)
            .insertRecord();

        Test.startTest();
        property.Name = 'Renamed Property';
        update property;
        Test.stopTest();

        Assert.areEqual(backdated, getDateClosed(property.Id));
    }

    @isTest
    static void resavingClosedRecordWithBlankDateStaysBlank() {
        Property__c property = new PropertyTestDataBuilder()
            .withStatus('Closed')
            .insertRecord();

        Test.startTest();
        property.Date_Closed__c = null;
        update property;
        Test.stopTest();

        Assert.isNull(getDateClosed(property.Id));
    }

    @isTest
    static void nonClosedStatusChangeLeavesDateUnchanged() {
        Date backdated = Date.today().addDays(-15);
        Property__c openProperty = new PropertyTestDataBuilder()
            .withStatus('Available')
            .build();
        Property__c closedProperty = new PropertyTestDataBuilder()
            .withStatus('Closed')
            .withDateClosed(backdated)
            .build();
        insert new List<Property__c>{ openProperty, closedProperty };

        Test.startTest();
        openProperty.Status__c = 'Under Agreement';
        closedProperty.Status__c = 'Available';
        update new List<Property__c>{ openProperty, closedProperty };
        Test.stopTest();

        Assert.isNull(getDateClosed(openProperty.Id));
        Assert.areEqual(backdated, getDateClosed(closedProperty.Id));
    }

    @isTest
    static void bulkCloseSetsDatesWithinLimits() {
        Date backdated = Date.today().addDays(-20);
        List<Property__c> properties = PropertyTestDataBuilder.insertList(
            200,
            'Available'
        );
        Set<Id> backdatedIds = new Set<Id>();
        for (Integer i = 0; i < properties.size(); i++) {
            properties[i].Status__c = 'Closed';
            if (Math.mod(i, 2) == 0) {
                properties[i].Date_Closed__c = backdated;
                backdatedIds.add(properties[i].Id);
            }
        }

        Test.startTest();
        update properties;
        Integer dmlStatements = Limits.getDmlStatements();
        Test.stopTest();

        Assert.areEqual(1, dmlStatements, 'Trigger should add no DML.');
        for (Property__c property : [
            SELECT Id, Date_Closed__c
            FROM Property__c
            WHERE Id IN :properties
        ]) {
            Date expected = backdatedIds.contains(property.Id)
                ? backdated
                : Date.today();
            Assert.areEqual(expected, property.Date_Closed__c);
        }
    }
}
