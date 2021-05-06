const { MessageEmbed } = require('discord.js')

module.exports = {
  slash: true,
  testOnly: true,
  description: 'test lol',
  callback: ({ message }) => {
    let embed = new MessageEmbed()
    .setColor("YELLOW")
    .setDescription("Pro this works!")
    if(message){
      embed.setColor("RED")
      message.reply(embed);
    }
    return embed
  },
}