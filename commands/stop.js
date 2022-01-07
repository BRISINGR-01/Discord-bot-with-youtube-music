const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stops the music'),
	async execute(interaction) {
		if (!global.botConnection) return interaction.reply('No song is playing');

		interaction.client.queue = [];
		global.botConnection.destroy();
		interaction.reply('Bye!');
	},
};