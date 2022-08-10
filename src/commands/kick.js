const { SlashCommandBuilder } = require('discord.js');
const { parse } = require('path');
const { request } = require('undici');
const { ip } = require('../config.json');
// Use fs to create logs folder if it doesn't exist on the root of the project.
const fs = require('fs');
if (!fs.existsSync('./logs')) {
	fs.mkdirSync('./logs');
}
// Create a log file for the command if it doesn't exist.
const logFile = fs.createWriteStream('./logs/kick.log', { flags: 'a' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them from vc.')
		.addUserOption(option => option.setName('target').setDescription('The member to kick')),
	async execute(interaction) {
		const {
            statusCode,
            headers,
            trailers,
            body,
            bodyUsed

         } = await request(`http://${ip}:8280/api/discord/kick`, {
            method: 'POST',
            //path: '/api/discord/user',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: interaction.user.id
            }),
        })
        for await (const data of body) {
            console.log('data', data)
            // Parse the JSON data and return it.
            const parsedData = JSON.parse(data)
			console.log(parsedData);
            const message = parsedData.message
			console.log(message);
			if (message === 'ok') {
				const member = interaction.options.getMember('target');
				member.voice.disconnect();
				// Log the kicked user to a file.
				// add timestamp to the log file.
				logFile.write(`${new Date()} - ${interaction.user.username} kicked ${member.user.username} from ${interaction.channel.name}\n`);

				return interaction.reply(`${member.user.username}#${member.user.discriminator} has been kicked from the voice channel.`);

				//return interaction.reply({ content: 'Successfully kicked member.', ephemeral: true });
			}
            return interaction.reply(`${message}`);
        }
		//return interaction.reply({ content: `You wanted to kick: ${member} ${member.user} ${member.user.username}`, ephemeral: true });
	},
};