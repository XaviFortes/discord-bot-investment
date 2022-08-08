const { SlashCommandBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell-investment')
		.setDescription('Sell investments to get money.')
        .addStringOption(option => option.setName('code').setDescription('The code of the investment').addChoices(
            { name: 'HugoCoin', value: 'HC'},
            { name: 'PipoCoin', value: 'PC'},
        ))        
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of investments to sell')),
	async execute(interaction) {
        // Send a POST request to the API to get the user's money amount and display it in chat with the reply function. 
        // The reply function is used to send a message to the channel the command was used in.
        const {
            statusCode,
            headers,
            trailers,
            body,
            bodyUsed

         } = await request('http://localhost:8280/api/discord/invest/sell', {
            method: 'POST',
            //path: '/api/discord/user',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: interaction.user.id,
                code: interaction.options.getString('code'),
                amount: interaction.options.getInteger('amount')

            }),
        })
        for await (const data of body) {
            console.log('data', data)
            // Parse the JSON data and return it.
            const parsedData = JSON.parse(data)
            const message = parsedData.message
            console.log(message);
            return interaction.reply(`${message}`);
        }
	},
};