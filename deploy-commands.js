import { readdirSync } from "fs"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import config from "./config.json" assert { type: "json" }

const commands = []
const commandFiles = readdirSync("./source/commands").filter((file) =>
	file.endsWith(".js")
)

for (const file of commandFiles) {
	const command = await import(`./source/commands/${file}`)
	commands.push(command.data.toJSON())
	console.log(`Pushed ${file}`)
}

const rest = new REST({ version: "9" }).setToken(config.token)

rest.put(Routes.applicationGuildCommands(config.client_id, config.guild_id), {
	body: commands,
})
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error)
