// Require the necessary files and modules
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Register commands from commands directory
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

try {
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		client.commands.set(command.data.name, command);
	}
} catch (error) {
	console.error(error);
	fs.writeFileSync('./error.txt',`${error}`);
}
console.log(client.commands);

// Process slash command interactions
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	if (interaction.commandName === 'restart') client.user.setPresence({status: 'idle'});

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		fs.writeFile('./error.txt',`${error}`);
		await interaction.reply({ content: 'There was an error while executing this command! Please alert a Dylan.', ephemeral: true });
	}
});

// Process button interactions
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
});

// Set the bot to online status once it is ready
client.on('ready', () => {
	client.user.setPresence({status: 'online'});
});

// Register events from events directory
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Set and add command permissions
const restartPermissions = [
	{
		id: '581128269584138250',
		type: 'USER',
		permission: true,
	},
	{
		id: '200316185445793792',
		type: 'USER',
		permission: true,
	},
];

//client.commands.get('restart').add({ command: client.commands.get('restart'), permissions: restartPermissions });

// Login to Discord using the secret token
client.login(token);