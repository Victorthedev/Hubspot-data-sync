## HubSpot Data Sync Service

This application is designed to fetch data from HubSpot and save it both as a CSV file and in a Google Sheet. It provides an Express.js server with an endpoint to trigger the synchronization process.

# Features

**Fetch Data from HubSpot:** Retrieves data from various HubSpot endpoints (e.g., companies, contacts, deals, etc.).

**Save Data as CSV:** Converts the fetched data into CSV format and saves it locally.

**Save Data to Google Sheets:** Stores the data in a newly created Google Sheet using the Google Sheets API.

# Prerequisites

Before you start, ensure you have the following installed on your system:
`Node.js (v12.x or later)`
`npm (v6.x or later)`
`A Google account to access Google Sheets`
`HubSpot API access with a valid access token`

# Getting Started

**1. Clone the Repository**
`git clone https://github.com/your-username/hubspot-data-sync.git`
`cd hubspot-data-sync`

**2. Install Dependencies**
`npm install`

**3. Set Up Environment Variables**

Create a `.env` file in the root directory of your project and add the following environment variables:
`PORT=3000`
`HUBSPOT_API_KEY=your-hubspot-api-key`

Replace `your-hubspot-api-key` with your actual HubSpot API key.

**4. Obtaining Google OAuth 2.0 Access Token**

To save data to Google Sheets, you'll need to obtain an OAuth 2.0 access token. You can do this using the Google OAuth 2.0 Playground:
**Open Google OAuth 2.0 Playground:* Go to Google OAuth 2.0 Playground. 

**Select Google Sheets API:* Under "Step 1 Select & authorize APIs", select `https://www.googleapis.com/auth/spreadsheets`.

**Exchange Authorization Code for Tokens:* Click on the "Authorize APIs" button, then select your Google account.
Click on "Exchange authorization code for tokens" in Step 2.

**Copy the Access Token:* In Step 3, you'll see an access token under the "Access token" section. Copy this token.

**5. Start the Server**

`node app.js`
This will start the server on the port specified in the `.env` file (default is 3000)

# Using the API

Endpoint: `/sync`
Method: POST

This endpoint triggers the data synchronization process. The access token for Google Sheets API must be passed in the request body.

**Request**

`{ "accessToken": "your-google-oauth2-access-token" }`

Replace `your-google-oauth2-access-token` with the access token you obtained from the Google OAuth 2.0 Playground.

**Response**

`{ "message": "Data saved as CSV and on Google Sheets" }`

# Code Structure

`app.js`: The main entry point of the application. Sets up the Express server and defines the /sync route.

`hubspotService.js`: Handles the logic for fetching data from HubSpot.

`saveToCSV.js`: Converts the fetched data into CSV format and saves it locally.

`googleSheetService.js`: Handles the logic for saving data to a Google Sheet using the Google Sheets API.

# Error Handling

The application logs errors to the console for debugging purposes. If an error occurs during the data sync process, a 500 status code is returned with an appropriate error message.


