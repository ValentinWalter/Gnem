import Backend, { Loot, LootItem } from "@backend/Backend"
import { _dirname } from "@source/dirname.js"
import config from "config.json" assert { type: "json" }
import {
  Client,
  Collection,
  Guild,
  GuildMember,
  MessageEmbed,
  TextChannel,
} from "discord.js"
import { readFileSync } from "fs"
import { resolve } from "path"

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false
  const testDummy: TValue = value
  return true
}

export default class Model {
  readonly itemPool: string[]
  readonly client: Client
  private backend: Backend

  constructor(client: Client) {
    this.client = client
    this.backend = new Backend()

    const itemsPath = resolve(_dirname, "../data/items.json")
    const rawItems = readFileSync(itemsPath).toString()
    this.itemPool = JSON.parse(rawItems)
  }

  async treasuryForGuild(guild: Guild): Promise<Collection<GuildMember, Loot>> {
    const byMember = this.backend
      .treasuryForGuild(guild)
      .map(async (loot, id): Promise<[GuildMember, Loot] | null> => {
        try {
          const user = await guild.members.fetch(id)
          return [user, loot]
        } catch {
          return null
        }
      })

    return new Collection((await Promise.all(byMember)).filter(notEmpty))
  }

  randomLoot(): LootItem {
    const gulden = Math.floor(Math.random() * 100 + 1)
    const item = this.itemPool[Math.floor(Math.random() * this.itemPool.length)]
    return { gulden: gulden, item: item }
  }

  async robSomeoneRandom() {
    // TODO: Provide guilds the option to customize this channel
    const channel = (await this.client.channels.fetch(
      config.channel_id
    )) as TextChannel
    const guild = this.client.guilds.cache.get(config.guild_id)
    const members = await guild?.members.fetch()
    const member = members?.random()

    if (!member) return

    const embed = this.robSomeone(member, this.randomLoot())
    channel.send({ embeds: [embed] })
  }

  robSomeone(victim: GuildMember, loot: LootItem) {
    this.backend.rob(victim, loot)

    // Append "s" to user name if not already present
    const plural = victim.displayName.endsWith("s")
    const victimName = `${victim.displayName}${plural ? "" : "s"}`

    return new MessageEmbed()
      .setTitle(`gneeem stielt`)
      .setColor("RED")
      .setDescription(`${victimName} \`${loot.item}\` und \`${loot.gulden} gulden\``)
  }
}
