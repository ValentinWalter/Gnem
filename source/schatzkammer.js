const fs = require("fs")
const path = require("path")
const { Collection, MessageEmbed } = require("discord.js")
const { guild_id, channel_id } = require("../config.json")

const rawItems = fs.readFileSync(path.resolve(__dirname, "../data/items.json"))
const items = JSON.parse(rawItems)

const raw = fs.readFileSync(path.resolve(__dirname, "../data/schatzkammer.json"))
let schatzkammer = raw ? new Collection(JSON.parse(raw)) : new Collection()

async function robSomeoneRandom(client) {
	const channel = await client.channels.fetch(channel_id)
	const guild = client.guilds.cache.get(guild_id)
	const members = await guild.members.fetch()
	const member = members.random()

	const embed = robSomeone(member, randomLoot())
	channel.send({ embeds: [embed] })
}

function robSomeone(victim, loot) {
	let stolenLoot = schatzkammer.get(victim.id) ?? { gulden: 0, items: [] }
	stolenLoot.gulden += loot.gulden
	stolenLoot.items.push(loot.item)
	schatzkammer.set(victim.id, stolenLoot)

	const data = JSON.stringify(Array.from(schatzkammer))
	fs.writeFileSync("./schatzkammer.json", data)

	const plural = victim.displayName.endsWith("s")
	const victimName = `${victim.displayName}${plural ? "" : "s"}`

	return new MessageEmbed()
		.setTitle(`gneeem stielt`)
		.setColor("RED")
		.setDescription(
			`${victimName} \`${loot.item}\` und \`${loot.gulden} gulden\``
		)
}

function randomLoot() {
	const gulden = Math.floor(Math.random() * 100 + 1)
	const item = items[Math.floor(Math.random() * items.length)]
	return { gulden: gulden, item: item }
}

module.exports = { robSomeone, robSomeoneRandom, randomLoot, schatzkammer }
