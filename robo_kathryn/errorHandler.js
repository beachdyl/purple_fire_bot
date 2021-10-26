// Require the necessary files and modules
const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    //errHandle function
	data: function errHandle(error) {
        console.error(error);
        fs.writeFileSync('./error.txt',`${error}`);
        const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('I have handled an error!')
                .setAuthor('Robo-Kathryn', 'https://i.ibb.co/cDrSdS5/PF-Flame.png', 'https://purplefire.org')
                .setDescription('Something went wrong, and I am here to tell you about it. I managed to recover, but at what cost?')
                .addField('Error', `${error}`, false)
                .setThumbnail('https://i.ibb.co/cDrSdS5/PF-Flame.png')
                .setTimestamp();
        client.channels.cache.get('770464638881497089').send({embeds: [errorEmbed] });
        client.channels.cache.get('770464638881497089').send('error');
    }
}