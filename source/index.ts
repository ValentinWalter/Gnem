import { readdirSync } from "fs"
import { join } from "path"
import { Collection, Interaction } from "discord.js"
import config from "config.json" assert { type: "json" }
import { model } from "@source/globals"
import { _dirname } from "@source/dirname"
import { SlashCommandBuilder } from "@discordjs/builders"

// Exported by modules in "@source/commands/*"
type Command = {
  data: SlashCommandBuilder
  execute: (interaction: Interaction) => Promise<void>
}

// Mount commands
const commands = new Collection<String, Command>()
const commandFiles = readdirSync(join(_dirname, "commands")).filter((file) =>
  file.endsWith(".js")
)

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`)
  commands.set(command.data.name, command)
}

// Listen to interactions
model.client.on("interactionCreate", async (interaction) => {
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
  model.client.user?.setActivity("mit dem Gedanken dich zu enteignen!") // Status: "Spielt mit..."

  const randomTimeInterval = () => {
    const twentyHours = 72000000
    const fortyHours = twentyHours * 2
    return Math.floor(Math.random() * fortyHours + twentyHours)
  }

  // Periodically rob someone random
  const robAfter = (time: number) =>
    setTimeout(async () => {
      model.robSomeoneRandom()
      robAfter(randomTimeInterval())
    }, time)

  robAfter(randomTimeInterval())
}

// Perform startup logic
const shouldLogin = process.env.npm_config_login
const shouldRobSomeone = process.env.npm_config_robsomeone

if (shouldLogin) {
  try {
    model.client.on("error", console.error)
    model.client.once("ready", onReady)

    await model.client.login(config.token)
    console.log(`Logged in as ${model.client.user?.tag}!`)

    if (shouldRobSomeone) {
      await model.robSomeoneRandom()
      console.log("Robbed someone.")
    }
  } catch (error) {
    console.error(`Error while logging in: ${error}`)
  }
} else {
  console.log("Built successfully — did not log in.")
}
