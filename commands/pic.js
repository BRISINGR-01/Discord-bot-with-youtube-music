const { MessageAttachment } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const path = require('path');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pic')
		.setDescription('Some Naughty images'),
	async execute(interaction) {
      
        const mainpath = path.resolve(__dirname, "../images")
        const paths = fs.readdirSync(mainpath)
        const file = new MessageAttachment(mainpath + "/" + paths[Math.floor(Math.random() * paths.length)]);

        const exampleEmbed = {
            title: 'Here, take some of Mathilda',
            image: {
                url: 'attachment://' + mainpath,
            },
        };
		await interaction.reply({ embeds: [exampleEmbed], files: [file] });
	},
};