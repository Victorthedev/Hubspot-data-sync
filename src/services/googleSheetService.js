const { google } = require('googleapis');
const fetchDataFromHubSpot = require('./hubspotService');

const saveToGoogleSheet = async (accessToken) => {
    const authClient = new google.auth.OAuth2();
    authClient.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const createSpreadsheet = async () => {
        const request = {
            properties: {
                title: 'HubSpot Data'
            },
            sheets: [
                {
                    properties: {
                        title: 'Sheet1'
                    }
                }
            ]
        };

        try {
            const response = await sheets.spreadsheets.create({ resource: request });
            const spreadsheetId = response.data.spreadsheetId;
            console.log(`Spreadsheet created with ID: ${spreadsheetId}`);
            return spreadsheetId;
        } catch (error) {
            console.error('Error creating spreadsheet:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const spreadsheetId = await createSpreadsheet();
    const range = 'Sheet1!A1';

    try {
        const data = await fetchDataFromHubSpot();
        console.log('Data fetched from HubSpot:', data);

        if (data.length === 0) {
            console.log('No data to save');
            return;
        }

        const headers = Array.from(new Set(data.flatMap(item => Object.keys(item.properties))));
        const values = data.map(item =>
            headers.map(header => item.properties[header] || '')
        );

        values.unshift(headers);
        await appendValuesToSheet(authClient, spreadsheetId, range, values);
    } catch (error) {
        console.error('Error saving to Google Sheet:', error.response ? error.response.data : error.message);
    }
};

const appendValuesToSheet = async (authClient, spreadsheetId, range, values) => {
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: { values },
        });
        console.log('Data successfully saved to Google Sheet');
    } catch (error) {
        console.error('Error appending data to Google Sheet:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = saveToGoogleSheet;
