const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays music')
        .addStringOption(option => 
            option.setName('query')
            .setDescription('Link or name of a youtube video')
            .setRequired(true)
        ),
	async execute(interaction) {
        let query = interaction.options.getString('query');
        let title;

        if (!query.startsWith('http')) {
            const search = await ytSearch(query);
            const videos = search.videos;
            
            if (search.videos.length < 1) return interaction.followUp('No video results found');
            
            const titles = videos.map((el,i) => `${i + 1}) ${el.title}`).join('\n');
            query = await new Promise((resolve, reject) => {
                interaction.reply(`Choose a song\n\n${titles}`).then(() => {
                    interaction.channel.awaitMessages({ filter: null, time: 60000, max: 1, errors: ['time'] })
                    .then(messages => {
                        const content = messages.first().content;
                        let i = Number(content) - 1;
    
                        messages.first().delete();// delete answer to 'Choose song'
                        interaction.deleteReply();// delete 'Choose song' prompt
    
                        if (i !== 0 && !i && (Number(content[0]) || Number(content[1]))) {
                            i = Number(content[0]) || Number(content[1]) - 1;// if the user responds with 1) or 1. or .1
                            interaction.followUp('You need to write a single digid from 1 to 20');
                        }
                        
                        if ((i !== 0 && !i) || (i < 0 || i > 19)) {
                            return interaction.followUp('You need to write a single digid from 1 to 20');
                        };
                        title = videos[i].title;
                        resolve(videos[i].url);
                    })
                    .catch(null);
                })
            });
        } else {
            title = await ytdl.getInfo(query).then(info => info.title);
        }
        
        const queue = interaction.client.queue;
        queue.push({
            url: query,
            title
        });
        
        if (queue.length > 1) {
            return interaction.followUp('Added to the queue: ' + title);
        };

        interaction.followUp(queue[0].url);
        
        const voiceChannel = interaction.member.voice;
        const player = createAudioPlayer();

        interaction.client.player = player;

        let stream = ytdl(query, { filter: 'audioonly' });
        let resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
        
        player.play(resource);


        const connection = joinVoiceChannel({
            channelId: voiceChannel.channelId,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            queue.shift();
            if (queue.length === 0) return connection.destroy();

            stream = ytdl(queue[0].url, { filter: 'audioonly' });
            resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

            player.play(resource);

            interaction.followUp(queue[0].url);
        })
        .on('error', () => interaction.followUp('There was a problem while playing this song. Please choose another!'));
        global.botConnection = connection;
	},
};