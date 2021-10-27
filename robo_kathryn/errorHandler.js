// Require the necessary files and modules
const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

//errHandle function
var errHandle = function(error, client) {
	// Create a new client instance
	const { Client, Collection, Intents } = require('discord.js');
	const client2 = new Client({ intents: [Intents.FLAGS.GUILDS] });

	//Log error in console and files
	console.error(error);
	fs.writeFileSync('./error.txt',`${error}`);

	const errorEmbed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle('I have handled an error!')
			.setAuthor('Robo-Kathryn', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			.setDescription('Something went wrong, and I am here to tell you about it. I managed to recover, but at what cost?')
			.addField('Error', `${error}`, false)
			.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
			.setTimestamp();
	client2.channels.cache.get('770464638881497089').send({embeds: [errorEmbed] });

};

module.exports = errHandle;