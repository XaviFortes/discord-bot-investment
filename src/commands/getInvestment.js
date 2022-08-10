const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { parse } = require('path');
const { request } = require('undici');
const { ip } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-investment')
		.setDescription('See investments price.'),
	async execute(interaction) {
        // Send a POST request to the API to get the user's money amount and display it in chat with the reply function. 
        // The reply function is used to send a message to the channel the command was used in.
        const {
            statusCode,
            headers,
            trailers,
            body,
            bodyUsed

         } = await request(`http://${ip}:8280/api/invest/see`, {
            method: 'POST',
            //path: '/api/discord/user',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: interaction.user.id,
            }),
        })
        for await (const data of body) {
            console.log('data', data)
            // Parse the JSON data and return it.
            const parsedData = JSON.parse(data)
            // Parse all the investments and display them in chat.
            // const investments = parsedData.investments

            let investmentsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('All Investments')
            //.setDescription('Choose wisely.')
            ;            

            for (let i = 0; i < parsedData.length; i++) {
                const investment = parsedData[i];

                investmentsEmbed.addFields({name: `${investment.name} *${investment.code}*`, value: `${investment.price}$`})
            }
            //console.log(message);
            return interaction.reply({ embeds: [investmentsEmbed] });

            // let message = ''
            // for (let i = 0; i < parsedData.length; i++) {
            //     const investment = parsedData[i];
            //     
            //     message += `Name: ${investment.name} | Code: ${investment.code} | Price: ${investment.price}\n`
            // }
            // console.log(message);
            // return interaction.reply(`${message}`);
            // //const message = parsedData.message
            // console.log(message);
            // return interaction.reply(`${message}`);
        }
	},
};