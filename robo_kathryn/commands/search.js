const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search for a specific meeting.')
		.addStringOption(option =>
			option.setName('meeting')
				.setDescription('The string you want to search meeting titles for')
				.setRequired(true)),

	async execute(interaction) {
		const events = [];
		const searchString = interaction.options.getString('meeting');
		const embed = new MessageEmbed();
		await new Promise((resolve) => {
			fs.createReadStream('google/events.csv')
				.pipe(csv({ headers: false }))
				.on('data', (data) => events.push(data))
				.on('end', () => setTimeout(resolve, 1));
		});

		for (event of events) {
			if (event[2].search(`/${searchString}/gm`) == -1) continue;
			embed.setColor(`${event[7]}`)
				//.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
				.setTitle(event[2])
				.setDescription(`${event[5]} - ${event[6]}`);
			if (event[1]) {
				embed.setAuthor(event[1], 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			} else {
				embed.setAuthor('Purple Fire Robotics', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
			}
			if (event[4]) {
				embed.addField('Location', event[4], true);
			}
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Open the Calendar')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);

		if (event.embed) await interaction.reply({ ephemeral: false, embeds: embed, components: [row] });
		else await interaction.reply({ ephemeral: true, content: `No results found for: ${searchString}`, components: [row] });
	}
}