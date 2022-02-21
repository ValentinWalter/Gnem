const fs = require("fs")
const Path = require("path")
const { MessageEmbed } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("patch-notes")
		.setDescription("einfach die patch notes"),

	async execute(interaction) {
		const path = Path.resolve(__dirname, "../../data/patch-notes.json")
		const rawPatchnotes = fs.readFileSync(path)
		const patchnotes = JSON.parse(rawPatchnotes)

		const fields = Object.entries(patchnotes).map(([version, patches]) => {
			const notes = patches.join("\n")
			return { name: version, value: notes }
		})

		const embed = new MessageEmbed()
			.setTitle("des GNEMS patch notes")
			.setColor("BLUE")
			.addFields(fields)

		await interaction.reply({ embeds: [embed] })
	},
}
