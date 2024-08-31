const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const hubspotAccessToken = process.env.HUBSPOT_API_KEY;

const endpointConfig = {
    companies: 'https://api.hubapi.com/crm/v3/objects/companies',
    contacts: 'https://api.hubapi.com/crm/v3/objects/contacts',
    deals: 'https://api.hubapi.com/crm/v3/objects/deals',
    quotes: 'https://api.hubapi.com/crm/v3/objects/quotes',
    invoices: 'https://api.hubapi.com/crm/v3/objects/invoices',
    commerce_payments: 'https://api.hubapi.com/crm/v3/objects/commerce_payments',
    users: 'https://api.hubapi.com/crm/v3/objects/users',
    order: 'https://api.hubapi.com/crm/v3/objects/order',
    line_items: 'https://api.hubapi.com/crm/v3/objects/line_items',
    carts: 'https://api.hubapi.com/crm/v3/objects/carts',
    goal_targets: 'https://api.hubapi.com/crm/v3/objects/goal_targets',
    owners: 'https://api.hubapi.com/crm/v3/owners',
};

const fetchDataFromHubSpot = async () => {
    try {
        let results = [];

        for (const [endpoint, url] of Object.entries(endpointConfig)) {
            let hasMore = true;
            let after = undefined;

            while (hasMore) {
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${hubspotAccessToken}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        after: after
                    }
                });

                results = results.concat(response.data.results || []);
                hasMore = response.data.paging && response.data.paging.next;
                after = hasMore ? response.data.paging.next.after : undefined;
            }
        }

        return results.map(item => ({
            properties: item.properties || {}
        }));
    } catch (error) {
        console.error('Error fetching data from HubSpot:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = fetchDataFromHubSpot;
