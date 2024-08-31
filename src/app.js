require('dotenv').config();
const express = require('express');
const saveToCSV = require('./services/saveToCSV');
const saveToGoogleSheet = require('./services/googleSheetService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/sync', async (req, res) => {
    try {
        const accessToken = req.body.accessToken; 
        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }
        await saveToCSV();
        await saveToGoogleSheet(accessToken); 
        res.json({ message: 'Data saved as CSV and on Google Sheets' });
    } catch (error) {
        console.error('Error during data sync:', error);
        res.status(500).json({ error: 'Failed to sync data from HubSpot' });
    }
});

app.listen(port, () => {
    console.log(`${port} is now live`);
});
