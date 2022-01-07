const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes paused song'),
	async execute(interaction) {
		if (!global.botConnection) return interaction.reply('No song is plaused');

        if (interaction.client.player.state.status === 'paused') {
			interaction.client.player.unpause();
			interaction.reply('Resumed: ' + interaction.client.queue[0].title)
		};
	},
};