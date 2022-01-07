const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const { StreamType, createAudioResource } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips current song'),
	async execute(interaction) {
		if (!global.botConnection) return interaction.reply('No song is playing')

        const player = interaction.client.player;
        const queue = interaction.client.queue;

        const skipped = queue.shift();
        if (queue.length === 0) {
            player.stop();
            interaction.client.queue = [];
            global.botConnection.destroy();
            return interaction.reply('Skipped: ' + skipped.title)
        };

        let stream = ytdl(queue[0].url, { filter: 'audioonly' });
        let resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        
        player.play(resource);
        return interaction.reply('Skipped: ' + skipped.title);
	},
};