const { readdirSync } = require("fs")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { client_id, guild_id, token } = require("./config.json")

const commands = []
const commandFiles = readdirSync("./commands").filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	commands.push(command.data.toJSON())
	console.log(`Pushed ${file}`)
}

const rest = new REST({ version: "9" }).setToken(token)

rest.put(Routes.applicationGuildCommands(client_id, guild_id), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error)
