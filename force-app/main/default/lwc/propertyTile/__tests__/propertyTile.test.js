import { createElement } from '@lwc/engine-dom';
import PropertyTile from 'c/propertyTile';

const PROPERTY = {
    Name: 'My House',
    City__c: 'Some City',
    Beds__c: '3',
    Baths__c: '1',
    Price__c: '450000',
    Thumbnail__c: 'some-property.jpg',
    Id: '12345'
};

const DAYS_ON_MARKET_SELECTOR = '.days-on-market';

describe('c-property-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty.
    // Used when having to wait for asynchronous DOM updates.
    async function flushPromises() {
        return Promise.resolve();
    }

    it('displays a property in the tile', () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });
        element.property = PROPERTY;
        document.body.appendChild(element);

        const headerEl = element.shadowRoot.querySelector('.truncate');
        expect(headerEl.textContent).toBe(
            `${PROPERTY.City__c} • ${PROPERTY.Name}`
        );

        const paragraphEl = element.shadowRoot.querySelector('p');
        expect(paragraphEl.textContent).toBe(
            `Beds: ${PROPERTY.Beds__c} - Baths: ${PROPERTY.Baths__c}`
        );

        const priceEl = element.shadowRoot.querySelector(
            'lightning-formatted-number'
        );
        expect(priceEl.value).toBe(PROPERTY.Price__c);
    });

    it('displays the correct background image in the tile', () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });
        element.property = PROPERTY;
        document.body.appendChild(element);

        const backgroundEl = element.shadowRoot.querySelector('.tile');
        expect(backgroundEl.style.backgroundImage).toBe(
            `url(${PROPERTY.Thumbnail__c})`
        );
    });

    it('Fires the property selected event on click for non Small formFactors', async () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });
        element.property = PROPERTY;
        document.body.appendChild(element);

        // Mock handler for child event
        const handler = jest.fn();
        element.addEventListener('selected', handler);

        const anchorEl = element.shadowRoot.querySelector('a');
        anchorEl.click();

        // Wait for any asynchronous DOM updates
        await flushPromises();

        // Validate if event got fired
        expect(handler).toHaveBeenCalled();
        const selectEvent = handler.mock.calls[0][0];
        expect(selectEvent.detail).toBe(PROPERTY.Id);
    });

    it('is accessible', async () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });

        element.property = PROPERTY;
        document.body.appendChild(element);

        await expect(element).toBeAccessible();
    });

    it('shows days on market for an active, listed property', () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });
        element.property = {
            ...PROPERTY,
            Status__c: 'Available',
            Date_Listed__c: '2026-08-19',
            Days_On_Market__c: 12
        };
        document.body.appendChild(element);

        const daysOnMarketEl = element.shadowRoot.querySelector(
            DAYS_ON_MARKET_SELECTOR
        );
        expect(daysOnMarketEl.textContent).toBe('Listed 12 days ago');
    });

    it('shows 0 days on market for a property listed today', () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });
        element.property = {
            ...PROPERTY,
            Status__c: 'Available',
            Date_Listed__c: '2026-08-31',
            Days_On_Market__c: 0
        };
        document.body.appendChild(element);

        const daysOnMarketEl = element.shadowRoot.querySelector(
            DAYS_ON_MARKET_SELECTOR
        );
        expect(daysOnMarketEl.textContent).toBe('Listed 0 days ago');
    });

    it('hides days on market when Date_Listed__c is blank', () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });
        element.property = {
            ...PROPERTY,
            Status__c: 'Available',
            Date_Listed__c: null,
            Days_On_Market__c: 0
        };
        document.body.appendChild(element);

        const daysOnMarketEl = element.shadowRoot.querySelector(
            DAYS_ON_MARKET_SELECTOR
        );
        expect(daysOnMarketEl).toBeNull();
    });

    it('hides days on market when the property is not active', () => {
        const element = createElement('c-property-tile', {
            is: PropertyTile
        });
        element.property = {
            ...PROPERTY,
            Status__c: 'Closed',
            Date_Listed__c: '2026-08-19',
            Days_On_Market__c: 12
        };
        document.body.appendChild(element);

        const daysOnMarketEl = element.shadowRoot.querySelector(
            DAYS_ON_MARKET_SELECTOR
        );
        expect(daysOnMarketEl).toBeNull();
    });
});
