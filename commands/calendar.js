const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');
const events = [];
const event_embeds = [];


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
			if (event[0] === 'cancelled') continue;
			const _embed = new MessageEmbed()
				.setColor(`${event[7]}`)
				.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
				.setTitle(event[2])
				.setDescription(`${event[5]} - ${event[6]}`);
			if (event[1]) {
				_embed.addField('Section', event[1], true);
			}
			if (event[4]) {
				_embed.addField('Location', event[4], true);
			}
			if (event[3]) {
				_embed.addField('Description', event[3]);
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

