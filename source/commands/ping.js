const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gnem")
		.setDescription("einfach der gnem"),

	async execute(interaction) {
		let random = Math.floor(Math.random() * 16 + 1)
		let eLetters = Array(random).fill(["E"]).flat().join("")
		await interaction.reply(`GN${eLetters}M`)
	},
}
