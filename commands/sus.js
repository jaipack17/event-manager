
const { MessageEmbed } = require('discord.js')
let embed = new MessageEmbed()
module.exports = {
  slash: true,
  testOnly: false,
  description: 'Isnt this just to SUS?!',
  callback: async ({ message }) => {
    if(await message){
embed.setColor("RED")
    embed.setTitle(`SUS MOMENT?`)
    embed.setDescription("You may find this conversation too **sus**. User discretion is advised :pray:")
    embed.addField("SUS MOMENT Description", `Did someone just say SUS in <#${message.channel.id}>?? <@!${message.author.id}> is SUS!!!!!`)
    embed.addField(":microphone2: __**Conversation**__ :microphone2: ", `**Red** \n*Calls emergency meeting* :loudspeaker:  \n **${message.author.username}** \nWhere? \n**Red** \n${message.author.username} you vented and killed Orange! \n**${message.author.username}** \nWhat no i didn't! :shushing_face:\n**Red** \n*votes ${message.author.username}*`)
    embed.setImage("https://static.planetminecraft.com/files/image/minecraft/texture-pack/2021/153/13949499-suscraftbanner_l.webp")
    embed.setFooter(`${message.author.username} was the Imposter. 0 imposters remain.`)
    message.reply(embed)
    .catch(() => console.log("Someone said sus! I couldnt dm them sobism"));
 
    }
    return embed
  },
}
