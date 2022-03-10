import { Client, Intents } from "discord.js"
import Model from "./backend/Model"

const gnem = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
})

export const model = new Model(gnem)
