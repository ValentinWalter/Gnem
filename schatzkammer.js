const fs = require("fs")
const { Collection, MessageEmbed } = require("discord.js")
const { guild_id, channel_id } = require("./config.json")

const items = [
	"augenbrauen",
	"besen",
	"brille",
	"ehre",
	"gaming maus",
	"guldenbeutel",
	"handy",
	"hose",
	"hut",
	"kugelschreiber",
	"lupe",
	"lustige taschenbücher",
	"megafon",
	"monitor",
	"pantoffeln",
	"pausenessen",
	"rucksack",
	"sammlung antiker ägyptischen bücher zur praxis der mummifizierung",
	"tastatur",
	"tischlampe",
	"toaster",
	"zwicker",
]

const raw = fs.readFileSync("./schatzkammer.json")
let schatzkammer = raw ? new Collection(JSON.parse(raw)) : new Collection()

async function robSomeoneRandom(client) {
	const channel = await client.channels.fetch(channel_id)
	const guild = client.guilds.cache.get(guild_id)
	const members = await guild.members.fetch()
	const member = members.random()

	robSomeone((msg) => channel.send(msg), member, randomLoot())
}

function robSomeone(send, victim, loot) {
	let stolenLoot = schatzkammer.get(victim.id) ?? { gulden: 0, items: [] }
	stolenLoot.gulden += loot.gulden
	stolenLoot.items.push(loot.item)
	schatzkammer.set(victim.id, stolenLoot)

	const data = JSON.stringify(Array.from(schatzkammer))
	fs.writeFileSync("./schatzkammer.json", data)

	const embed = new MessageEmbed()
		.setTitle(`gneeem stielt`)
		.setColor("RED")
		.setDescription(
			`${victim.displayName}s \`${loot.item}\` und \`${loot.gulden} gulden\``
		)

	send({ embeds: [embed] })
}

function randomLoot() {
	const gulden = Math.floor(Math.random() * 100 + 1)
	const item = items[Math.floor(Math.random() * items.length)]
	return { gulden: gulden, item: item }
}

module.exports = { robSomeone, robSomeoneRandom, randomLoot, schatzkammer }
