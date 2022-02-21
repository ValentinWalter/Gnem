import { SlashCommandBuilder } from "@discordjs/builders"

export const data = new SlashCommandBuilder()
	.setName("gnem")
	.setDescription("einfach der gnem")

export async function execute(interaction) {
	let random = Math.floor(Math.random() * 16 + 1)
	let eLetters = Array(random).fill(["E"]).flat().join("")
	await interaction.reply(`GN${eLetters}M`)
}
