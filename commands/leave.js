const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Make me leave'),
	async execute(interaction) {
		if (global.botConnection) global.botConnection.destroy();

		interaction.reply('Bye!');
	},
};