import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"
import { Collection, MessageEmbed } from "discord.js"
import config from "../config.json" assert { type: "json" }
import { _dirname } from "./dirname.js"

const itemsPath = resolve(_dirname, "../data/items.json")
const rawItems = readFileSync(itemsPath)
const items = JSON.parse(rawItems)

const schatzkammerPath = resolve(_dirname, "../data/schatzkammer.json")
const rawSchatzkammer = readFileSync(schatzkammerPath)
export let schatzkammer = new Collection(JSON.parse(rawSchatzkammer))

export async function robSomeoneRandom(client) {
	const channel = await client.channels.fetch(config.channel_id)
	const guild = client.guilds.cache.get(config.guild_id)
	const members = await guild.members.fetch()
	const member = members.random()

	const embed = robSomeone(member, randomLoot())
	channel.send({ embeds: [embed] })
}

export function robSomeone(victim, loot) {
	let stolenLoot = schatzkammer.get(victim.id) ?? { gulden: 0, items: [] }
	stolenLoot.gulden += loot.gulden
	stolenLoot.items.push(loot.item)
	schatzkammer.set(victim.id, stolenLoot)

	const data = JSON.stringify(Array.from(schatzkammer))
	writeFileSync(schatzkammerPath, data)

	const plural = victim.displayName.endsWith("s")
	const victimName = `${victim.displayName}${plural ? "" : "s"}`

	return new MessageEmbed()
		.setTitle(`gneeem stielt`)
		.setColor("RED")
		.setDescription(
			`${victimName} \`${loot.item}\` und \`${loot.gulden} gulden\``
		)
}

export function randomLoot() {
	const gulden = Math.floor(Math.random() * 100 + 1)
	const item = items[Math.floor(Math.random() * items.length)]
	return { gulden: gulden, item: item }
}
