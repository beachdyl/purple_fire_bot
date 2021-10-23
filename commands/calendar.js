const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const csv = require('csv-parser');
const fs = require('fs');
const events = [];
const embeds = [];
//const embed = [];


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
			.on('end', () => {
				//for (let i = 0; i < 1; i++) {
					let embed = new MessageEmbed()
						.setColor('#532d8e')
						//.setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
						//console.log(events.at(i)[2]);
						.setTitle(events.at(0)[1])
						.setDescription('No more')
						.addField('Description2', '${events.at(i)[2])} ');
					//embed.push(embed);
				}
			//});
			);
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Open')
					.setURL('https://calendar.google.com/calendar/embed?src=5r67hb19jke4qk7jkeftov91f8%40group.calendar.google.com&ctz=America%2FNew_York')
					.setStyle('LINK'),
			);
		await interaction.reply({ephemeral: false, embeds: [embed], components: [row] });
	},
};

