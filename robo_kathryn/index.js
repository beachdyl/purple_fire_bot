// Require the necessary files and modules
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Intents } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const errHandle = require ('./errorHandler.js')

// Try deleting old errorTemp.txt if it exists
try {fs.unlinkSync('./errorTemp.txt');}
catch (error) {}

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
	errHandle(error, 1, client);
}
//console.log(client.commands);

// Process slash command interactions
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	if (interaction.commandName === 'restart') client.user.setPresence({status: 'idle'});

	try {
		await command.execute(interaction);
	} catch (error) {
		errHandle(`${interaction.commandName}\n${error}`, 1, client);
		await interaction.reply({ content: 'There was an error while executing this command! Please alert a Dylan.', ephemeral: true });
	}
});

// Process button interactions
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
});

// Set the bot to online status once it is ready and report ready
client.on('ready', () => {
	client.user.setPresence({status: 'online'});
	const readyEmbed = new MessageEmbed()
	.setColor('#00ff00')
	.setTitle('Ready to rock and roll!')
	.setAuthor('Robo-Kathryn', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
	.setDescription('I was asleep, but I am no longer asleep! To make a long story short, ~~I put a whole bag of jellybeans~~ good morning!')
	.setTimestamp();
	client.channels.cache.get('770464638881497089').send({embeds: [readyEmbed] });
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

// Check for unhandled errors on each interaction
client.on('interactionCreate', interaction => {
	if (fs.exists('./errorTemp.txt')) errHandle(fs.readFileSync('./errorTemp.txt'), 3, client);
});

//client.commands.get('restart').add({ command: client.commands.get('restart'), permissions: restartPermissions });

// Login to Discord using the secret token
client.login(token);