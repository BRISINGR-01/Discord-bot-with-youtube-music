const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client({ intents: [
    Discord.Intents.FLAGS.GUILDS, 
    Discord.Intents.FLAGS.GUILD_MESSAGES, 
    Discord.Intents.FLAGS.GUILD_VOICE_STATES, 
    Discord.Intents.FLAGS.DIRECT_MESSAGES, 
], partials: ["CHANNEL"]});

client.commands = new Discord.Collection();
client.queue = [];

fs.readdirSync(path.resolve(__dirname, 'commands'))	
	.filter(file => file.endsWith('.js'))
	.forEach(file => {
		const command = require(`./commands/${file}`);
		client.commands.set(command.data.name, command);
	});



client.once('ready', () => {
	console.log('Ready!');
});
client.on('messageCreate', message => {// for dm
	if (message.content[0] !== '/') return;

	let text = message.content;
	text = text.slice(1).split(/\s+/);
	const command = text.unshift();
})
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;


	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})




client.login(token);