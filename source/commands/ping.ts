import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("gnem")
  .setDescription("einfach der gnem")

export async function execute(interaction: CommandInteraction) {
  let random = Math.floor(Math.random() * 16 + 1)
  let eLetters = Array(random).fill(["E"]).flat().join("")
  await interaction.reply(`GN${eLetters}M`)
}
