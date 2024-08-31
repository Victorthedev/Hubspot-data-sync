const fs = require('fs');
const { parse } = require('json2csv');
const fetchDataFromHubSpot = require('./hubspotService');

const saveToCSV = async () => {
    try {
        const data = await fetchDataFromHubSpot();

        if (data.length === 0) {
            console.log('No data to save');
            return;;
        }

        const csv = parse(data);

        fs.writeFileSync('hubspot.csv', csv);

        console.log('Data has been saved to hubspot.csv');
    } catch (error) {
        console.error('Error converting data to CSV:', error);
    }
};

module.exports = saveToCSV;
