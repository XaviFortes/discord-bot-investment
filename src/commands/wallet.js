const { SlashCommandBuilder } = require('discord.js');
const { parse } = require('path');
const { request } = require('undici');
const { ip } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wallet')
		.setDescription('See your investments.'),
	async execute(interaction) {
        // Send a POST request to the API to get the user's money amount and display it in chat with the reply function. 
        // The reply function is used to send a message to the channel the command was used in.
        const {
            statusCode,
            headers,
            trailers,
            body,
            bodyUsed

         } = await request(`http://${ip}:8280/api/discord/wallet`, {
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
            console.log('data', data);
            // Parse the JSON data and return it.
            const parsedData = JSON.parse(data);
            const pData = parsedData.investments;
            // Parse all the investments and display them in chat.
            // const investments = parsedData.investments
            let message = '';
            //message = parsedData;
            for (let i = 0; i < pData.length; i++) {
                const investment = pData[i];
                
                message += `Code: ${investment.code}\t |\t Amount: ${investment.amount}\n`
            }
            console.log(message);
            return interaction.reply({ content: `${message}`, ephemeral: true });
            //const message = parsedData.message
            console.log(message);
            return interaction.reply(`${message}`);
        }
	},
};