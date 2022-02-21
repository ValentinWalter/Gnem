const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { schatzkammer } = require("../schatzkammer")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("schatzkammer")
		.setDescription("des gnems feine schätze"),

	async execute(interaction) {
		const fields = await Promise.all(
			schatzkammer
				.sort((a, b) => a.gulden - b.gulden)
				.reverse()
				.map(async (loot, id) => {
					const user = await interaction.guild.members.fetch(id)
					const items = loot.items.join("\n")
					return {
						name: user.displayName,
						value: `${loot.gulden} gulden, ${items}`,
					}
				})
		)

		const embed = new MessageEmbed()
			.setTitle("des GNEMS schatzkammer")
			.setColor("YELLOW")
			.addFields(fields)

		await interaction.reply({ embeds: [embed] })
	},
}
