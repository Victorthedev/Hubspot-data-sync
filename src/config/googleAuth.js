const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { google } = require('googleapis');
const credentials = require('./credential.json');

const TOKEN_PATH = path.join(__dirname, 'token.json');

function authorize() {
    return new Promise((resolve, reject) => {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) {
                return getNewToken(oAuth2Client, resolve, reject);
            }
            oAuth2Client.setCredentials(JSON.parse(token));
            resolve(oAuth2Client);
        });
    });
}

function getNewToken(oAuth2Client, resolve, reject) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                return reject(err);
            }
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                console.log('Token stored to', TOKEN_PATH);
            });
            resolve(oAuth2Client);
        });
    });
}

function storeToken(token) {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
            console.error('Error storing the token:', err);
        } else {
            console.log('Token stored to', TOKEN_PATH);
        }
    });
}

module.exports = {
    authorize,
    storeToken
};
