const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gnem")
		.setDescription("einfach der gnem"),
	async execute(interaction) {
		await interaction.reply("GNEEEM")
	},
}
