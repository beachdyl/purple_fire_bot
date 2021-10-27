// Require the necessary files and modules
const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// Define error types
const type_table = {
	1: 'Logged in',
	2: 'Prior to login',
	3: 'From file',
};

//errHandle function
let errHandle = function(error, type, client) {
	let typetext = '';

	// Login to Discord using the secret token
	client.login(token);

	//Log error in console and files
	console.error(error);
	fs.writeFileSync('./error.txt',`${type_table[type]}\n${error}`);

	if (type === 2) fs.writeFileSync('./errorTemp.txt',`${type_table[type]}\n${error}`);
	if (type === 3) fs.unlinkSync('./errorTemp.txt');

	const errorEmbed = new MessageEmbed()
		.setColor('#ff0000')
		.setTitle('I have handled an error!')
		.setAuthor('Robo-Kathryn', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
		.setDescription('Something went wrong, and I am here to tell you about it. I managed to recover, but at what cost?')
		.addField('Error', `${error}`, false)
		.addField('Error Type', `${type_table[type]}`, true)
		.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
		.setTimestamp();

	if (type !== 2) client.channels.cache.get('770464638881497089').send({embeds: [errorEmbed] });

};

module.exports = errHandle;