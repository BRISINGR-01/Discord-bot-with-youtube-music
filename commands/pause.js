const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses current song'),
	async execute(interaction) {
		if (!global.botConnection) return interaction.reply('No song is playing');

        if (interaction.client.player.state.status === 'playing') {
			interaction.client.player.pause();
			interaction.reply('Paused: ' + interaction.client.queue[0].title);
		};
	},
};