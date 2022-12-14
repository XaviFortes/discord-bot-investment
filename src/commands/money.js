const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');
const { ip } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('money')
		.setDescription('Display your current money.'),
	async execute(interaction) {
        // Send a POST request to the API to get the user's money amount and display it in chat with the reply function. 
        // The reply function is used to send a message to the channel the command was used in.
        const {
            statusCode,
            headers,
            trailers,
            body,
            bodyUsed

         } = await request(`http://${ip}:8280/api/discord/user`, {
            method: 'POST',
            //path: '/api/discord/user',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: interaction.user.id,
                username: interaction.user.username
            }),
        })
        for await (const data of body) {
            console.log('data', data)
            // Parse the JSON data and return it.
            const parsedData = JSON.parse(data)
            const money = parsedData.money
            return interaction.reply(`Your current money is: ${money.toFixed(2)}`);
        }
	},
};