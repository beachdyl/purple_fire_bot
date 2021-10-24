const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'google/events.csv',
    header: [
        { id: 'status' },
		{ id: 'section' },
        { id: 'title' },
        { id: 'description' },
        { id: 'location' },
        { id: 'start' },
        { id: 'end' },
		{ id: 'color' },
        { id: 'transparency' },
        { id: 'id' },
    ],
	append: true
});

const color_table = {
	'VEX U': '#fff908',
	'Combat': '#f50101',
	'250 Pound': '#f50101',
	'Research & Development': '#f501ed',
	'R&D': '#f501ed',
	'Events': '#f58e01',
	'Outreach': '#01eaf5',
	'Fundraising': '#2ff501',
	'General': '#532d8e',
	'Workshops': '#f58e01',
	'Leadership': '#2c2c2c'
};

// If modifying scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.events.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'google/token.json';

// Load client secrets from a local file.
fs.readFile('google/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the events on the calendar.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: '5r67hb19jke4qk7jkeftov91f8@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 40,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
		try {fs.unlinkSync('google/events.csv');}
		catch (error) {}
		console.log('Old file deleted or didn\'t exist.');
		
		events.map((event, i) => {
			const start =
				event.start.dateTime.slice(5,7) + '/' +
				event.start.dateTime.slice(8,10) + ' ' +
				event.start.dateTime.slice(11,13) + ':' +
				event.start.dateTime.slice(14,16);
			const end = 
				event.end.dateTime.slice(5,7) + '/' +
				event.end.dateTime.slice(8,10) + ' ' +
				event.end.dateTime.slice(11,13) + ':' +
				event.end.dateTime.slice(14,16);
			
			const title = event.summary.slice(event.summary.indexOf(":")+2);
			const section = event.summary.slice(0,event.summary.indexOf(":"));
			if (section === 'R&D') { section = 'Research & Development' };
			
			const data = [{
				status: event.status,
				section: section,
				title: title,
				description: event.description,
				location: event.location,
				start: start,
				end: end,
				color: color_table[section],
				transparency: event.transparency,
				id: event.id
			}];	
			csvWriter.writeRecords(data);
			console.log(`Event "${event.summary}" written to file.`);
		});
    } else {
      console.log('No upcoming events found.');
    }
  });
}