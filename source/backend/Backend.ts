import { Collection, Guild, GuildMember } from "discord.js"
import { PrismaClient } from "@prisma/client"

export type Loot = {
  gulden: number
  items: string[]
}

export type LootItem = {
  gulden: number
  item: string
}

export default class Backend {
  prisma = new PrismaClient()

  rob(user: GuildMember, loot: LootItem) {
    // mutate database
  }

  treasuryForGuild(guild: Guild): Collection<string, Loot> {
    // read database
    return new Collection()
  }
}
