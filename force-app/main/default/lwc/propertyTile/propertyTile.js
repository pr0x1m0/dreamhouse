import { LightningElement, api } from 'lwc';
import FORM_FACTOR from '@salesforce/client/formFactor';
import { NavigationMixin } from 'lightning/navigation';

const ACTIVE_STATUS = 'Available';

export default class PropertyTile extends NavigationMixin(LightningElement) {
    @api property;
    formFactor = FORM_FACTOR;

    handlePropertySelected() {
        if (FORM_FACTOR === 'Small') {
            // In Phones, navigate to property record page directly
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.property.Id,
                    objectApiName: 'Property__c',
                    actionName: 'view'
                }
            });
        } else {
            // In other devices, send message to other cmps on the page
            const selectedEvent = new CustomEvent('selected', {
                detail: this.property.Id
            });
            this.dispatchEvent(selectedEvent);
        }
    }

    get backgroundImageStyle() {
        return `background-image:url(${this.property.Thumbnail__c})`;
    }

    get daysOnMarketText() {
        if (
            this.property.Status__c !== ACTIVE_STATUS ||
            !this.property.Date_Listed__c
        ) {
            return undefined;
        }
        return `Listed ${this.property.Days_On_Market__c} days ago`;
    }
}
