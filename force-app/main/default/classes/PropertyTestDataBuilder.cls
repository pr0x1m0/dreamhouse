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

    public PropertyTestDataBuilder withDateClosed(Date dateClosed) {
        record.Date_Closed__c = dateClosed;
        return this;
    }

    public Property__c build() {
        return record;
    }

    public Property__c insertRecord() {
        insert record;
        return record;
    }

    public static List<Property__c> insertList(Integer count, String status) {
        List<Property__c> properties = new List<Property__c>();
        for (Integer i = 0; i < count; i++) {
            properties.add(
                new PropertyTestDataBuilder()
                    .withName('Test Property ' + i)
                    .withStatus(status)
                    .build()
            );
        }
        insert properties;
        return properties;
    }
}
