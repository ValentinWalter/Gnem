import Backend, { LootItem } from "@backend/Backend"
import { _dirname } from "@source/dirname.js"
import config from "config.json" assert { type: "json" }
import { Client, GuildMember, MessageEmbed, TextChannel } from "discord.js"
import { readFileSync } from "fs"
import { resolve } from "path"

export default class Model {
  readonly itemPool: string[]
  private backend: Backend

  constructor() {
    this.backend = new Backend()

    const itemsPath = resolve(_dirname, "../data/items.json")
    const rawItems = readFileSync(itemsPath).toString()
    this.itemPool = JSON.parse(rawItems)
  }

  randomLoot(): LootItem {
    const gulden = Math.floor(Math.random() * 100 + 1)
    const item = this.itemPool[Math.floor(Math.random() * this.itemPool.length)]
    return { gulden: gulden, item: item }
  }

  async robSomeoneRandom(client: Client) {
    // TODO: Provide guilds the option to customize this channel
    const channel = (await client.channels.fetch(config.channel_id)) as TextChannel
    const guild = client.guilds.cache.get(config.guild_id)
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
