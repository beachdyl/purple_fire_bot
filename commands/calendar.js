const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');
const events = [];
const event_embeds = [];


/* for (let i = 0; i < 5; i++) {
	const embed = new MessageEmbed()
		.setColor('#532d8e')
		.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png');
	console.log(events);
	//embed.setTitle(events.at(i).at(1));
	//embed.addField('Description', events.at(i).at(2));
	embeds.push(embed);
} */

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Get a list of upcoming meetings and events!'),
	async execute(interaction) {
		await new Promise((resolve) => {
			fs.createReadStream('google/events.csv')
				.pipe(csv({ headers: false }))
				.on('data', (data) => events.push(data))
				.on('end', () => setTimeout(resolve, 1));
		});

		for (event of events) {
			const _embed = new MessageEmbed()
				.setColor('#532d8e')
				.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
				.setTitle(event[1])
				.setDescription(`${event[4]} - ${event[5]}`)
				.addField('Location', event[3]);
			if (event[2]) {
				_embed.addField('Description', event[2]);
			}
			event_embeds.push(_embed);
		}
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Open')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);
		await interaction.reply({ephemeral: false, embeds: event_embeds, components: [row] });
	},
};

