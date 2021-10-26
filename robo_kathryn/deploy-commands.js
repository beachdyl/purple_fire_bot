// Require the necessary files and modules
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const errHandle = require ('./errorHandler.js')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Read from commands files
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Register commands
try {
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
} catch (error) {
	errHandle(error, client);
}

const rest = new REST({ version: '9' }).setToken(token);

// Deploy commands to server
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		errHandle(error, client);
	}
})();