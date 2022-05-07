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
    const newLoot = this.prisma.loot.create({
      data: {
        item: loot.item,
        gulden: loot.gulden,
        victimId: user.id,
        guildId: user.guild.id,
      },
    })
    
  }
  async treasuryForGuild(guild: Guild): Promise<Collection<string, Loot>> {
    // read database
    let rueckgabe = new Collection<string, Loot>()
    const victimLoot = await this.prisma.loot.findMany({})
    let haltItem:Loot
    let bag: string[]

    const victims = await this.prisma.loot.groupBy({
      by: ['victimId'],
      _sum: {
        gulden: true,
      },
      where: { guildId: guild.id },
    })
    victims.forEach((victim) => {
      victimLoot: this.prisma.loot.findMany({
        where: { victimId: victim.victimId },
      }),
      victimLoot.forEach((vL) => {
        bag.push(vL.item)
      });
      haltItem.gulden = victim._sum.gulden ?? 0
      haltItem.items = bag
      rueckgabe.set(victim.victimId, haltItem)
      while(bag.length != 0){
        bag.pop
      }
    });
    return rueckgabe
  }
}
