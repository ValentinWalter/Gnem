import { SlashCommandBuilder } from "@discordjs/builders"
import { robSomeone, randomLoot } from "../schatzkammer.js"
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice"
import { join } from "path"
import { _dirname } from "../dirname.js"

export const data = new SlashCommandBuilder()
  .setName("stehl")
  .setDescription("lass gnem eigentum stehlen")
  .addUserOption((option) =>
    option
      .setName("opfer")
      .setDescription("das zu beraubende opfer")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("item")
      .setDescription("das zu stehlende eigentum")
      .setRequired(true)
  )

export async function execute(interaction) {
  const user = interaction.options.getUser("opfer")
  const item = interaction.options.getString("item")

  const member = await interaction.guild.members.fetch(user.id)
  const loot = {
    gulden: randomLoot().gulden,
    item: item,
  }

  const embed = robSomeone(member, loot)
  interaction.reply({ embeds: [embed] })

  const index = Math.floor(Math.random() * 9)
  console.log(join(_dirname, `../resources/laugh0${index}.mp3`))

  // Laugh
  const connection = joinVoiceChannel({
    channelId: interaction.member.voice.channelId,
    guildId: interaction.member.guild.id,
    adapterCreator: interaction.member.guild.voiceAdapterCreator,
  })

  const player = createAudioPlayer()
  const resource = createAudioResource(
    join(_dirname, `../resources/laugh0${index}.mp3`)
  )

  connection.on(VoiceConnectionStatus.Ready, () => {
    player.play(resource)
    connection.subscribe(player)

    player.on(AudioPlayerStatus.Idle, () => {
      player.stop()
      connection.destroy()
    })
  })

  player.on("error", (error) => {
    console.error(
      `Error: ${error.message} with resource ${error.resource.metadata.title}`
    )
  })
}
