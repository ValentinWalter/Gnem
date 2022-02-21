import { readdirSync } from "fs"
import { join } from "path"
import { Client, Intents, Collection } from "discord.js"
import config from "../config.json" assert { type: "json" }
import { robSomeoneRandom } from "./schatzkammer.js"
import { _dirname } from "./dirname.js"

// Create a new client instance
const gnem = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
})

// Mount commands
const commands = new Collection()
const commandFiles = readdirSync(join(_dirname, "commands")).filter((file) =>
	file.endsWith(".js")
)

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`)
	commands.set(command.data.name, command)
}

// Listen to interactions
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

// Handle login
async function onReady() {
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
}

const shouldLogin = process.env.npm_config_login
const shouldRobSomeone = process.env.npm_config_robsomeone

if (shouldLogin) {
	try {
		gnem.on("error", console.error)
		gnem.once("ready", onReady)

		await gnem.login(config.token)
		console.log(`Logged in as ${gnem.user.tag}!`)

		if (shouldRobSomeone) {
			await robSomeoneRandom(gnem)
			console.log("Robbed someone.")
		}
	} catch (error) {
		console.error(`Error while logging in: ${error}`)
	}
} else {
	console.log("Built successfully — did not log in.")
}
