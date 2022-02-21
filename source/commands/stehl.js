const { SlashCommandBuilder } = require("@discordjs/builders")
const { robSomeone, randomLoot } = require("../schatzkammer")

module.exports = {
	data: new SlashCommandBuilder()
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
		),
	async execute(interaction) {
		const user = interaction.options.getUser("opfer")
		const item = interaction.options.getString("item")

		const member = await interaction.guild.members.fetch(user.id)
		const loot = {
			gulden: randomLoot().gulden,
			item: item,
		}

		const embed = robSomeone(member, loot)
		interaction.reply({ embeds: [embed] })
	},
}
