const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');
let events = [];
//const embeds = [];
let title = '';
let desc = 'yes';
let _embed;

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
		fs.createReadStream('google/events.csv')
			.pipe(csv({headers: false}))
			.on('data', (data) => events.push(data))
		await new Promise((resolve) => {setTimeout(resolve, 300)});
		let _embed = new MessageEmbed()
					.setColor('#532d8e')
					// .setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
					.setTitle(events[0][1])
					.setDescription(events[0][1])
					.addField('Description2', '${events.at(i)[2])} ');
		console.log(events.at(0));
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Open')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);
		await interaction.reply({ephemeral: false, embeds: [_embed], components: [row] });
	},
};

