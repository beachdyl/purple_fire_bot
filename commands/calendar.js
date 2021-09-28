const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Get a handy link to our calendar!'),
	async execute(interaction) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#253d8e')
			.setTitle('Purple Fire Robotics Calendar')
			.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
			.setAuthor('Purple Fire Robotics', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			.setDescription('Our calendar always has the latest information on our events, meetings, and more!')
			.addField('Integration', 'You can add our calendar to your own Google account by clicking the "+ Google Calendar" button at the botom right of the calendar page.', true)
			.addField('Problem?', 'If you notice an error, just tell any Chairperson or E-Board member.', true)
			.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
			.setTimestamp();
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Link')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);
		await interaction.reply({ content: 'Pong!', ephemeral: false, embeds: [exampleEmbed], components: [row] });
	},
};

