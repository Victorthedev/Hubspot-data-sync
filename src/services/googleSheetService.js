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
            sheets: []
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

    try {
        const allData = await fetchDataFromHubSpot();
        console.log('Data fetched from HubSpot:', allData);

        if (Object.keys(allData).length === 0) {
            console.log('No data to save');
            return;
        }

        for (const [objectType, data] of Object.entries(allData)) {
            if (data.length === 0) {
                console.log(`No data for ${objectType}, skipping...`);
                continue;
            }

            const headers = Array.from(new Set(data.flatMap(item => Object.keys(item.properties))));
            const values = data.map(item =>
                headers.map(header => item.properties[header] || '')
            );

            values.unshift(headers);

            const sheetTitle = capitalizeFirstLetter(objectType); 
            const range = `${sheetTitle}!A1`;

            await addSheet(sheets, spreadsheetId, sheetTitle);

            await appendValuesToSheet(sheets, authClient, spreadsheetId, range, values);
        }

        console.log('All data successfully saved to Google Sheets');
    } catch (error) {
        console.error('Error saving to Google Sheet:', error.response ? error.response.data : error.message);
    }
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const addSheet = async (sheets, spreadsheetId, sheetTitle) => {
    try {
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            resource: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: sheetTitle
                            }
                        }
                    }
                ]
            }
        });
        console.log(`Sheet "${sheetTitle}" created`);
    } catch (error) {
        console.error(`Error creating sheet "${sheetTitle}":`, error.response ? error.response.data : error.message);
        throw error;
    }
};

const appendValuesToSheet = async (sheets, authClient, spreadsheetId, range, values) => {
    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: { values },
        });
        console.log(`Data successfully saved to sheet: ${range}`);
    } catch (error) {
        console.error('Error appending data to Google Sheet:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = saveToGoogleSheet;
