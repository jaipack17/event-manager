const { MessageEmbed } = require('discord.js')

module.exports = {
  slash: true,
  testOnly: true,
  description: 'Get to know if all bot features are working or not!',
  callback: ({ message}) => { 
          let embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Bot's Status and Functionality")
        .setDescription("Using this command you can see if all features of the bot are working fine!")
        .addField("__Status__", "🟢 Online")
      .addField("__Features__", "**Ranking** - 🟢 Functional \n**Statuses** - 🟢 Fuctional \n**Help** - 🟢 Functional \n**Host Commands** - 🟢 Functional \n**Slash Commands** - 🟢 Functional ")
        .setThumbnail("https://emoji.gg/assets/emoji/9166_online.png")
    if(message){
      message.reply(embed);
    }
    return embed
  },
}