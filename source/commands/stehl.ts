import { SlashCommandBuilder } from "@discordjs/builders"
import { model } from "@source/globals"
import { CommandInteraction } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("stehl")
  .setDescription("lass gnem eigentum stehlen")
  .addUserOption((option) =>
    option
      .setName("opfer")
      .setDescription("das zu beraubende opfer")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("item")
      .setDescription("das zu stehlende eigentum")
      .setRequired(true)
  )

export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser("opfer")
  const item = interaction.options.getString("item")

  if (!interaction.guild) return
  if (!user) return
  if (!item) return

  const member = await interaction.guild.members.fetch(user.id)
  const loot = {
    gulden: model.randomLoot().gulden,
    item: item,
  }

  const embed = model.robSomeone(member, loot)
  interaction.reply({ embeds: [embed] })
}
