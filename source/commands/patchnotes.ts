import { readFileSync } from "fs"
import { resolve } from "path"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { SlashCommandBuilder } from "@discordjs/builders"
import { _dirname } from "../dirname.js"

export const data = new SlashCommandBuilder()
  .setName("patch-notes")
  .setDescription("einfach die patch notes")

export async function execute(interaction: CommandInteraction) {
  const path = resolve(_dirname, "../data/patch-notes.json")
  const rawPatchnotes = readFileSync(path).toString()
  const patchnotes: { version: string[] } = JSON.parse(rawPatchnotes)

  const fields = Object.entries(patchnotes).map(([version, patches]) => {
    const notes = patches.join("\n")
    return { name: version, value: notes }
  })

  const embed = new MessageEmbed()
    .setTitle("des GNEMS patch notes")
    .setColor("BLUE")
    .addFields(fields)

  await interaction.reply({ embeds: [embed] })
}
