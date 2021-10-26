const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crash')
		.setDescription('Forces the robot to crash. Please do not use this unless you know what you\'re doing.')
		.setDefaultPermission(false),
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
		);
		const fullPermissions = [
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
		await permissions.add({ fullPermissions });
		//purposefully crash the bot by sending 2 messages, which triggers a bash script to update the bot and restart it
		await interaction.reply({ content: 'Crashing now! Hopefully, I\'ll be back soon.\n**o7**' });
		await interaction.reply({ content: '', components: [row] });
	},
};