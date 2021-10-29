const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the robot, and re-caches events and commands.')
		.setDefaultPermission(false),
	async execute(interaction) {
		exec('xxxxx')
		//purposefully crash the bot by sending 2 messages, which then triggers a script to update the bot and restart it
		await interaction.reply({ content: 'Restarting now! Hopefully, I\'ll be back soon.\n**o7**' });
		await interaction.reply({ content: '', components: [row] });
	},
};