const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Client } = require('discord.js');
const { parse } = require('path');
const { request } = require('undici');
const { ip } = require('../config.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get Info about commands.'),
	async execute(interaction) {
        let embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Help')
        .addFields({name: 'money', value: 'Display your current money.'})
        .addFields({name: 'top', value: 'Get the top richest on the server.'})
        .addFields({name: 'get-investment', value: 'See the investments and price.'})
        .addFields({name: 'buy-investment', value: 'Buys the investment you put and the amount you desire.'})
        .addFields({name: 'sell-investment', value: 'Sells the investment you put and the amount you desire.'})
        .addFields({name: 'kick', value: 'Kicks the user you put from the VC.'});
        return interaction.reply({ embeds: [embed] });
    },
};