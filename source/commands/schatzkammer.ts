import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { model } from "@source/globals"

export const data = new SlashCommandBuilder()
  .setName("schatzkammer")
  .setDescription("des gnems feine schätze")

export async function execute(interaction: CommandInteraction) {
  if (!interaction.guild) return
  const treasury = await model.treasuryForGuild(interaction.guild)

  const fields = treasury
    .sort((a, b) => a.gulden - b.gulden)
    .reverse()
    .map((loot, member) => {
      const items = loot.items.join("\n")
      return {
        name: member.displayName,
        value: `${loot.gulden} gulden, ${items}`,
      }
    })

  const embed = new MessageEmbed()
    .setTitle("des GNEMS schatzkammer")
    .setColor("YELLOW")
    .addFields(fields)

  await interaction.reply({ embeds: [embed] })
}
