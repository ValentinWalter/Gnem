const fs = require("fs")
const { Client, Intents, Collection } = require("discord.js")
const { token } = require("./config.json")
const { robSomeoneRandom } = require("./schatzkammer.js")

// Create a new client instance
const gnem = new Client({
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
}

gnem.on("interactionCreate", async (interaction) => {
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
gnem.login(token).then(async () => {
	console.log(`Logged in as ${gnem.user.tag}!`)
	gnem.user?.setActivity("mit dem Gedanken dich zu enteignen!")

	const randomTime = () => {
		const twentyHours = 72000000
		const fortyHours = twentyHours * 2
		return Math.floor(Math.random() * fortyHours + twentyHours)
	}

	const robAfter = (time) =>
		setTimeout(async () => {
			robSomeoneRandom(gnem)
			robAfter(randomTime())
		}, time)

	robAfter(randomTime())
})

gnem.on("error", console.error)
