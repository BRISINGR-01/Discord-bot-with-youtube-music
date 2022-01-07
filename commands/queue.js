const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Shows the current music queue'),
	async execute(interaction) {
		interaction.reply(interaction.client.queue.map(el => el.title).join('\n') || 'Queue is empty');
	},
};