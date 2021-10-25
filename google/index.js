// Load required files and packages
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Establish tables for use later
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
	'Open Lab Hours': '#532d8e',
	'Workshops': '#f58e01',
	'Leadership': '#2c2c2c'
};

// Set scopes for Google API
// If modifying these scopes, delete file token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.events.readonly'];
const TOKEN_PATH = 'google/token.json';

// Load credentials from a credentials.json
fs.readFile('google/credentials.json', (err, content) => {
	if (err) return console.log('Error loading client secret file:', err);
	// If unsuccessful, execute an authorization with Google API
	authorize(JSON.parse(content), listEvents);
});

// Create a new authorization with the Google API
function authorize(credentials, callback) {
	const {client_secret, client_id, redirect_uris} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	// Check if token already exists
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}

// Get a new access token via the Google API
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
			// Store the token in a file
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}

// List the events on the calendar and save them to a csv
function listEvents(auth) {
	const calendar = google.calendar({version: 'v3', auth});
	calendar.events.list({
		// Specify which calendar you want to access, or use 'primary'
		calendarId: '5r67hb19jke4qk7jkeftov91f8@group.calendar.google.com',
		timeMin: (new Date()).toISOString(), // Only events that have not already started
		maxResults: 100,
		singleEvents: true, // Do not process recurrences differently
		orderBy: 'startTime',
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const events = res.data.items;
		if (events.length) {
			// Try deleting old events.csv if it exists
			try {fs.unlinkSync('google/events.csv');}
			catch (error) {}
			console.log('Old file deleted or didn\'t exist.');
		
			events.map((event, i) => {
				// Format start and end times
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
				// Extract event title and hosting section from calendar event
				const title = event.summary.slice(event.summary.indexOf(":")+2);
				let section = event.summary.slice(0,event.summary.indexOf(":"));
				// Refine sections for unique cases
				if (section === 'R&D') { section = 'Research & Development' };
				if (section === 'General' && title.slice(0,8) === 'Open Lab') { section = 'Open Lab Hours' };

				// Setup single record for event with data
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
				// Write data to file
				csvWriter.writeRecords(data);
				console.log(`Event "${event.summary}" written to file.`);
			});
		} else {
			console.log('No upcoming events found.');
		}
	});
}