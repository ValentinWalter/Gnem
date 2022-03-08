import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import { schatzkammer } from "../schatzkammer.js"

export const data = new SlashCommandBuilder()
	.setName("schatzkammer")
	.setDescription("des gnems feine schätze")

export async function execute(interaction) {
	const fields = (
		await Promise.all(
			schatzkammer
				.sort((a, b) => a.gulden - b.gulden)
				.reverse()
				.map(async (loot, id) => {
					try {
						const user = await interaction.guild.members.fetch(id)
						const items = loot.items.join("\n")
						return {
							name: user.displayName,
							value: `${loot.gulden} gulden, ${items}`,
						}
					} catch {
						return null
					}
				})
		)
	).filter((el) => el)

	const embed = new MessageEmbed()
		.setTitle("des GNEMS schatzkammer")
		.setColor("YELLOW")
		.addFields(fields)

	await interaction.reply({ embeds: [embed] })
}
