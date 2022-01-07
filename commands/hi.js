const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hi')
		.setDescription('Says Hi'),
	async execute(interaction) {
		let greetings = ['Sup bitches', 'Hey!', 'Hi 😀', 'Wassup', '😜'];
		interaction.reply(greetings[Math.floor(Math.random() * greetings.length)]);
	},
};