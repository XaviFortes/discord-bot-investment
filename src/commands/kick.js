const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them from vc.')
		.addUserOption(option => option.setName('target').setDescription('The member to kick')),
	async execute(interaction) {
		const {
            statusCode,
            body

         } = await request(`http://${ip}:8280/api/discord/kick`, {
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
            const message = parsedData.message
			if (message === 'ok') {
				const member = interaction.options.getMember('target');
				member.voice.disconnect();
				return interaction.reply({ content: 'Successfully kicked member.', ephemeral: true });
			}
            return interaction.reply(`${message}`);
        }
		//return interaction.reply({ content: `You wanted to kick: ${member} ${member.user} ${member.user.username}`, ephemeral: true });
	},
};