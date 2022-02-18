const fs = require("fs")
const { Client, Intents, Collection } = require("discord.js")
const { token } = require("./config.json")
const { robSomeoneRandom } = require("./schatzkammer.js")

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
})

const commands = new Collection()
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	commands.set(command.data.name, command)
	console.log(`Mounted command ${file}`)
}

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return

	const command = commands.get(interaction.commandName)

	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({
			content: "gnem hat sich entschieden dich zu ignorieren",
			ephemeral: true,
		})
	}
})

// Login to Discord with your client's token
client.login(token).then(async () => {
	const twentyHours = 72000000
	setInterval(async () => robSomeoneRandom(client), twentyHours)
})
