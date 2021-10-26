const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the robot and recaches events and commands.')
		.setDefaultPermission(true),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
		//purposefully crash the bot by sending 2 messages, which then triggers a script to update the bot and restart it
		await interaction.reply({ content: 'Crashing now! Hopefully, I\'ll be back soon.\n**o7**' });
		await interaction.reply({ content: '', components: [row] });
	},
};