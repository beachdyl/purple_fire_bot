const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('greeting')
		.setDescription('May I introduce myself?'),
	async execute(interaction) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#532d8e')
			.setTitle('Hey there, I\'m Robo-Kathryn!')
			.setAuthor('Purple Fire Robotics', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			.setDescription('I am here to help out with a few of the simple tasks around here. I\'m still learning, so please, have some patience.')
			.addField('Developer', 'This bot is being developed by @beachdyl#0609', true)
			.addField('Problem?', 'Did I make a mistake? No worries, just tell @beachdyl#0609.', true)
			.addField('Similarity', 'Robo-Kathryn is a work of fiction. Any similarity to actual persons, living or dead, is purely coincidental.', false)
			.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
			.setTimestamp();
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Open the Calendar')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);
		await interaction.reply({ephemeral: false, embeds: [exampleEmbed], components: [] });
	},
};

