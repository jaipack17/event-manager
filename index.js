//botvariables
const Discord = require("discord.js");
const client = new Discord.Client();
const mongoose = require('mongoose');
const data = require("./models/data.js");
const Canvas = require("canvas")
const fs = require("fs")
const WOKCommands = require('wokcommands')
require('dotenv').config()
const guildId = '758920926514511892'

const prefix = ">";
//database
const keepAlive = require('./server.js');
const cmds = ["help", "wins", "lb", "rank", "status", "logs", "searchlogs"]

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); 

const Data = require("./models/data.js");
const Profile = require("./models/profile.js");
const Tag = require("./models/tags.js");
const Afk = require("./models/afk.js");
const RG = require("./models/rg.js");
const Logs = require("./models/logs.js");
const HS = require("./models/hs.js");
const Notes = require("./models/notes.js");
const April = require("./models/april.js")
const Notifications = require("./models/noti.js")
const Vote = require("./models/vote.js")
const Rewards = require("./models/rewards.js")

const { estimatedDocumentCount } = require("./models/data.js");

client.on("ready", async () => {
  console.log("Event bot is online");
  // new WOKCommands(client, {
  //   commandsDir: 'commands',
  //   testServers: [guildId],
  //   showWarns: false,
  // })

  setInterval(() => {
      let guild =  client.guilds.cache.get("758920926514511892")
      let memberCount =  guild.memberCount
      client.user.setActivity(` fun events! | >help | ${memberCount} users!`, { type: 'COMPETING' })
  }, 10000); // Runs this every 10 seconds.
}); 
client.on("message", async (message) => {
  if(message.content.includes("<@&761445504235995157>") && message.channel.id == "759293779344621568"){
  HS.findOne({
      userID: message.author.id
  }, (err2, data2) => {
      if (err2) console.log(err2)
      if(data2){
          data2.hosted += 1;
          message.react("✅")
          data2.save().catch(err => console.log(err));
} else{
      const newData = new HS({
          host: message.author.username,
          userID: message.author.id,
          hosted: 1
      })
      message.react("✅")
      newData.save().catch(err => console.log(err));
      }
  })
  }
  if(message.channel.id == "809691699151372308" || message.channel.id == "763206772143554590" || message.channel.id == "832542119385366599"){
    if(message.content.length >= 8){
      message.react("👍")
      message.react("👎")
    } else{
      message.delete()
      message.author.send("Your suggestion is too short!")
    }
  }
  // if(message.content == ">announce"){
  //   message.delete()
  //   let embed = new Discord.MessageEmbed()
  //   .setColor("GREEN")
  //   .setTitle(":information_source: Category Added")
  //   .setThumbnail(client.user.displayAvatarURL())
  //   .setDescription("The following category has been added to the award show.")
  //   .addField("Ultimate Veteran", "Given to the best veteran in the server in terms of activity, contribution and behaviour. \n**Note:** Nominees for this category will not include ALL veterans in the server")
  //   .setFooter("Thanks! - Hosts")
  //   message.channel.send(embed)
  // }
  Afk.findOne({
      userID: message.author.id
  }, (err2, data2) => {
      if (err2) console.log(err2)
      if(data2){
          data2.remove().catch(err => console.log(err));
          message.channel.send(`Welcome back ${message.author.username}! I removed your afk!`)
      }
  })
  let mentioned = await message.mentions.members.first() 
  if(mentioned){
      Afk.findOne({
          userID: mentioned.user.id
      }, (err2, data2) => {
          if (err2) console.log(err2)
          if(data2){
              message.channel.send(`${mentioned.user.username}#${mentioned.user.discriminator} is Afk: ${data2.reason}`)
          }
      })
      Profile.findOne({
          userID: mentioned.user.id

      }, (err, data) => {
          if(err) console.log(err);
          if(data){
              console.log(data)
              if(data.status.includes("unavailable") || data.description.includes("unavailable")){
                  let SuccessEmbed = new Discord.MessageEmbed();
                  SuccessEmbed.setColor("GREEN")
                  SuccessEmbed.setTitle(`${mentioned.user.username} is unavailable!`);
                  if(data.status.includes("available")){
                      SuccessEmbed.addField("✅ Status", `"${data.status}"`)
                  } else if(data.status.includes("un")){
                      SuccessEmbed.addField("⛔ Status", `"${data.status}"`)
                  } else{
                      SuccessEmbed.addField("🔶 Status", `"${data.status}"`)
                  }
                  SuccessEmbed.addField("Description", `"${data.description}"`)
  
                  message.channel.send(SuccessEmbed)
                  .then(message => {
                      setTimeout(() => message.delete(), 5000);                      })
                    .catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);
                  return;
              }
          }
      })
  }
  if(message.content == "<@!815070001630412841>"){
      let arr = ["`>`", "`/e `"]
      let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Event Manager")
      .setDescription("Event Manager is an easy to use bot made specially for Pickle Events to track user's wins, Auto assign event roles, manage event wins, leaderboards, logs and more! Type \`\`>help\`\` to view my commands")
      .addField("Prefixes - ", arr)
      .addField("Pickle Events Invite","[Click me to join!](https://discord.gg/4yMFwA3nAc/)")
      .setFooter("● Participate in fun events hosted everyday!")
      .setThumbnail(client.user.displayAvatarURL({dynamic : true}))
      message.channel.send(embed)
  }
  if (message.content.startsWith(">") || message.content.startsWith("/e ")) {
      var args 
      if(message.content.startsWith("/e ")){
          args = message.content.substr(3)
          .toLowerCase()
          .split(" ");
          console.log(`${args} (${message.author.username})`)
      } else{
          args = message.content.substr(prefix.length)
          .toLowerCase()
          .split(" ");
          console.log(`${args} (${message.author.username})`)
      }

      // if(args[0] == "poll"){
      //   let channel = message.guild.channels.cache.find(name => name.id === "836462462713987082")
      //   let poll = new Discord.MessageEmbed()
      //   .setColor("GREEN")
      //   .setTitle("Kamai or Kamai?")
      //   .setDescription("1️⃣ - Kamai \n\n2️⃣ - Kamai")
      //   .setTimestamp()
      //   channel.send(poll)
      //   .then(m => {
      //     m.react("1️⃣")
      //     m.react("2️⃣")
      //   })
      // }
    if(args[0] == "clean"){
      if(message.member.roles.cache.find(r => r.name == "Director") || message.member.roles.cache.find(r => r.name == "Helper") || message.member.roles.cache.find(r => r.name == "Host") || message.member.roles.cache.find(r => r.name == "Supervisor") || message.member.roles.cache.find(r => r.name == "Head Supervisor")){
        await message.channel.messages.fetch({limit: 100}).then( async messages => {
          let arr = messages.array()
          for(var i = 0; i < arr.length; i++){
            if(arr[i].author.id == client.user.id || arr[i].content.startsWith(">")){
              arr[i].delete()
            }
          }
          message.channel.send("**Bot Messages Cleaned** :broom: :wastebasket:")
          .then(m => {
            setTimeout(function(){
              m.delete()
            }, 3000)
          })
        });
      }
    }
      if(args[0] == "new_role_reward"){
        let win = Math.floor(args[1])
        let roleID = args[2]
        if(message.author.id == "755446225180033064" || message.author.id == "822693108771717140" || message.author.id == "805746277337268235" || message.author.id == "796765147695546388" || message.author.id == "402267713398898688" || message.author.id == "521865362145280030"){
          if(!win){
            return message.channel.send("Incorrect Command Usage! `>new_role_reward <Win Count> <RoleID>`")
          }    
          if(!roleID){
            return message.channel.send("Incorrect Command Usage! `>new_role_reward <Win Count> <RoleID>`")
          } 
          if(isNaN(win)){
            return message.channel.send("Incorrect Command Usage! `>new_role_reward <Win Count> <RoleID>`")
          }    
          Rewards.findOne({
            server: message.guild.id
          }, (err, data) => {
            if(!data){
              let array = []
              if(args[2]){
                array[win] = roleID
                array[win + 1] = null
              }
              const newData = new Rewards({
                server: message.guild.id,
                rewards: array
              })
              newData.save().catch(err => console.log(err))
              message.channel.send(`New role reward made for ${win} wins!`)
            } else{
              if(args[2]){
                data.rewards[win] = roleID
                data.markModified('rewards') 
              }
              data.save().catch(err => console.log(err))
              message.channel.send(`New role reward made for ${win} wins!`)            
            }
          })
        }
      }
      if(args[0] == "remove_role_reward"){
        let win = Math.floor(args[1])
        if(message.author.id == "755446225180033064" || message.author.id == "822693108771717140" || message.author.id == "805746277337268235" || message.author.id == "796765147695546388" || message.author.id == "402267713398898688" || message.author.id == "521865362145280030"){
          if(!win){
            return message.channel.send("Incorrect Command Usage! `>remove_role_reward <Win Count>`")
          }    
          if(isNaN(win)){
            return message.channel.send("Incorrect Command Usage! `>remove_role_reward <Win Count>`")
          }    
          Rewards.findOne({
            server: message.guild.id
          }, (err, data) => {
            if(!data){
              message.channel.send(`No data found!`)
            } else{
              if(win){
                console.log(win)
                data.rewards[win] = null
                data.markModified('rewards') 
              }
              data.save().catch(err => console.log(err))
              message.channel.send(`Role reward removed for ${win} wins!`)            
            }
          })
        }
      }
      if(args[0] == "role_rewards"){
        if(message.member.roles.cache.some(role => role.name === 'Host')){
          Rewards.findOne({
            server: message.guild.id
          }, (err, data) => {
            if(!data){
              message.channel.send(`No data found!`)
            } else{
              let embed = new Discord.MessageEmbed()
              .setColor("GREEN")
              .setDescription("Here are all the custom role rewards of the server!")
              let str = ""
              for(var i = 0; i < data.rewards.length; i++){
                if(data.rewards[i] != null){
                  str += `${i} Wins - <@&${data.rewards[i]}>`
                }
              }       
              if(str){
                embed.addField("Rewards", str)          }
              else{
                embed.addField("Rewards", "None")          
              }
              message.channel.send(embed)
            }
          })
        }
      }
      if(args[0] == "notifications"){
        if(message.member.roles.cache.some(role => role.name === 'Host')){
          if(args[1] == "on"){
            Notifications.findOne({
              userID: message.author.id
            }, (err, data) => {
              if(!data){
                const newData = new Notifications({
                  userID: message.author.id,
                  allow: true
                })
                newData.save().catch(err => console.log(err))
              } else{
                data.allow = true
                data.save().catch(err => console.log(err))
              }
            })
            message.channel.send("Your have turned \`on\` Event Manager Notifications!")
          }

          if(args[1] == "off"){
            Notifications.findOne({
              userID: message.author.id
            }, (err, data) => {
              if(!data){
                const newData = new Notifications({
                  userID: message.author.id,
                  allow: false
                })
                newData.save().catch(err => console.log(err))
              } else{
                data.allow = false
                data.save().catch(err => console.log(err))
              }
            })
            message.channel.send("Your have turned \`off\` Event Manager Notifications!")
          }
        }
      }
      if(args[0] == "say"){
        if(message.author.username == "jaipack17"){
          let channel = message.mentions.channels.first()
          let content = args.slice(2).join(' ');
          
          channel.send(content)
        }
      }
      //  if(args[0] == "rate"){
      //       message.channel.send(`I ll rate it a **${Math.floor(Math.random() * 11)}/10**`)
      //   }
      if(args[0] == "botstatus"){
        let embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("Bot's Status and Functionality")
        .setDescription("Using this command you can see if all features of the bot are working fine!")
        .addField("__Status__", "🟢 Online")
      .addField("__Features__", "**Ranking** - 🟢 Functional \n**Statuses** - 🟢 Fuctional \n**Help** - 🟢 Functional \n**Host Commands** - 🟢 Functional \n**Slash Commands** - 🟢 Functional ")
        .setThumbnail("https://emoji.gg/assets/emoji/9166_online.png")
        message.channel.send(embed)
      }
     if(args[0] == "picasso"){
       return;
        Vote.find({
          art: "Tim7"
        }, (err, data) => {
          Vote.find({
            art: "Pika"
          }, (err2, data2) => {
            Vote.find({
              art: "Amrak"
            }, (err3, data3) => {
              Vote.find({
                art: "Micro"
              }, (err4, data4) => {
                Vote.find({
                  art: "Corpse"
                }, (err5, data5) => {
                          let embed = new Discord.MessageEmbed()
                          .setColor("BLUE")
                          .setTitle("4. Picasso Pickle")
                          .setDescription("Live vote count for the nominees")
                          .setFooter("This message shows the live vote count for each nominee")
                          .addField("Nominees", `Tim7 - ${data.length} Votes \nN0ryl - ${data2.length} Votes\nAmrak - ${data3.length} Votes\nmicroorganism - ${data4.length} Votes\nCorpseHusbandGangMember21 - ${data5.length} Votes`)
                          message.channel.send(embed)
                         
                  })
                
              })
            })
          })        
        })
        
      }
      if(args[0] == "police"){
        return;
        Vote.find({
          police: "Ath"
        }, (err, data) => {
          Vote.find({
            police: "Kamai"
          }, (err2, data2) => {
            Vote.find({
              police: "Minary"
            }, (err3, data3) => {
              Vote.find({
                police: "Soap"
              }, (err4, data4) => {
                Vote.find({
                  police: "Jadon"
                }, (err5, data5) => {
                  Vote.find({
                    police: "Giga"
                  }, (err6, data6) => {
                    Vote.find({
                      police: "Toxic"
                    }, (err7, data7) => {
                      Vote.find({
                        police: "Wandstick"
                      }, (err8, data8) => {
                        Vote.find({
                          police: "LEOOO"
                        }, (err9, data9) => {
                          let embed = new Discord.MessageEmbed()
                          .setColor("BLUE")
                          .setTitle("1. Best Pickle Police")
                          .setDescription("Live vote count for the nominees")
                          .setFooter("This message shows the live vote count for each nominee")
                          .addField("Nominees", `Ath/Ixleys - ${data.length} Votes \nKamai - ${data2.length} Votes\nMinary - ${data3.length} Votes\nsoap pee - ${data4.length} Votes\nJadon - ${data5.length} Votes\nNerecktoN - ${data6.length} Votes\nToxic Plays - ${data7.length} Votes\nWandstick - ${data8.length} Votes\nLEOOO - ${data9.length} Votes`)
                          message.channel.send(embed)
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })        
        
        
      }
       if(args[0] == "veteran"){
         return;
        Vote.find({
          veteran: "Edicius"
        }, (err, data) => {
          Vote.find({
            veteran: "Reborn"
          }, (err2, data2) => {
            Vote.find({
              veteran: "Jadon"
            }, (err3, data3) => {
              Vote.find({
                veteran: "Giga"
              }, (err4, data4) => {
                Vote.find({
                  veteran: "Shansdragon"
                }, (err5, data5) => {
                  Vote.find({
                    veteran: "Glenn"
                  }, (err6, data6) => {
                    Vote.find({
                      veteran: "Rothrux"
                    }, (err7, data7) => {
                    
                          let embed = new Discord.MessageEmbed()
                          .setColor("BLUE")
                          .setTitle("7. Ultimate Veteran")
                          .setDescription("Live vote count for the nominees")
                          .setFooter("This message shows the live vote count for each nominee")
                          .addField("Nominees", `Edicius - ${data.length} Votes \nReborn - ${data2.length} Votes\nJadon - ${data3.length} Votes\nNerecktoN - ${data4.length} Votes\nShansdragon - ${data5.length} Votes\nGlenn - ${data6.length} Votes\nRothrux - ${data7.length} Votes`)
                          message.channel.send(embed)
                        })
                      })
                    })
                  })
                })
          })        
        })
        
      }
      if(args[0] == "helper"){
        return;
        Vote.find({
          helper: "Darky"
        }, (err, data) => {
          Vote.find({
            helper: "Ert"
          }, (err2, data2) => {
            Vote.find({
              helper: "Light"
            }, (err3, data3) => {
              Vote.find({
                helper: "Minty"
              }, (err4, data4) => {
                Vote.find({
                  helper: "LegitLight"
                }, (err5, data5) => {
                  Vote.find({
                    helper: "LB"
                  }, (err6, data6) => {
                
                          let embed = new Discord.MessageEmbed()
                          .setColor("BLUE")
                          .setTitle("6. Helper Pickle")
                          .setDescription("Live vote count for the nominees")
                          .setFooter("This message shows the live vote count for each nominee")
                          .addField("Nominees", `Darky - ${data.length} Votes \nErtwasdead - ${data2.length} Votes\nLight! - ${data3.length} Votes\nMinty - ${data4.length} Votes\nLegitLight - ${data5.length} Votes\nLB - ${data6.length} Votes`)
                          message.channel.send(embed)
                        })
                      })
                    })
                  })
                })
              })
            
        
      }
      if(args[0] == "engaging"){
        return;
        Vote.find({
          active: "Rice"
        }, (err, data) => {
          Vote.find({
            active: "Light"
          }, (err2, data2) => {
            Vote.find({
              active: "Edicius"
            }, (err3, data3) => {
              Vote.find({
                active: "Darky"
              }, (err4, data4) => {
                Vote.find({
                  active: "Ert"
                }, (err5, data5) => {
                  Vote.find({
                    active: "Disa"
                  }, (err6, data6) => {
                    Vote.find({
                      active: "Odds"
                    }, (err7, data7) => {
                    Vote.find({
                      active: "LB"
                    }, (err8, data8) => {
                          let embed = new Discord.MessageEmbed()
                          .setColor("BLUE")
                          .setTitle("5. Engaging Pickle")
                          .setDescription("Live vote count for the nominees")
                          .setFooter("This message shows the live vote count for each nominee")
                          .addField("Nominees", `ricee - ${data.length} Votes \nLight! - ${data2.length} Votes\nEdicius - ${data3.length} Votes\nDarky - ${data4.length} Votes\nErtwasdead - ${data5.length} Votes\ndisappointed - ${data6.length} Votes\nOdds555 (sus) - ${data7.length} Votes\nLB - ${data8.length} Votes`)
                          message.channel.send(embed)
                    })
                  })
                })
              })
            })
          })        
        })
        })
      }
      if(args[0] == "besthost"){
        return;
        Vote.find({
          host: "Chai"
        }, (err, data) => {
          Vote.find({
            host: "Cmase1"
          }, (err2, data2) => {
            Vote.find({
              host: "Bakr"
            }, (err3, data3) => {
              Vote.find({
                host: "Jadon"
              }, (err4, data4) => {
                Vote.find({
                  host: "jaipack17"
                }, (err5, data5) => {
                  Vote.find({
                    host: "Toxic"
                  }, (err6, data6) => {
                    Vote.find({
                      host: "Giga"
                    }, (err7, data7) => {
                      Vote.find({
                        host: "Void"
                      }, (err8, data8) => {
                          let embed = new Discord.MessageEmbed()
                          .setColor("BLUE")
                          .setTitle("3. Promising Pickle")
                          .setDescription("Live vote count for the nominees")
                          .setFooter("This message shows the live vote count for each nominee")
                          .addField("Nominees", `Chai - ${data.length} Votes \nCmase1 - ${data2.length} Votes\nBakr - ${data3.length} Votes\nJadon - ${data4.length} Votes\njaipack17 - ${data5.length} Votes\nToxic Plays - ${data6.length} Votes\nNerecktoN - ${data7.length} Votes\nVoidable - ${data8.length} votes`)
                          message.channel.send(embed)
                        })
                      })
                    })
                  })
                })
              })
            })
          })        
        
        
      }
      if(args[0] == "expolice"){
        return;
        Vote.find({
         ex_police: "Bald"
        }, (err, data) => {
          Vote.find({
            ex_police: "Div"
          }, (err2, data2) => {
            Vote.find({
              ex_police: "Bakr"
            }, (errhelper, datahelper) => {
              Vote.find({
                ex_police: "Risk"
              }, (err4, data4) => {
                Vote.find({
                  ex_police: "1mat"
                }, (err5, data5) => {
                  Vote.find({
                    ex_police: "EExcited"
                  }, (err6, data6) => {
                    Vote.find({
                      ex_police: "Er1n"
                    }, (err7, data7) => {
                      Vote.find({
                        ex_police: "Strike"
                      }, (err8, data8) => {
                          let embed = new Discord.MessageEmbed()
                          .setColor("BLUE")
                          .setTitle("2. Ex Pickle Police")
                          .setDescription("Live vote count for the nominees")
                          .setFooter("This message shows the live vote count for each nominee")
                          .addField("Nominees", `Bald - ${data.length} Votes \nDiv - ${data2.length} Votes\nBakr - ${datahelper.length} Votes\nRisk - ${data4.length} Votes\n1mat - ${data5.length} Votes\nEExcited - ${data6.length} Votes\nEr1n - ${data7.length} Votes\nStrike - ${data8.length} Votes`)
                          message.channel.send(embed)
                      })
                    })
                  })
                })
              })
            })
          })        
        })
        
      }
      if(args[0] == "vote"){
        return;
        let userID = message.author.id
        let username = message.author.username
        let serverID = message.guild.id
        let staff = ""
        let exstaff = ""
        let host = ""
        let art = ""
        let active = ""
        let helper = ""
        let veteran = ""
        let hasVoted = false
        if (Date.now() - message.member.user.joinedAt < 1000*60*60*24*5) {
          message.reply("You are not eligible to vote yet!")
          return;
        }
        Vote.findOne({
          userID: message.author.id
        }, async (err, data) => {
          if(err) console.log(err);
          if(data){
            if(data.voted == true){
              hasVoted = true
              message.reply("You have already voted!")
            }
          }
          if(hasVoted != true){
            message.reply("**Please check your DMs :mag:**")
            let embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Pickle's Events - Award Show Voting")
            .setDescription("Before you start voting for nominees from each category. You must accept these **Rules** before voting")
            .addField("Rules", "- Do not be toxic to any nominees or hosts. \n- Do not argue about nominees. \n- Do not argue if you aren't a nominee/do not win the award.\n- Be non-biased when voting. \n- If you have read these rules, react with :white_check_mark: to proceed to the voting.")
            .setThumbnail(message.guild.iconURL())
            .setFooter("Read all rules carefully before proceeding.")
            const filter = (reaction, user) => {
              return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            message.author.send(embed).catch(err => console.log(err)).then(async m => {
              m.react("✅")
              m.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
              .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === "✅") {
                  m.channel.send('**Accepted Rules. Proceeding to Voting...**');
                  setTimeout(async function(){
                    let vote1 = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("1. Best Pickle Police")
                    .setDescription("Awarded to the best Moderator/Helper/Supervisor/Head Supervisor/Director on duty protecting this server!")
                    .addField("Nominees", ":one: - **Ath/Ixleys**\n\n:two: - **Kamai**\n\n:three: - **Minary**\n\n:four: - **soap pee**\n\n:five: - **Jadon**\n\n:six: - **NerecktoN**\n\n:seven: - **Toxic Plays**\n\n:eight: - **Wandstick**\n\n:nine: - **LEOOO**")
                    .setThumbnail(message.guild.iconURL())
                    .setFooter("React to the corresponding emojis to successfully submit your vote.")
                    m.channel.send(vote1).then(async m => {
                      const filter2 = (reaction, user) => {
                        return ['1️⃣', "2️⃣", "helper️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
                      };
                      m.react("1️⃣")
                      m.react("2️⃣")
                      m.react("helper️⃣")
                      m.react("4️⃣")
                      m.react("5️⃣")
                      m.react("6️⃣")
                      m.react("7️⃣")
                      m.react("8️⃣")
                      m.react("9️⃣")
                      m.awaitReactions(filter2, { max: 1, time: 120000, errors: ['time'] })
                      .then(collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === "1️⃣") {
                          staff = "Ath"
                          m.channel.send("**Succesfully voted Ath!**")
                        }
                        if (reaction.emoji.name === "2️⃣") {
                          staff = "Kamai"
                          m.channel.send("**Succesfully voted Kamai!**")
                        }
                        if (reaction.emoji.name === "helper️⃣") {
                          staff = "Minary"
                          m.channel.send("**Succesfully voted Minary!**")
                        }
                        if (reaction.emoji.name === "4️⃣") {
                          staff = "Soap"
                          m.channel.send("**Succesfully voted soap pee!**")
                        }
                        if (reaction.emoji.name === "5️⃣") {
                          staff = "Jadon"
                          m.channel.send("**Succesfully voted Jadon!**")
                        }
                        if (reaction.emoji.name === "6️⃣") {
                          staff = "Giga"
                          m.channel.send("**Succesfully voted NerecktoN!**")
                        }
                        if (reaction.emoji.name === "7️⃣") {
                          staff = "Toxic"
                          m.channel.send("**Succesfully voted Toxic Plays!**")
                        }
                        if (reaction.emoji.name === "8️⃣") {
                          staff = "Wandstick"
                          m.channel.send("**Succesfully voted Wandstick!**")
                        }
                        if (reaction.emoji.name === "9️⃣") {
                          staff = "LEOOO"
                          m.channel.send("**Succesfully voted LEOOO!**")
                        }
                        let vote2 = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("2. Ex Pickle Police")
                        .setDescription("Awarded to the best Former Moderator/Helper/Supervisor/Head Supervisor/Director!")
                        .addField("Nominees", ":one: - **bald**\n\n:two: - **Div**\n\n:three: - **Bakr**\n\n:four: - **Risk**\n\n:five: - **1mat**\n\n:six: - **EExcited**\n\n:seven: - **Er1n**\n\n:eight: - **Strike**")
                        .setThumbnail(message.guild.iconURL())
                        .setFooter("React to the corresponding emojis to successfully submit your vote.")
                        m.channel.send(vote2).then(async m => {
                          const filter3 = (reaction, user) => {
                            return ['1️⃣', "2️⃣", "3️⃣","4️⃣","5️⃣","6️⃣","7️⃣", "8️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
                          };
                          m.react("1️⃣")
                          m.react("2️⃣")
                          m.react("3️⃣")
                          m.react("4️⃣")
                          m.react("5️⃣")
                          m.react("6️⃣")
                          m.react("7️⃣")
                          m.react("8️⃣")
                          m.awaitReactions(filter3, { max: 1, time: 120000, errors: ['time'] })
                          .then(collected => {
                            const reaction = collected.first();
                            if (reaction.emoji.name === "1️⃣") {
                              exstaff = "Bald"
                              m.channel.send("**Succesfully voted Bald!**")
                            }
                            if (reaction.emoji.name === "2️⃣") {
                              exstaff = "Div"
                              m.channel.send("**Succesfully voted Div!**")
                            }
                            if (reaction.emoji.name === "3️⃣") {
                              exstaff = "Bakr"
                              m.channel.send("**Succesfully voted Bakr!**")
                            }
                            if (reaction.emoji.name === "4️⃣") {
                              exstaff = "Risk"
                              m.channel.send("**Succesfully voted Risk!**")
                            }
                            if (reaction.emoji.name === "5️⃣") {
                              exstaff = "1mat"
                              m.channel.send("**Succesfully voted 1mat!**")
                            }
                            if (reaction.emoji.name === "6️⃣") {
                              exstaff = "EExcited"
                              m.channel.send("**Succesfully voted EExcited!**")
                            }
                            if (reaction.emoji.name === "7️⃣") {
                              exstaff = "Er1n"
                              m.channel.send("**Succesfully voted Er1n!**")
                            }
                            if (reaction.emoji.name === "8️⃣") {
                              exstaff = "Strike"
                              m.channel.send("**Succesfully voted Strike!**")
                            }
                            let vote3 = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTitle("3. Promising Pickle Award")
                            .setDescription("Awarded to the best host in the server who engages the community in fun events!")
                            .addField("Nominees", ":one: - **Chai**\n\n:two: - **Cmase1**\n\n:three: - **Bakr**\n\n:four: - **Jadon**\n\n:five: - **jaipack17**\n\n:six: - **Toxic Plays**\n\n:seven: - **NerecktoN**\n\n:eight: - **Voidable**")
                            .setThumbnail(message.guild.iconURL())
                            .setFooter("React to the corresponding emojis to successfully submit your vote.")
                            m.channel.send(vote3).then(async m => {
                              const filter4 = (reaction, user) => {
                                return ['1️⃣', "2️⃣", "3️⃣","4️⃣","5️⃣","6️⃣","7️⃣", "8️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
                              };
                              m.react("1️⃣")
                              m.react("2️⃣")
                              m.react("3️⃣")
                              m.react("4️⃣")
                              m.react("5️⃣")
                              m.react("6️⃣")
                              m.react("7️⃣")
                              m.react("8️⃣")
                              m.awaitReactions(filter4, { max: 1, time: 120000, errors: ['time'] })
                              .then(collected => {
                                const reaction = collected.first();
                                if (reaction.emoji.name === "1️⃣") {
                                  host = "Chai"
                                  m.channel.send("**Succesfully voted Chai!**")
                                }
                                if (reaction.emoji.name === "2️⃣") {
                                  host = "Cmase1"
                                  m.channel.send("**Succesfully voted Cmase1!**")
                                }
                                if (reaction.emoji.name === "3️⃣") {
                                  host = "Bakr"
                                  m.channel.send("**Succesfully voted Bakr!**")
                                }
                                if (reaction.emoji.name === "4️⃣") {
                                  host = "Jadon"
                                  m.channel.send("**Succesfully voted Jadon!**")
                                }
                                if (reaction.emoji.name === "5️⃣") {
                                  host = "jaipack17"
                                  m.channel.send("**Succesfully voted jaipack17!**")
                                }
                                if (reaction.emoji.name === "6️⃣") {
                                  host = "Toxic"
                                  m.channel.send("**Succesfully voted Toxic Plays!**")
                                }
                                if (reaction.emoji.name === "7️⃣") {
                                  host = "Giga"
                                  m.channel.send("**Succesfully voted NerecktoN!**")
                                }
                                if (reaction.emoji.name === "8️⃣") {
                                  host = "Void"
                                  m.channel.send("**Succesfully voted Voidable!**")
                                }
                                let vote4 = new Discord.MessageEmbed()
                                .setColor("GREEN")
                                .setTitle("4. Picaso Pickle")
                                .setDescription("Awarded to the best designer/Art Poster in the community!")
                                .addField("Nominees", ":one: - **Tim7**\n\n:two: - **N0ryl/PikaPilot**\n\n:three: - **Amrak**\n\n:four: - **microorganism**\n\n:five: - **CorpseHusbandGangMember21**")
                                .addField("Art Work", "Tim7 - Art Unavailable\nN0ryl - [View](https://media.discordapp.net/attachments/816352450592112720/835129705534324777/zep.png?width=563&height=563) | [View](https://media.discordapp.net/attachments/816352450592112720/835129622773497916/zepyxl300k.png?width=563&height=563)\nAmrak - [View](https://discord.com/channels/758920926514511892/759293831442464818/830466327390322688)\nmicroorganism - [View](https://media.discordapp.net/attachments/759293831442464818/797041797628690442/zep_blanket2.png) | [View](https://media.discordapp.net/attachments/834381150809227294/834381462185967616/zepyxlspring2.png?width=563&height=563)\nCorpseHusbandGangMember21 - [View](https://media.discordapp.net/attachments/759293831442464818/824670249625976872/untitled-Recovered_Final.png?width=1002&height=563) | [View](https://media.discordapp.net/attachments/759293831442464818/832510597840633896/image0.jpg?width=563&height=563)")
                                .setThumbnail(message.guild.iconURL())
                                .setFooter("React to the corresponding emojis to successfully submit your vote.")
                                m.channel.send(vote4).then(async m => {
                                  const filter5 = (reaction, user) => {
                                    return ['1️⃣', "2️⃣", "3️⃣","4️⃣","5️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
                                  };
                                  m.react("1️⃣")
                                  m.react("2️⃣")
                                  m.react("3️⃣")
                                  m.react("4️⃣")
                                  m.react("5️⃣")
                                  m.awaitReactions(filter5, { max: 1, time: 120000, errors: ['time'] })
                                  .then(collected => {
                                    const reaction = collected.first();
                                    if (reaction.emoji.name === "1️⃣") {
                                      art = "Tim7"
                                      m.channel.send("**Succesfully voted Tim7!**")
                                    }
                                    if (reaction.emoji.name === "2️⃣") {
                                      art = "Pika"
                                      m.channel.send("**Succesfully voted N0ryl/PikaPilot!**")
                                    }
                                    if (reaction.emoji.name === "3️⃣") {
                                      art = "Amrak"
                                      m.channel.send("**Succesfully voted Amrak!**")
                                    }
                                    if (reaction.emoji.name === "4️⃣") {
                                      art = "Micro"
                                      m.channel.send("**Succesfully voted microorganism!**")
                                    }
                                    if (reaction.emoji.name === "5️⃣") {
                                      art = "Corpse"
                                      m.channel.send("**Succesfully voted CorpseHusbandGangMember21!**")
                                    }
                                    let vote5 = new Discord.MessageEmbed()
                                    .setColor("GREEN")
                                    .setTitle("5. Engaging Pickle")
                                    .setDescription("Awarded to the person most active in the whole community!")
                                    .addField("Nominees", ":one: - **ricee**\n\n:two: - **Light!**\n\n:three: - **Edicius**\n\n:four: - **Darky**\n\n:five: - **Ertwasdead**\n\n:six: - **LB**\n\n:seven: - **disappointed**\n\n:eight: - **sus (odds555)**")
                                    .setThumbnail(message.guild.iconURL())
                                    .setFooter("React to the corresponding emojis to successfully submit your vote.")
                                    m.channel.send(vote5).then(async m => {
                                      const filter6 = (reaction, user) => {
                                        return ['1️⃣', "2️⃣", "3️⃣","4️⃣","5️⃣","6️⃣", "7️⃣", "8️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
                                      };
                                      m.react("1️⃣")
                                      m.react("2️⃣")
                                      m.react("3️⃣")
                                      m.react("4️⃣")
                                      m.react("5️⃣")
                                      m.react("6️⃣")
                                      m.react("7️⃣")
                                      m.react("8️⃣")                                      
                                      m.awaitReactions(filter6, { max: 1, time: 120000, errors: ['time'] })
                                      .then(collected => {
                                        const reaction = collected.first();
                                        if (reaction.emoji.name === "1️⃣") {
                                          active = "Rice"
                                          m.channel.send("**Succesfully voted ricee!**")
                                        }
                                        if (reaction.emoji.name === "2️⃣") {
                                          active = "Light"
                                          m.channel.send("**Succesfully voted Light!**")
                                        }
                                        if (reaction.emoji.name === "3️⃣") {
                                          active = "Edicius"
                                          m.channel.send("**Succesfully voted Edicius!**")
                                        }
                                        if (reaction.emoji.name === "4️⃣") {
                                          active = "Darky"
                                          m.channel.send("**Succesfully voted Darky!**")
                                        }
                                        if (reaction.emoji.name === "5️⃣") {
                                          active = "Ert"
                                          m.channel.send("**Succesfully voted Ertwasdead (poopno)!**")
                                        }
                                        if (reaction.emoji.name === "6️⃣") {
                                          active = "LB"
                                          m.channel.send("**Succesfully voted LB!**")
                                        }
                                        if (reaction.emoji.name === "7️⃣") {
                                          active = "Disa"
                                          m.channel.send("**Succesfully voted disappointed!**")
                                        }
                                        if (reaction.emoji.name === "8️⃣") {
                                          active = "Odds"
                                          m.channel.send("**Succesfully voted sus (odds555)!**")
                                        }
                                        let vote6 = new Discord.MessageEmbed()
                                        .setColor("GREEN")
                                        .setTitle("6. Helper Pickle")
                                        .setDescription("Awarded to the person who goes out of their way to help new members navigate through the server!")
                                        .addField("Nominees", ":one: - **Darky**\n\n:two: - **Ertwasdead**\n\n:three: - **Light!**\n\n:four: - **minty**\n\n:five: - **LegitLight**\n\n:six: - **LB**")
                                        .setThumbnail(message.guild.iconURL())
                                        .setFooter("React to the corresponding emojis to successfully submit your vote.")
                                        m.channel.send(vote6).then(async m => {
                                          const filter7 = (reaction, user) => {
                                            return ['1️⃣', "2️⃣", "3️⃣","4️⃣","5️⃣","6️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
                                          };
                                          m.react("1️⃣")
                                          m.react("2️⃣")
                                          m.react("3️⃣")
                                          m.react("4️⃣")
                                          m.react("5️⃣")
                                          m.react("6️⃣")                                   
                                          m.awaitReactions(filter7, { max: 1, time: 120000, errors: ['time'] })
                                          .then(collected => {
                                            const reaction = collected.first();
                                            if (reaction.emoji.name === "1️⃣") {
                                              helper = "Darky"
                                              m.channel.send("**Succesfully voted Darky!**")
                                            }
                                            if (reaction.emoji.name === "2️⃣") {
                                              helper = "Ert"
                                              m.channel.send("**Succesfully voted Ertwasdead!**")
                                            }
                                            if (reaction.emoji.name === "3️⃣") {
                                              helper = "Light"
                                              m.channel.send("**Succesfully voted Light!**")
                                            }
                                            if (reaction.emoji.name === "4️⃣") {
                                              helper = "Minty"
                                              m.channel.send("**Succesfully voted minty!**")
                                            }
                                            if (reaction.emoji.name === "5️⃣") {
                                              helper = "LegitLight"
                                              m.channel.send("**Succesfully voted LegitLight!**")
                                            }
                                            if (reaction.emoji.name === "6️⃣") {
                                              helper = "LB"
                                              m.channel.send("**Succesfully voted LB!**")
                                            }
                                            let vote7 = new Discord.MessageEmbed()
                                            .setColor("GREEN")
                                            .setTitle("7. Ultimate Veteran")
                                            .setDescription("Given to the best veteran in the server in terms of activity, contribution and behaviour!")
                                            .addField("Nominees", ":one: - **Edicius**\n\n:two: - **Reborn**\n\n:three: - **Jadon**\n\n:four: - **NerectoN**\n\n:five: - **Shansdragon**\n\n:six: - **Glenn**\n\n:seven: - **Rothrux**")
                                            .setThumbnail(message.guild.iconURL())
                                            .setFooter("React to the corresponding emojis to successfully submit your vote.")
                                            m.channel.send(vote7).then(async m => {
                                              const filter7 = (reaction, user) => {
                                                return ['1️⃣', "2️⃣", "3️⃣","4️⃣","5️⃣","6️⃣", "7️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
                                              };
                                              m.react("1️⃣")
                                              m.react("2️⃣")
                                              m.react("3️⃣")
                                              m.react("4️⃣")
                                              m.react("5️⃣")
                                              m.react("6️⃣")    
                                              m.react("7️⃣")                               
                                              m.awaitReactions(filter7, { max: 1, time: 120000, errors: ['time'] })
                                              .then(collected => {
                                                const reaction = collected.first();
                                                if (reaction.emoji.name === "1️⃣") {
                                                  veteran = "Edicius"
                                                  m.channel.send("**Succesfully voted Edicius!**")
                                                }
                                                if (reaction.emoji.name === "2️⃣") {
                                                  veteran = "Reborn"
                                                  m.channel.send("**Succesfully voted Reborn!**")
                                                }
                                                if (reaction.emoji.name === "3️⃣") {
                                                  veteran = "Jadon"
                                                  m.channel.send("**Succesfully voted Jadon!**")
                                                }
                                                if (reaction.emoji.name === "4️⃣") {
                                                  veteran = "Giga"
                                                  m.channel.send("**Succesfully voted NerectoN!**")
                                                }
                                                if (reaction.emoji.name === "5️⃣") {
                                                  veteran = "Shansdragon"
                                                  m.channel.send("**Succesfully voted Shansdragon!**")
                                                }
                                                if (reaction.emoji.name === "6️⃣") {
                                                  veteran = "Glenn"
                                                  m.channel.send("**Succesfully voted Glenn!**")
                                                }
                                                if (reaction.emoji.name === "7️⃣") {
                                                  veteran = "Rothrux"
                                                  m.channel.send("**Succesfully voted Rothrux!**")
                                                }
                                                let vote7 = new Discord.MessageEmbed()
                                                .setColor("GREEN")
                                                .setTitle("Submit?")
                                                .setDescription("This brings us to the end of voting!")
                                                .addField("Are you sure you want to submit all the votes?", ":white_check_mark: - **Yes**\n\n:x: - **No**")
                                                .setThumbnail(message.guild.iconURL())
                                                .setFooter("React to the corresponding emojis to successfully submit your vote.")
                                                m.channel.send(vote7).then(async m => {
                                                  const filter7 = (reaction, user) => {
                                                    return ["✅","❌"].includes(reaction.emoji.name) && user.id === message.author.id;
                                                  };
                                                  m.react("✅")
                                                  m.react("❌")                             
                                                  m.awaitReactions(filter7, { max: 1, time: 120000, errors: ['time'] })
                                                  .then(collected => {
                                                    const reaction = collected.first();
                                                    if (reaction.emoji.name === "✅") {
                                                      const newData = new Vote({
                                                        server: serverID,
                                                        userID: userID,
                                                        username: username,
                                                        voted: true,
                                                        police: staff,
                                                        ex_police: exstaff,
                                                        host: host,
                                                        art: art,
                                                        active: active,
                                                        helper: helper,
                                                        veteran: veteran
                                                      })
                                                      newData.save().catch(err => console.log(err))
                                                      let yes = new Discord.MessageEmbed()
                                                      .setColor("GREEN")
                                                      .setTitle("All Set!")
                                                      .setDescription("All your votes have been successfully submitted! Thank you for participating in the voting! *Hangs off*")
                                                      m.channel.send(yes)
                                                    }
                                                    if (reaction.emoji.name === "❌") {
                                                      m.channel.send("**Your votes have not been submitted!**")
                                                    }
                                                  })
                                                })
                                              })
                                            })
                                          })
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  }, 2000)
                } else {
                  m.channel.send('You did not react to the message with the correct emoji!');
                }
              })
              .catch(collected => {
                 m.channel.send('You did not react to the message!');
              });
            })
          }
        })
      }
      if(args[0] == "votes"){
        
      }
      if(args[0] == "notes"){
          if(message.member.roles.cache.some(role => role.name === 'Host')){
              let mentioned =  message.mentions.members.first()       
              if(!mentioned){
                let embedPoll = new Discord.MessageEmbed()
                .setDescription(`⛔ Mention a user!`)
                .setColor('RED')
                message.channel.send(embedPoll);                
              } else{
          Notes.find({
              personID: mentioned.user.id
          }, (err, data) => {
              if(err) console.log(err);
              if(!data){
                message.channel.send("**0 Notes Found**")
                return;
              } else{
                console.log(data)
                message.channel.send(`**${data.length} Notes Found**`)
                let embed = new Discord.MessageEmbed()
                .setColor("GREEN")
                if(mentioned){
                  embed.setTitle(`${mentioned.user.username}#${mentioned.user.discriminator}'s Notes`)
                  embed.setThumbnail(mentioned.user.displayAvatarURL({dynamic : true}))
                }
                embed.setDescription("Here are all the Notes for the winner")

                for(var i = 0; i < data.length; i++){
                  let arr = []
                  arr.length = 4
                  arr[0] = "**User's Id:** " + data[i].personID
                  arr[1] = "**Host:** " + data[i].host + "|" + data[i].hostID
                  arr[2] = "**Note:** " + data[i].note
                  arr[3] = "**Time:** " + data[i].time
                  embed.addField(`Note ${i + 1}`, `${arr[0]} \n${arr[1]} \n${arr[2]} \n${arr[3]}`)
                }
                embed.setFooter("Time is set according to GMT+0.")
                message.channel.send(embed);
              }
          })
              }
          } else{
              let embedPoll = new Discord.MessageEmbed()
              .setDescription(`⛔ You do not have permissions to use this command! Ask a host to check your notes.`)
              .setColor('RED')
              message.channel.send(embedPoll)
          } 
      }
      if(args[0] == "note"){
          if(message.member.roles.cache.some(role => role.name === 'Host')){
              let mentioned =  message.mentions.members.first()
              if(!mentioned){
                let embedPoll = new Discord.MessageEmbed()
                .setDescription(`⛔ Mention a user!`)
                .setColor('RED')
                message.channel.send(embedPoll);                
              } else{
                const unixTimestamp = Math.round((new Date()).getTime() / 1000);
                const milliseconds = unixTimestamp * 1000 
                const dateObject = new Date(milliseconds)
                const humanDateFormat = dateObject.toLocaleString() 
                let text = args.slice(2).join(' ');
                const newData = new Notes({
                  host: message.author.username,
                  hostID: message.author.id,
                  personID: mentioned.user.id,
                  note: text,
                  time: humanDateFormat + " GMT+0"
                })
                newData.save().catch(err => console.log(err));
              Notes.find({
                  personID: mentioned.user.id
              }, (err, data) => {
                  if(err) console.log(err);
                  if(!data){
                    console.log("Not Banned")
                  } else{
                    console.log("Got Data")
                    console.log(data)
                    if(data.length + 1 == 3){
                      Notifications.find({
                        allow: true
                      },async (err, data) => {
                        for(var i = 0;i < data.length; i++){
                          let user = await message.guild.members.cache.get(data[i].userID)
                          let embed = new Discord.MessageEmbed()
                          .setColor("RED")
                          .setTitle("📢 Notification!")
                          .setDescription("A user was banned from events in Pickles Events!")
                          .addField("Information", `User: ${mentioned.user.tag} \nReason: 3 Warns \nDuration: \`3 Days\` \nHost: ${message.author.tag}`)
                          user.send(embed).catch(err => console.log(err))
                        }
                      })
                      let embed = new Discord.MessageEmbed()
                      .setColor("RED")
                      .setTitle("Ban Notice")
                      .setDescription("**You have been banned from attending events from Pickle's Events for \`3 days\`. Reason: 3 Notes**")
                      .addField("Information", "- Duration of Ban - \`3 Days\` \n- If you try to evade your ban by joining events from Alternate Accounts, You will receive another note \n- You are not allowed to join or win events. \n- You must follow the rules listed below.")
                      .addField("Rules Not To Break In The Future", "- Do not have a toxic behavior in events \n- Do not post troll suggestions in <#763206772143554590> \n- Do not complain after any events about things that happened. \n- Do not beg for hosts to host events \n- Do not spam chats in roblox events and other events.")
                      .setFooter("Follow these rules at all times. Not doing so will get you a note leading to permanent ban from events!")
                      mentioned.send(embed)
                      message.channel.send("**User banned for \`3 days\` from events | Reason: 3 Notes**")
                    }
                    if(data.length + 1 == 5){
                      Notifications.find({
                        allow: true
                      }, async (err, data) => {
                        for(var i = 0;i < data.length; i++){
                          let user = await message.guild.members.cache.get(data[i].userID)
                          let embed = new Discord.MessageEmbed()
                          .setColor("RED")
                          .setTitle("📢 Notification!")
                          .setDescription("A user was banned from events in Pickles Events!")
                          .addField("Information", `User: ${mentioned.user.tag} \nReason: 5 Warns \nDuration: \`5 Days\` \nHost: ${message.author.tag}`)
                          user.send(embed).catch(err => console.log(err))
                        }
                      })
                      let embed = new Discord.MessageEmbed()
                      .setColor("RED")
                      .setTitle("Ban Notice")
                      .setDescription("**You have been banned from attending events from Pickle's Events for \`5 days\`. Reason: 5 Notes**")
                      .addField("Information", "- Duration of Ban - \`5 Days\` \n- If you try to evade your ban by joining events from Alternate Accounts, You will receive another note \n- You are not allowed to join or win events. \n- You must follow the rules listed below.")
                      .addField("Rules Not To Break In The Future", "- Do not have a toxic behavior in events \n- Do not post troll suggestions in <#763206772143554590> \n- Do not complain after any events about things that happened. \n- Do not beg for hosts to host events \n- Do not spam chats in roblox events and other events.")
                      .setFooter("Follow these rules at all times. Not doing so will get you a note leading to permanent ban from events!")
                      mentioned.send(embed).catch(err => console.log(err))
                      message.channel.send("**User banned for \`5 days\` from events | Reason: 5 Notes**")
                    }
                    if(data.length + 1 == 7){
                      Notifications.find({
                        allow: true
                      }, async (err, data) => {
                        for(var i = 0;i < data.length; i++){
                          let user = await message.guild.members.cache.get(data[i].userID)
                          let embed = new Discord.MessageEmbed()
                          .setColor("RED")
                          .setTitle("📢 Notification!")
                          .setDescription("A user was banned from events in Pickles Events!")
                          .addField("Information", `User: ${mentioned.user.tag} \nReason: 7 Warns \nDuration: \`7 Days\` \nHost: ${message.author.tag}`)
                          user.send(embed).catch(err => console.log(err))
                        }
                      })
                      let embed = new Discord.MessageEmbed()
                      .setColor("RED")
                      .setTitle("Ban Notice")
                      .setDescription("**You have been banned from attending events from Pickle's Events for \`7 days\`. Reason: 7 Notes**")
                      .addField("Information", "- Duration of Ban - \`7 Days\` \n- If you try to evade your ban by joining events from Alternate Accounts, You will receive another note \n- You are not allowed to join or win events. \n- You must follow the rules listed below.")
                      .addField("Rules Not To Break In The Future", "- Do not have a toxic behavior in events \n- Do not post troll suggestions in <#763206772143554590> \n- Do not complain after any events about things that happened. \n- Do not beg for hosts to host events \n- Do not spam chats in roblox events and other events.")
                      .setFooter("Follow these rules at all times. Not doing so will get you a note leading to permanent ban from events!")
                      mentioned.send(embed).catch(err => console.log(err))
                      message.channel.send("**User banned for \`7 days\` from events | Reason: 7 Notes**")
                    }
                    if(data.length + 1 == 10){
                      Notifications.find({
                        allow: true
                      }, async (err, data) => {
                        for(var i = 0;i < data.length; i++){
                          let user = await message.guild.members.cache.get(data[i].userID)
                          let embed = new Discord.MessageEmbed()
                          .setColor("RED")
                          .setTitle("📢 Notification!")
                          .setDescription("A user was banned from events in Pickles Events!")
                          .addField("Information", `User: ${mentioned.user.tag} \nReason: 10 Warns \nDuration: \`Permanent\` \nHost: ${message.author.tag}`)
                          user.send(embed).catch(err => console.log(err))
                        }
                      })
                      let embed = new Discord.MessageEmbed()
                      .setColor("RED")
                      .setTitle("Ban Notice")
                      .setDescription("**You have been banned from attending events from Pickle's Events \`Permanently\`. Reason: 10 Notes**")
                      .addField("Information", "- Duration of Ban - \`Permanent\` \n- If you try to evade your ban by joining events from Alternate Accounts, You will receive another note \n- You are not allowed to join or win events. \n- You must follow the rules listed below.")
                      .addField("Rules Not To Break In The Future", "- Do not have a toxic behavior in events \n- Do not post troll suggestions in <#763206772143554590> \n- Do not complain after any events about things that happened. \n- Do not beg for hosts to host events \n- Do not spam chats in roblox events and other events.")
                      .setFooter("Follow these rules at all times. Not doing so will get you a note leading to permanent ban from events!")
                      mentioned.send(embed).catch(err => console.log(err))
                      message.channel.send("**User banned \`Permanently\` from events | Reason: 10 Notes**")
                    }
                  }
              })
                message.channel.send("**Noted!**")
                Notifications.find({
                  allow: true
                }, async (err, data) => {
                  for(var i = 0;i < data.length; i++){
                    let user = await message.guild.members.cache.get(data[i].userID)
                    let embed = new Discord.MessageEmbed()
                    .setColor("ORANGE")
                    .setTitle("📢 Notification!")
                    .setDescription("A user was warned in Pickles Events!")
                    .addField("Information", `User: ${mentioned.user.tag} \nReason: ${text} \nHost: ${message.author.tag}`)
                    user.send(embed).catch(err => console.log(err))
                  }
                })
              }
          }
           else{
              let embedPoll = new Discord.MessageEmbed()
              .setDescription(`⛔ You do not have the permissions to use this command!`)
              .setColor('RED')
              message.channel.send(embedPoll);
          }
      }
      // if(args[0] == "unban"){
      //   let mentioned = message.mentions.members.first()
      //   let embed = new Discord.MessageEmbed()
      //   .setColor("GREEN")
      //   .setTitle("Unban Notice")
      //   .setDescription("**You have been unbanned from attending events from Pickle's Events. Reason: Ban duration over**")
      //   .addField("Rules Not To Break In The Future", "- Do not have a toxic behavior in events \n- Do not post troll suggestions in <#763206772143554590> \n- Do not complain after any events about things that happened. \n- Do not beg for hosts to host events \n- Do not spam chats in roblox events and other events.")
      //   .setFooter("Follow these rules at all times. Not doing so will get you a note leading to permanent ban from events!")
      //   mentioned.send(embed).catch(err => console.log(err))
      //   message.channel.send("Unbanned!")
      //   Notifications.find({
      //     allow: true
      //   }, async (err, data) => {
      //     for(var i = 0;i < data.length; i++){
      //       let user = await message.guild.members.cache.get(data[i].userID)
      //       let embed = new Discord.MessageEmbed()
      //       .setColor("GREEN")
      //       .setTitle("📢 Notification!")
      //       .setDescription("A user was unbanned from events in Pickles Events!")
      //       .addField("Information", `User: ${mentioned.user.tag} \nReason: Ban Duration Over \nPast Ban Reason: 3 Notes \nHost: ${message.author.tag}`)
      //       user.send(embed).catch(err => console.log(err))
      //     }
      //   })
      // }
      if(args[0] == "delnote"){
        if(message.member.roles.cache.some(role => role.name === 'Host') || message.author.id == "521865362145280030" || message.author.id == "745105005513539682"){
          let mentioned =  message.mentions.members.first()
          if(!mentioned){
            message.channel.send("Mention a user!")
          } else{
            let noteNumber = Math.floor(args[1])
            Notes.find({
                  personID: mentioned.user.id
              }, (err, data) => {
                  if(err) console.log(err);
                  if(!data){
                    message.channel.send("No Notes Found for that User!")
                    console.log("Not Banned")
                  } else{
                    console.log("Got Data")
                    console.log(data)
                    if(data[noteNumber - 1]){
                      data[noteNumber - 1].remove().catch(err => console.log(err));
                      message.channel.send("Deleted The note!");
                    } else{
                      message.channel.send("That note does not exist!")
                    }
                  }
            })
          }
        }
      }
      if(args[0] == "hs" || args[0] == "hoststats"){
          if(message.member.roles.cache.some(role => role.name === 'Host') || message.author.id == "521865362145280030" || message.author.id == "745105005513539682"){
  let mentioned =  message.mentions.members.first()
        if(!mentioned){
          HS.findOne({
      userID: message.author.id
  }, (err2, data) => {
      if (err2) console.log(err2)
      if(data){
        let embed = new Discord.MessageEmbed()
  Logs.find({
      userID: message.author.id
  }, (err2, data2) => {
      if (err2) console.log(err2)
      if(data2){
        embed.setColor("RANDOM")
        embed.setTitle(`**__${message.author.username}#${message.author.discriminator}__**'s Host Statistics`)
        embed.addField("Events Hosted (Total)", `\`${data.hosted}\``)
        embed.setThumbnail(message.author.avatarURL())
        embed.setFooter("Started Recording Host Stats on 19th March, 2021")
        embed.addField("Logs", `\`${data2.length}\``, true)
        message.channel.send(embed)
      } else{
                  embed.setColor("RANDOM")
        embed.setTitle(`**__${message.author.username}#${message.author.discriminator}__**'s Host Statistics`)
        embed.addField("Events Hosted (Total)", `\`${data.hosted}\``)
        embed.setThumbnail(message.author.avatarURL())
        embed.setFooter("Started Recording Host Stats on 19th March, 2021")
        embed.addField("Logs", `\`0\``, true)
        message.channel.send(embed)
      }
  })

} else{
        let embed = new Discord.MessageEmbed()

  Logs.find({
      userID: message.author.id
  }, (err2, data2) => {
      if (err2) console.log(err2)
      if(data2){
        embed.addField("Logs", `\`${data2.length}\``)
      } else{
          embed.addField("Logs", `\`0\``)
  
      }
  })
      const newData = new HS({
          host: message.author.username,
          userID: message.author.id,
          hosted: 0
      })
        embed.setColor("RANDOM")
        embed.setTitle(`**__${message.author.username}#${message.author.discriminator}__**'s Host Statistics`)
        embed.addField("Events Hosted (Total)", `\`${newData.hosted}\``)
                embed.setThumbnail(message.author.avatarURL())

        embed.setFooter("Started Recording Host Stats on 19th March, 2021")

      newData.save().catch(err => console.log(err));
        message.channel.send(embed)

      }
  })
  } else{
    if(mentioned.roles.cache.some(role => role.name === 'Host') || mentioned.user.id == "521865362145280030" ||  mentioned.user.id == "745105005513539682"){
HS.findOne({
      userID: mentioned.user.id
  }, (err2, data) => {
      if (err2) console.log(err2)
      if(data){
        let embed = new Discord.MessageEmbed()
  Logs.find({
      userID: mentioned.user.id
  }, (err2, data2) => {
      if (err2) console.log(err2)
      if(data2){
                embed.setColor("RANDOM")
        embed.setTitle(`**__${mentioned.user.username}#${mentioned.user.discriminator}__**'s Host Statistics`)
        embed.addField("Events Hosted (Total)", `\`${data.hosted}\``)
        embed.setThumbnail(mentioned.user.avatarURL())
        embed.setFooter("Started Recording Host Stats on 19th March, 2021")
        embed.addField("Logs", `\`${data2.length}\``, true)
                message.channel.send(embed)

      } else{
          embed.addField("Logs", `\`0\``)
      }
  })
  } else{
        let embed = new Discord.MessageEmbed()

  Logs.find({
      userID: mentioned.user.id
  }, (err2, data2) => {
      if (err2) console.log(err2)
      if(data2){
        embed.addField("Logs", `\`${data2.length}\``)
      } else{
          embed.addField("Logs", `\`0\``)
  
      }
  })
      const newData = new HS({
          host: mentioned.user.username,
          userID: mentioned.user.id,
          hosted: 0
      })
        embed.setColor("RANDOM")
        embed.setTitle(`**__${mentioned.user.username}#${mentioned.user.discriminator}__**'s Host Statistics`)
        embed.addField("Events Hosted (Total)", `\`${newData.hosted}\``)
                embed.setThumbnail(mentioned.user.avatarURL())

        embed.setFooter("Started Recording Host Stats on 19th March, 2021")

      newData.save().catch(err => console.log(err));
        message.channel.send(embed)

      }
  })
    } else{
        let embedPoll = new Discord.MessageEmbed()
        .setDescription(`⛔ That user is not a host!`)
        .setColor('RED')
        message.channel.send(embedPoll);
    }
        
  }

          } else{
                let embedPoll = new Discord.MessageEmbed()
                  .setTitle(`Error`)
                  .setDescription(`⛔ You don't have enough permissions to use this command!.`)
                  .setColor('RED')
                  message.channel.send(embedPoll);
          }
      }
      if(args[0] == "add"){
              if(message.member.roles.cache.some(role => role.name === 'Host')){
                  let mentioned =  message.mentions.members.first()
                  let num = Math.floor(args[1])
                  if(mentioned){
                  Logs.findOne({
                      userID: message.author.id
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                        const unixTimestamp = Math.round((new Date()).getTime() / 1000);

                        const milliseconds = unixTimestamp * 1000 

                        const dateObject = new Date(milliseconds)

                        const humanDateFormat = dateObject.toLocaleString() 
                          const newData = new Logs({
                              host: message.author.username,
                              userID: message.author.id,
                              type: "Wins Added",
                                                            amount: num,

                              winner: mentioned.user.username,
                              winnerID: mentioned.user.id,
                              time: humanDateFormat + " GMT+0"
                          })
                          newData.save().catch(err => console.log(err));
                      } else{
                        const unixTimestamp = Math.round((new Date()).getTime() / 1000);

                        const milliseconds = unixTimestamp * 1000 

                        const dateObject = new Date(milliseconds)

                        const humanDateFormat = dateObject.toLocaleString() 
                          const newData = new Logs({
                              host: message.author.username,
                              userID: message.author.id,
                              type: "Wins Added",
                                                            amount: num,
                              winner: mentioned.user.username,
                              winnerID: mentioned.user.id,
                              time: humanDateFormat + " GMT+0"
                          })
                          newData.save().catch(err => console.log(err));
                      }
                  })
                  console.log(mentioned.user.username)
                  console.log(num)
                  Data.findOne({
                      userID: mentioned.user.id
      
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                          const newData = new Data({
                              name: mentioned.user.username,
                              userID: mentioned.user.id,
                              wins: 0,
                              server: message.guild.id
                          })
                          newData.wins += num
                          newData.save().catch(err => console.log(err));
                          let embedPoll = new Discord.MessageEmbed()
                          .setTitle(`Success`)
                          .setDescription(`✅ ${num} wins has been added to the user. The user now has ${newData.wins} wins!`)
                          .setColor('GREEN')
                          console.log(newData.name + " Success!")
                          if(newData.wins <= 0){
              var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(newData.wins >= 1 && newData.wins < 5){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.add(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(newData.wins >= 5 && newData.wins < 10){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.add(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(newData.wins >= 10 && newData.wins < 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.add(role3);
                mentioned.roles.remove(role4);
            }
            if(newData.wins >= 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.add(role4);
            }
                          message.channel.send(embedPoll);
                      } else {
                          console.log(data)
                          data.wins += num
                          data.save().catch(err => console.log(err));
                          let embedPoll = new Discord.MessageEmbed()
                          .setTitle(`Success`)
                          .setDescription(`✅ ${num} wins has been added to the user. The user now has ${data.wins} wins!`)
                          .setColor('GREEN')
  
                                         if(data.wins <= 0){
              var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 1 && data.wins < 5){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.add(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 5 && data.wins < 10){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.add(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 10 && data.wins < 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.add(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.add(role4);
            }
            Rewards.findOne({
              server: message.guild.id
            }, (err2, data2) => {
              console.log(data2)
              for(var i = 0; i < data2.rewards.length; i++){
                if(data.wins >= i){
                  if(data2.rewards[i] != null && data2.rewards[i] != undefined){
                    var role1 = message.guild.roles.cache.find(role => role.id === data2.rewards[i]);
                    mentioned.roles.add(role1)
                  }
                }
              }
            })
                          message.channel.send(embedPoll);
                          return;
                      }
                  })
                  April.findOne({
                      userID: mentioned.user.id
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                          const newData = new April({
                            name: mentioned.user.username,
                            userID: mentioned.user.id,
                            winsApril: 0,
                            server: message.guild.id
                          })
                          newData.wins += num
                          newData.save().catch(err => console.log(err));
                      } else{
                        data.winsApril += num
                        data.save().catch(err => console.log(err));
                      }
                  })
              
            
              } else{
                  let embedPoll = new Discord.MessageEmbed()
                  .setTitle(`Error`)
                  .setDescription(`⛔ Mention a user!`)
                  .setColor('RED')
                  message.channel.send(embedPoll);
              }
              } 
              else{
                  let embedPoll = new Discord.MessageEmbed()
                  .setTitle(`Error`)
                  .setDescription(`⛔ You don't have enough permissions to use this command!.`)
                  .setColor('RED')
                  message.channel.send(embedPoll);
              }
          }
          else if(args[0] == "printcurrentwins"){
            Data.find({
                server: "758920926514511892"
            }, (err, data) => {
                if(err) console.log(err);
                if(data){
                  message.channel.send("Printed current wins. Poop! :poop:")
                  for(var i = 0; i < data.length; i++){
                    console.log(`"${data[i].userID}": ${data[i].wins},`)
                  }
                }
            })
          }
          else if(args[0] == "wotm"){
            
              let embedPoll = new Discord.MessageEmbed()
              .setTitle(`Winner of the Month!`)
              .addField("March 2021", "<@!778593728767066163>")
              .setColor('GREEN')
              .setImage("https://media.discordapp.net/attachments/759327768831197214/827028505307906079/pog_1.JPG?width=1160&height=564")
              .setFooter("Every month the person with the most wins is awarded the Winner of the month! The person will be displayed on this command itself.")
              message.channel.send(embedPoll);
              let embedPoll2 = new Discord.MessageEmbed()
              .setTitle(`Winner of the Month!`)
              .addField("April 2021", "<@!262823964999417857>")
              .setColor('GREEN')
              .setImage("https://media.discordapp.net/attachments/836195088928604200/838297930149396520/gfx_1.JPG?width=965&height=563")
              .setFooter("Every month the person with the most wins is awarded the Winner of the month! The person will be displayed on this command itself.")
              message.channel.send(embedPoll2)
          }
          if(args[0] == "searchlogs"){
    if(message.member.roles.cache.some(role => role.name === 'Host')){
          let mentioned =  message.mentions.members.first()
          if(!mentioned){
          Logs.find({
              winnerID: args[1]
          }, (err, data) => {
              if(err) console.log(err);
              if(!data){
                message.channel.send("**0 Logs Found**")
              } else{
                console.log(data)
                let us = message.guild.members.cache.find(u => u.id === args[1])
                message.channel.send(`**${data.length} Logs Found**`)
                let embed = new Discord.MessageEmbed()
                .setColor("GREEN")
                if(us){
                embed.setTitle(`${us.user.username}#${us.user.discriminator}'s Winner Logs`)
                embed.setThumbnail(us.user.displayAvatarURL({dynamic : true}))
                }
                embed.setDescription("Here are all the logs for the winner")

                for(var i = 0; i < data.length; i++){
                  let arr = []
                  arr.length = 4
                  arr[0] = "Winner's Id: " + data[i].winnerID
                  arr[1] = "Host: " + data[i].host + "|" + data[i].userID
                  arr[2] = "Log Type: " + data[i].amount + " " + data[i].type
                  arr[3] = "Time: " + data[i].time
                  embed.addField(`Log ${i + 1}`, `\`\`\`${arr[0]} \n${arr[1]} \n${arr[2]} \n${arr[3]}\`\`\``)
                }
                embed.setFooter("Time is set according to GMT+0.")
                message.channel.send(embed);
              }
          })
          } else{
            Logs.find({
              winnerID: mentioned.user.id
          }, (err, data) => {
              if(err) console.log(err);
              if(!data){
                message.channel.send("**0 Logs Found**")
              } else{
                message.channel.send(`**${data.length} Logs Found**`)
                let embed = new Discord.MessageEmbed()
                .setColor("GREEN")
                .setTitle(`${mentioned.user.username}#${mentioned.user.discriminator}'s Winner Logs`)
                .setDescription("Here are all the logs for the winner")
                .setThumbnail(mentioned.user.displayAvatarURL({dynamic : true}))
                for(var i = 0; i < data.length; i++){
                  let arr = []
                  arr.length = 4
                  arr[0] = "Winner's Id: " + data[i].winnerID
                  arr[1] = "Host: " + data[i].host + "|" + data.userID
                  arr[2] = "Log Type: " + data[i].amount + " " + data[i].type
                  arr[3] = "Time: " + data[i].time
                  embed.addField(`Log ${i + 1}`, `\`\`\`${arr[0]} \n${arr[1]} \n${arr[2]} \n${arr[3]}\`\`\``)
                }
                embed.setFooter("Time is set according to GMT+0.")
                message.channel.send(embed);
              }
          })
          }
  }
}

else if(args[0] == "updateroles"){
  if(message.member.roles.cache.some(role => role.name === 'Host')){
    let mentioned = message.mentions.members.first()
    if(!mentioned){
      message.channel.send("Please mention a user!")
    } else{
      Data.findOne({
          userID: mentioned.user.id
      }, (err, data2) => {
          if(err) console.log(err);
          if(!data2){ 
            message.channel.send("No data found for that user!")
          } else{
            if(data2.wins <= 0){
              var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
                            message.channel.send("Updated user's event roles!")
            }
            if(data2.wins >= 1 && data2.wins < 5){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.add(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
                            message.channel.send("Updated user's event roles!")    
            }
            if(data2.wins >= 5 && data2.wins < 10){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.add(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
                            message.channel.send("Updated user's event roles!")    
            }
            if(data2.wins >= 10 && data2.wins < 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.add(role3);
                mentioned.roles.remove(role4);
                            message.channel.send("Updated user's event roles!")    
            }
            if(data2.wins >= 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.add(role4);
                            message.channel.send("Updated user's event roles!")    
            }        
          }
      })  
    }
  } else{
    message.channel.send("You don't have enough permissions to use this command!")
  }
}
          else if(args[0] == "logs"){
              if(message.member.roles.cache.some(role => role.name === 'Host')){
                  let mentioned =  message.mentions.members.first()
                  if(!mentioned){
                  Logs.find({
                      userID: message.author.id
                  }, (err, data2) => {
                      if(err) console.log(err);
                      if(!data2){
                        message.channel.send("**0 Logs Found**")
                      } else{
                        console.log(data2)
                        message.channel.send(`**${data2.length} Logs Found**`)
                        let embed = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setTitle(`${message.author.username}#${message.author.discriminator}'s Host Logs`)
                        .setDescription("Here are the 20 latest logs of the host")
                        .setThumbnail(message.author.displayAvatarURL({dynamic : true}))
                        if(data2.length < 20){
                          for(var i = 0; i < data2.length; i++){
                            let arr = []
                            arr.length = 4
                            arr[0] = "Winner's Id: " + data2[i].winnerID
                            arr[1] = "Log Type: " + data2[i].amount + " " + data2[i].type
                            arr[2] = "Time: " + data2[i].time
                            embed.addField(`Log ${i + 1}`, `\`\`\`${arr[0]} \n${arr[1]} \n${arr[2]}\`\`\` `)
                          }
                        } else{
                          for(var i = data2.length - 1; i >= data2.length - 20; i--){
                            let arr = []
                            arr.length = 4
                            arr[0] = "Winner's Id: " + data2[i].winnerID
                            arr[1] = "Log Type: " + data2[i].amount + " " + data2[i].type
                            arr[2] = "Time: " + data2[i].time
                            embed.addField(`Log ${i + 1}`, `\`\`\`${arr[0]} \n${arr[1]} \n${arr[2]}\`\`\` `)
                          }
                        }

                        embed.setFooter("Time is set according to GMT+0.")
                        message.channel.send(embed);
                      }
                  })
                  } else{
                    Logs.find({
                      userID: mentioned.user.id
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                        message.channel.send("**0 Logs Found**")
                      } else{
                        message.channel.send(`**${data.length} Logs Found**`)
                        let embed = new Discord.MessageEmbed()
                        .setColor("GREEN")
                        .setTitle(`${mentioned.user.username}#${mentioned.user.discriminator}'s Host Logs`)
                        .setDescription("Here are the 20 latest logs of that host.")
                        .setThumbnail(mentioned.user.displayAvatarURL({dynamic : true}))
                        if(data.length < 20){
                          for(var i = 0; i < data.length; i++){
                            let arr = []
                            arr.length = 4
                            arr[0] = "Winner's Id: " + data[i].winnerID
                            arr[1] = "Log Type: " + data[i].amount + " " + data[i].type
                            arr[2] = "Time: " + data[i].time
                            embed.addField(`Log ${i + 1}`, `\`\`\`${arr[0]} \n${arr[1]} \n${arr[2]}\`\`\` `)
                          }
                        } else{
                          var j = 1
                          for(var i = data.length - 1; i >= data.length - 20; i--){
                            let arr = []
                            arr.length = 4
                            arr[0] = "Winner's Id: " + data[i].winnerID
                            arr[1] = "Log Type: " + data[i].amount + " " + data[i].type
                            arr[2] = "Time: " + data[i].time
                            embed.addField(`Log ${i + 1}`, `\`\`\`${arr[0]} \n${arr[1]} \n${arr[2]}\`\`\` `)
                          }
                        }

                        embed.setFooter("Time is set according to GMT+0.")
                        message.channel.send(embed);
                      }
                  })
                  }
              } else{
                  let embedPoll = new Discord.MessageEmbed()
                  .setTitle(`Error`)
                  .setDescription(`⛔ You don't have enough permissions to use this command!.`)
                  .setColor('RED')
                  message.channel.send(embedPoll);                
              }
          }
          else if(args[0] == "remove"){
              if(message.member.roles.cache.some(role => role.name === 'Host')){
                  let mentioned2 =  message.mentions.members.first()
                  let num2 = Math.floor(args[1])

                  Logs.findOne({
                      userID: message.author.id
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                        const unixTimestamp = Math.round((new Date()).getTime() / 1000);

                        const milliseconds = unixTimestamp * 1000 

                        const dateObject = new Date(milliseconds)

                        const humanDateFormat = dateObject.toLocaleString() 
                          const newData = new Logs({
                              host: message.author.username,
                              userID: message.author.id,
                              type: "Wins Removed",
                              amount: num2,
                              winner: mentioned2.user.username,
                              winnerID: mentioned2.user.id,
                              time: humanDateFormat + " GMT+0"
                          })
                          newData.save().catch(err => console.log(err));
                      } else{
                        const unixTimestamp = Math.round((new Date()).getTime() / 1000);

                        const milliseconds = unixTimestamp * 1000 

                        const dateObject = new Date(milliseconds)

                        const humanDateFormat = dateObject.toLocaleString() 
                          const newData = new Logs({
                              host: message.author.username,
                              userID: message.author.id,
                              type: "Wins Removed",
                                                            amount: num2,
                              winner: mentioned2.user.username,
                              winnerID: mentioned2.user.id,
                              time: humanDateFormat + " GMT+0"
                          })
                          newData.save().catch(err => console.log(err));
                      }
                  })
                  console.log(mentioned2.user.username)
                  console.log(num2)
                  Data.findOne({
                      userID: mentioned2.user.id
      
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                          const newData = new Data({
                              name: mentioned2.user.username,
                              userID: mentioned2.user.id,
                              wins: 0,
                              server: message.guild.id
                          })
                          let embedPoll = new Discord.MessageEmbed()
                          .setTitle(`Error`)
                          .setDescription(`⛔ ${num2} wins has not been removed from the user. Reason: The user does not have any wins.`)
                          .setColor('RED')
                          message.channel.send(embedPoll);
                          console.log(newData.name + " Success!")
                      } else {
                          console.log(data)
                          if(data.wins == 0){
                              let embedPoll = new Discord.MessageEmbed()
                              .setTitle(`Error`)
                              .setDescription(`⛔ ${num2} wins has not been removed from the user. Reason: The user does not have any wins.`)
                              .setColor('RED')
                              message.channel.send(embedPoll);
                              return;
                          } else{
                              data.wins -= num2
                              if(data.wins < 0){
                                  data.wins = 0
                              }
                              data.save().catch(err => console.log(err));
                              let embedPoll = new Discord.MessageEmbed()
                              .setTitle(`Success`)
                              .setDescription(`✅ ${num2} wins has been removed from the user. The user now has ${data.wins} wins!`)
                              .setColor('GREEN')
                              if (data.wins <= 0){
              var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 1 && data.wins < 5){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.add(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 5 && data.wins < 10){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.add(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 10 && data.wins < 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.add(role3);
                mentioned.roles.remove(role4);
            }
            if(data.wins >= 15){
                var role1 =  message.guild.roles.cache.find(role => role.id === "815031106323218444");
                var role2 =  message.guild.roles.cache.find(role => role.id === "815031423362531358");
                var role3 =  message.guild.roles.cache.find(role => role.id === "815031674038386748");
                var role4 =  message.guild.roles.cache.find(role => role.id === "815031888674029618");
                mentioned.roles.remove(role1);
                mentioned.roles.remove(role2);
                mentioned.roles.remove(role3);
                mentioned.roles.add(role4);
            }
                              message.channel.send(embedPoll);
  
                          }
                      }
                  })
                  April.findOne({
                      userID: mentioned.user.id
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                          const newData = new April({
                            name: mentioned2.user.username,
                            userID: mentioned2.user.id,
                            winsApril: 0,
                            server: message.guild.id
                          })
                          newData.save().catch(err => console.log(err));
                      } else{
                        if(data.winsApril - num2 <= 0){
                          data.winsApril = 0
                        } else{
                          data.winsApril -= num2
                        }
                        data.save().catch(err => console.log(err));
                      }
                  })
              } else{
                  let embedPoll = new Discord.MessageEmbed()
                  .setTitle(`Error`)
                  .setDescription(`⛔ You don't have enough permissions to use this command!.`)
                  .setColor('RED')
                  message.channel.send(embedPoll);
              }
  
  
           }
           
    if(args[0] == "afk"){
      let content = args.slice(1).join(' ');
      if(content == ""){
          content = "AFK"
      }
      Afk.findOne({
          userID: message.author.id
      }, (err,data2) => {
          if(err) console.log(err);
          if(!data2){
              const newData = new Afk({
                  name: message.author.username,
                  userID: message.author.id,
                  reason: content
              })
              newData.save().catch(err => console.log(err));
              message.channel.send("AFK Set :ok_hand:")
          }
      })
  }
  //        if(args[0] == "tag"){
  //         if(args[1] == "all"){
  //             var list = ""
  //             Tag.find({
  //                 server: message.guild.id
  //             }, (err,data) => {
  //                 if(err) console.log(err)
  //                 for(var i = 0; i < data.length; i++){
  //                     list += `\`\`${data[i].name}\`\` `
  //                 }
  //                 let embedPoll = new Discord.MessageEmbed()
  //                 .setTitle(`All Tags in Pickle Events!`)
  //                 .setDescription(`${list}`)
  //                 .setColor('GREEN')
  //                 message.channel.send(embedPoll);
  //             })
  //         }
  //         if(args[1] == "create"){
  //             if(message.member.roles.cache.some(role => role.name === 'Host') || message.member.roles.cache.some(role => role.name === 'Staff' )){
  //                 let name2 = args[2]
  //                 let content2 = args.slice(3).join(' ');
  //                 console.log(content2)
  //                 Tag.findOne({
  //                     name: name2
  //                 }, (err,data6) => {
  //                     if(err) console.log(err);
  //                     if(!data6){
  //                         const newData = new Tag({
  //                             server: message.guild.id,
  //                             creator: message.author.id,
  //                             name: name2,
  //                             content: content2,
  //                             creator: message.author.id,
  //                             uses: 0
  //                         })
  //                         newData.save().catch(err => console.log(err));
  //                         let embedPoll = new Discord.MessageEmbed()
  //                         .setTitle(`Success`)
  //                         .setDescription(`A new tag with the name ${name2} has been created successfully!`)
  //                         .setColor('GREEN')
  //                         message.channel.send(embedPoll);
  //                         console.log(newData.name + " has been created!")
  //                     } else{
  //                         let embedPoll = new Discord.MessageEmbed()
  //                         .setTitle(`Error`)
  //                         .setDescription(`A tag with that name already exists!`)
  //                         .setColor('RED')
  //                         message.channel.send(embedPoll);
  //                     }
  //                 })
  //             } else{
  //                 let embedPoll = new Discord.MessageEmbed()
  //                 .setTitle(`Error`)
  //                 .setDescription(`You don't have enough permissions to use this command!`)
  //                 .setColor('RED')
  //                 message.channel.send(embedPoll);
  //             }
            
  //         }

  //         else if(args[1] == "delete"){
  //         if(message.member.roles.cache.some(role => role.name === 'Host') || message.member.roles.cache.some(role => role.name === 'Staff' )){
  
  //             let tag = args[2]
  //             Tag.findOne({
  //                 name: tag
  //             }, (err,data2) => {
  //                 if(err) console.log(err);
  //                 if(data2){
  //                     data2.remove().catch(err => console.log(err));
  //                     let embedPoll = new Discord.MessageEmbed()
  //                     .setTitle(`Success`)
  //                     .setDescription(`The has successfully been deleted!`)
  //                     .setColor('GREEN')
  //                     message.channel.send(embedPoll);
  //                 }else{
  //                     let embedPoll = new Discord.MessageEmbed()
  //                     .setTitle(`Error`)
  //                     .setDescription(`That tag doesnt exist!`)
  //                     .setColor('RED')
  //                     message.channel.send(embedPoll);
  //                 }
  //             })
  //         } else{
  
  //               let embedPoll = new Discord.MessageEmbed()
  //                 .setTitle(`Error`)
  //                 .setDescription(`You don't have enough permissions to use this command!`)
  //                 .setColor('RED')
  //                 message.channel.send(embedPoll);
  //         }
  //     }
  //     else if(args[1] == "info"){
  //         let tag = args[2]
          
  //             Tag.findOne({
  //                 name: tag
  //             }, (err,data2) => {
  //                 if(err) console.log(err);
  //                 if(data2){
  //                     let embedPoll = new Discord.MessageEmbed()
  //                     .setTitle(`Tag Information`)
  //                     .setDescription(`All information about the tag.`)
  //                     .addField("Name", `${data2.name}`)
  //                     .addField("Creator", `<@!${data2.creator}>`)
  //                     .addField("Uses",` ${data2.uses}`)
  //                     .setColor('GREEN')
  //                     message.channel.send(embedPoll);
  //                 }else{
  //                     let embedPoll = new Discord.MessageEmbed()
  //                     .setTitle(`Error`)
  //                     .setDescription(`That tag doesnt exist!`)
  //                     .setColor('RED')
  //                     message.channel.send(embedPoll);
  //                 }
  //             })

  //     }
  //     else if(args[1] == "edit"){
  //         if(message.member.roles.cache.some(role => role.name === 'Host') || message.member.roles.cache.some(role => role.name === 'Staff' )){
  
  //             let tag = args[2]
  //             let content2 = args.slice(3).join(' ');
  
  //             Tag.findOne({
  //                 name: tag
  //             }, (err,data2) => {
  //                 if(err) console.log(err);
  //                 if(data2){
  //                     data2.content = content2
  //                     data2.save().catch(err => console.log(err));
  //                     let embedPoll = new Discord.MessageEmbed()
  //                     .setTitle(`Success`)
  //                     .setDescription(`The has successfully been edited!`)
  //                     .setColor('GREEN')
  //                     message.channel.send(embedPoll);
  //                 }else{
  //                     let embedPoll = new Discord.MessageEmbed()
  //                     .setTitle(`Error`)
  //                     .setDescription(`That tag doesnt exist!`)
  //                     .setColor('RED')
  //                     message.channel.send(embedPoll);
  //                 }
  //             })
  //         } else{
  
  //               let embedPoll = new Discord.MessageEmbed()
  //                 .setTitle(`Error`)
  //                 .setDescription(`You don't have enough permissions to use this command!`)
  //                 .setColor('RED')
  //                 message.channel.send(embedPoll);
  //         }
  //     }
  //     else if(args[1] != "all" && args[1] != "create" && args[1] != "delete" && args[1] != "edit" && args[1] != "info" ){
  //           console.log("#general")
  //             let tag = args[1]
  //             Tag.findOne({
  //                 name: tag
  //             }, (err,data2) => {
  //                 if(err) console.log(err);
  //                 if(data2){
  //                     data2.uses += 1
  //                     data2.save().catch(err => console.log(err));
  //                     message.channel.send(data2.content)
  //                 } else{
  //                     let embedPoll = new Discord.MessageEmbed()
  //                     .setTitle(`Error`)
  //                     .setDescription(`That tag doesnt exist!`)
  //                     .setColor('RED')
  //                     message.channel.send(embedPoll);
  //                 }
  //             })
  //         }
      
  // }
  
          if(args[0] == "help"){
            console.log("Reached Help")
              let embed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setTitle("Event Manager - Commands")
              .setDescription("Event Manager Bot is a bot that manages event winners and events in Pickle Events. It has the automatic role assigning with it as well! **Always use the prefix > or /e when using the commands below.**")
              .addField("Help", "```>help \n>botstatus \n@Event Manager```")
              .addField("Ranking","```>wins | >wins @user \n>lb \n>rank | >rank @user \n>wotm```")
              .addField("Hosts", "```>host \n>add <number> @user \n>remove <number> @user  \n>logs | >logs @user \n>searchlogs <userID> | >searchlogs @user \n>hs | >hs @user \n>note @user <note> \n>notes @user \n>updateroles @user \n>updateroles_all \n>delnote <noteNumber> @user \n>ban @user <reason> \n>unban @user \n>notifications on \n>notifications off\n>role_rewards\n>new_role_reward <Wins> <RoleID>\n>remove_role_reward <Wins>```")
              .addField("Status", "```>ssinfo \n>status | >status @user \n>ss <available/unavailable> <description> \n>afk <message>```")
              // .addField("Afk", "```afk <reason>```")
              // .addField("Tags", "```tags, tag create <name> <content>, tag edit <name> <new content>, tag delete <name>, tag all, tag <name>```" )
              // .addField("Image", "```selfie @user, wide @user, winner @user, dance @user```")
              // .addField("Miscellaneous", "```whois | whois @user, sinfo, generate <number>, av, askzep <question>, ping, flipcoin, rolldice, rate <thing>, ```")
              .setThumbnail(client.user.displayAvatarURL({dynamic : true}))
              message.channel.send(embed)
          }
          if(args[0] == "tags"){
              let embed = new Discord.MessageEmbed()
              .setColor("PURPLE")
              .setTitle("Event Manager - Tags")
              .setDescription("Tags easily help you to address new members with things related to the server etc!")
              .addField("create \`\`>tag create <name> <content>\`\`", "Creates a new tag")
              .addField("edit \`\`>tag edit <name> <new content>\`\`", "Edits a tag")
              .addField("delete \`\`>tag delete <name>\`\`", "Deletes a tag")
              .addField("all \`\`>tag all\`\`", "View the list of tags in the server")
                .addField("info \`\`>tag info <name>\`\`", "Get info of a tag")

              .addField("How do I view tags?", "Type \`\`>tag <name>\`\`")
              .setThumbnail(client.user.displayAvatarURL({dynamic : true}))
              message.channel.send(embed)
          }
          
        //         else if(args[0] == "askzep"){
        //     let eightball = require("./8ball.json");
        //     let num = args.slice(1).join(' ');
        //     let random  = Math.floor(Math.random() * eightball.replies.length);
        //     let embed = new Discord.MessageEmbed()
        //     .setColor("RANDOM")
        //     .setTitle("Ask Zep")
        //     .addField("Question/Prediction", `${num}`)
        //     .addField("Zep's Verdict", `:thinking: ${eightball.replies[random]}`)
        //     .setThumbnail("https://www.roblox.com/headshot-thumbnail/image?userId=223038370&width=420&height=420&format=png")
        //     message.channel.send(embed)
        // }
        //  else if(args[0] == "ping"){
        //     message.channel.send(`Pong \`\`${Math.round(client.ws.ping)}ms\`\``);
        // }
        // else if(args[0] == "rolldice"){
        //     let check = Math.floor(Math.random() * 6);
        //     check = check + 1;
        //     let messagee = new Discord.MessageEmbed();
        //     messagee.setColor("GREEN");
        //     if(check == 6){
        //         messagee.setDescription(`🎲 ${message.author.username} rolled a dice and it landed on a ${check}. ${message.author.username} gets to roll again!`)
        //         message.channel.send(messagee);
        //         let a = Math.floor(Math.random() * 6);
        //         a = a + 1
        //         if(a == 6){
        //             message.channel.send("Well you rolled a 6 again. But this time you dont get to roll it again.")
        //         }
        //         else{
        //             messagee.setDescription(`🎲 ${message.author.username} rolled a dice again and it landed on a ${a}.`)
        //             message.channel.send(messagee);
        //         }

        //     }
        //     else{
        //         messagee.setDescription(`🎲 ${message.author.username} rolled a dice and it landed on a ${check}`)
        //         message.channel.send(messagee)
        //     }
        // }
          if(args[0] == "host"){
              if(message.member.roles.cache.some(role => role.name === 'Host')){
                  let embed = new Discord.MessageEmbed()
                  .setColor("PURPLE")
                  .setTitle("Event Manager - Commands")
                  .setDescription("Event Manager Bot is a bot that manages event winners and events in Pickle Events. It has the automatic role assigning with it as well!")
                  .addField("add \`\`>add number\`\`", "Adds wins for a user.")
                  .addField("remove \`\`>remove number\`\`", "Removes a certain amount of wins of a user.")
                  .setThumbnail(client.user.displayAvatarURL({dynamic : true}))
                  message.channel.send(embed)
              } else{
                  let embedPoll = new Discord.MessageEmbed()
                  .setTitle(`Error`)
                  .setDescription(`⛔ You don't have enough permissions to use this command!.`)
                  .setColor('RED')
                  message.channel.send(embedPoll);
              }
          }    
          else if(args == "ssinfo"){
              Profile.findOne({
                  userID: message.author.id
              }, (err, data) => {
                  if(err) console.log(err);
                  if(!data){
                      let SuccessEmbed = new Discord.MessageEmbed();
                      SuccessEmbed.setColor("GREEN")
                      SuccessEmbed.setTitle(`${message.author.username} Status - Setup`);
                      SuccessEmbed.setDescription("You have no status setup yet. Type `>ss <status> <description>`")
                      SuccessEmbed.addField("What is an event status?", "An event status can be setup using Event Manager which tell other people whether you are available for attending events or not")
                      SuccessEmbed.addField("How do I setup my own event status?", "You can do so by typing `>ss <status> <description>`. Never user <> when using the command. In the status field you shall add either `Available` or `Unavailable` and in the description field you can type in any text explaining why you are unavailable/available!")
                      SuccessEmbed.setFooter("Status can also be edited by doing the same.")
                      message.channel.send(SuccessEmbed);
                  } else {
                      let SuccessEmbed = new Discord.MessageEmbed();
                      SuccessEmbed.setColor("GREEN")
                      SuccessEmbed.setTitle(`${message.author.username} Status - Edit`);
                      SuccessEmbed.setDescription("You have a status setup already. Type `>ss <status> <description>` to edit it")
                      SuccessEmbed.addField("What is an event status?", "An event status can be setup using Event Manager which tell other people whether you are available for attending events or not")
                      SuccessEmbed.addField("How do I setup my own event status?", "You can do so by typing `>ss <status> <description>`. Never user <> when using the command. In the status field you shall add either `Available` or `Unavailable` and in the description field you can type in any text explaining why you are unavailable/available!")
                      SuccessEmbed.setFooter("Status can also be edited by doing the same.")
                      message.channel.send(SuccessEmbed);
                  }
              })
          
              
          }
          else if(args[0] == "status"){
              let mentioned =  message.mentions.members.first() 
              if(mentioned){
                  Profile.findOne({
                      userID: mentioned.user.id
      
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
  
                          let SuccessEmbed = new Discord.MessageEmbed();
                          SuccessEmbed.setColor("RED")
                          SuccessEmbed.setTitle(`${mentioned.user.username}'s Event Status`);
                          SuccessEmbed.setDescription(`This user does not have any event status.`);
  
                          message.channel.send(SuccessEmbed)
                      } else {
                          console.log(data)
                          let SuccessEmbed = new Discord.MessageEmbed();
                          SuccessEmbed.setColor("GREEN")
                          SuccessEmbed.setTitle(`${mentioned.user.username}'s Event Status`);
                          if(data.status.includes("available")){
                              SuccessEmbed.addField("✅ Status", `"${data.status}"`)
                          } else if(data.status.includes("un")){
                              SuccessEmbed.addField("⛔ Status", `"${data.status}"`)
                          } else{
                              SuccessEmbed.addField("🔶 Status", `"${data.status}"`)
                          }
                          SuccessEmbed.addField("Description", `"${data.description}"`)
  
                          message.channel.send(SuccessEmbed);
                          return;
                      }
                  })
              }else{
                  Profile.findOne({
                      userID: message.author.id
      
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                          let SuccessEmbed = new Discord.MessageEmbed();
                          SuccessEmbed.setColor("RED")
                          SuccessEmbed.setTitle(`${message.author.username}'s Event Status`);
                          SuccessEmbed.setDescription(`You do not have any event status.`);
                          SuccessEmbed.setFooter("Type `>ssinfo` to change your event status.");
  
                          message.channel.send(SuccessEmbed)
                      } else {
                          console.log(data)
                          let SuccessEmbed = new Discord.MessageEmbed();
                          SuccessEmbed.setColor("GREEN")
                          SuccessEmbed.setTitle(`${message.author.username}'s Event Status`);
                          if(data.status.includes("available")){
                              SuccessEmbed.addField("✅ Status", `"${data.status}"`)
                          } else if(data.status.includes("un")){
                              SuccessEmbed.addField("⛔ Status", `"${data.status}"`)
                          } else{
                              SuccessEmbed.addField("🔶 Status", `"${data.status}"`)
                          }
                          SuccessEmbed.addField("Description", `"${data.description}"`)
  
                          message.channel.send(SuccessEmbed);
                      }
                  })
              }
          }
          else if(args[0] == "ss"){
              let num = args.slice(2).join(' ');
              if(args[1] && args[2]){
                  Profile.findOne({
                      userID: message.author.id
                  }, (err, data) => {
                      if(err) console.log(err);
                      if(!data){
                          let SuccessEmbed = new Discord.MessageEmbed();
                          SuccessEmbed.setColor("GREEN")
                          const newData = new Profile({
                              name: message.author.username,
                              userID: message.author.id,
                              status: args[1],
                              description: num
                          })
                          newData.save().catch(err => console.log(err));
                          SuccessEmbed.setColor("GREEN")
                          SuccessEmbed.setTitle(`Success`);
                          SuccessEmbed.setDescription("You have successfully changed your event status.")
                          message.channel.send(SuccessEmbed);
                      } else {
                          data.status = args[1]
                          data.description = num
                          data.save().catch(err => console.log(err));
                          let SuccessEmbed = new Discord.MessageEmbed()
                          SuccessEmbed.setColor("GREEN")
                          SuccessEmbed.setTitle(`Success`);
                          SuccessEmbed.setDescription("You have successfully changed your event status.")
                          message.channel.send(SuccessEmbed);
                      }
                  })
              
              }
          }
          
          else if(args[0] == "rank"){
              let arr = [];
              let mentioned =  message.mentions.members.first() 
              let canvas = Canvas.createCanvas(934, 282);
            
              if(mentioned){
                  Data.find({
                      server:  "758920926514511892"
                  }, (err, data) => {
                      if(err) console.log(err);
                      for(var i = 0; i < data.length; i++){
                          arr.length++
                          arr[i] = data[i].wins
                      }
                      arr = arr.sort((a,b) => b - a)
                      console.log(arr)
                      var q = [];
                      q = arr.filter(function(item, pos) {
                          return arr.indexOf(item) == pos;
                      })
                      console.log(q);     

                      Data.findOne({
                          userID: mentioned.user.id
                      }, (err2, data2) => {
                          if(err2) console.log(err2);
                          if(!data2){
                              const newData = new Data({
                                  name: mentioned.user.username,
                                  userID:  mentioned.user.id,
                                  wins: 0,
                                  server: message.guild.id
                              })
                              newData.save().catch(err => console.log(err));
                              let SuccessEmbed = new Discord.MessageEmbed();
                              SuccessEmbed.setColor("GREEN")
                              SuccessEmbed.setTitle(`${ mentioned.user.username}'s Rank on the Leaderboard`);
                              SuccessEmbed.addField(`Rank on Leaderboard 🏆`, `Unranked`)
                              .setThumbnail(mentioned.user.displayAvatarURL({dynamic : true}))
                              SuccessEmbed.setFooter("Want to increase your rank? Participate in events in the #events channel!")
                              message.channel.send(SuccessEmbed)
                              return;
                          }
                        
                          for(var j = 0; j < q.length; j++){
                              if(data2.wins == q[j]){
                                  let SuccessEmbed = new Discord.MessageEmbed();
                                  SuccessEmbed.setColor("GREEN")
                                  SuccessEmbed.setAuthor(mentioned.user.username)
                                  .setThumbnail(mentioned.user.displayAvatarURL({dynamic : true}))
                                  SuccessEmbed.addField(`Wins (Total)`, `${data2.wins}`)
                                  SuccessEmbed.addField(`Rank on Leaderboard 🏆`, `#${j + 1}`)
                                  if(mentioned.user.id == "778593728767066163"){
                                    SuccessEmbed.addField(`Winner of The Month 🏆`, `March 2021`)
                                  }
                                  if(mentioned.user.id == "262823964999417857"){
                                    SuccessEmbed.addField(`Winner of The Month 🏆`, `April 2021`)
                                  }
                                  SuccessEmbed.setFooter("Want to increase your rank? Participate in events in the #events channel!")
                                  message.channel.send(SuccessEmbed)
                              }
                          }
                      })
                  })
              } else{
                  Data.find({
                      server:  "758920926514511892"
                  }, (err, data) => {
                      if(err) console.log(err);
                      for(var i = 0; i < data.length; i++){
                          arr.length++
                          arr[i] = data[i].wins
                      }
                      arr = arr.sort((a,b) => b - a)
                      console.log(arr)
                      var q = [];
                      q = arr.filter(function(item, pos) {
                          return arr.indexOf(item) == pos;
                      })
                      console.log(q);     
                      Data.findOne({
                          userID: message.author.id
                      }, (err2, data2) => {
                          if(err2) console.log(err2);
                          if(!data2){
                              const newData = new Data({
                                  name: message.author.username,
                                  userID:  message.author.id,
                                  wins: 0,
                                  server: message.guild.id
                              })
                              newData.save().catch(err => console.log(err));
                              let SuccessEmbed = new Discord.MessageEmbed();
                              SuccessEmbed.setColor("GREEN")
                              SuccessEmbed.setTitle(`${message.author.username}'s Rank on the Leaderboard`);
                              SuccessEmbed.addField(`Rank on Leaderboard 🏆`, `Unranked`)
                              .setThumbnail(message.member.user.displayAvatarURL({dynamic : true}))
                              SuccessEmbed.setFooter("Want to increase your rank? Participate in events in the #events channel!")
                              message.channel.send(SuccessEmbed)
                              return;
                          }
                        
                          for(var j = 0; j < q.length; j++){
                              if(data2.wins == q[j]){
                                  let SuccessEmbed = new Discord.MessageEmbed();
                                  SuccessEmbed.setColor("GREEN")
                                  SuccessEmbed.setAuthor(message.author.username)
                                  .setThumbnail(message.author.displayAvatarURL({dynamic : true}))
                                  SuccessEmbed.addField(`Wins (Total)`, `${data2.wins}`)
                                  SuccessEmbed.addField(`Rank on Leaderboard 🏆`, `#${j + 1}`)
                                  if(message.author.id == "778593728767066163"){
                                    SuccessEmbed.addField(`Winner of The Month 🏆`, `March 2021`)
                                  }
                                  if(message.author.id == "262823964999417857"){
                                    SuccessEmbed.addField(`Winner of The Month 🏆`, `April 2021`)
                                  }
                                  SuccessEmbed.setFooter("Want to increase your rank? Participate in events in the #events channel!")
                                  message.channel.send(SuccessEmbed)
                              }
                          }
                      })
                  })
              }
            
          }
          else if(args[0]== "wins"){
              message.channel.send("**This command has been removed. Please use the `>rank` command to view your wins!**")
          } 
          // else if(args[0] == "addkey(april).shiftall"){
          //   var j = 0
          //   Data.find({
          //       server: "758920926514511892"
          //   }, (err, data) => {
          //     for(var i = 0; i < data.length; i++){
          //       const newe = new April({
          //         name: data[i].name,
          //         userID: data[i].userID,
          //         winsApril: 0,
          //         server: "758920926514511892"
          //       })
          //       j++;
          //       newe.save().catch(err => console.log(err));
          //     }
          //   })
          //   message.channel.send(`Shifted april wins' data to another database for ${j} users in 0.678192 seconds.`)
          // }
          else if(args[0] == "lb"){
              let arr = []
              // embed.addField("🥇 1st Place", `<@!778593728767066163> - 3 win(s)!`)
              // embed.addField("🥈 2nd Place", `<@!464106885683871744> - 2 win(s)!`)
              // embed.addField("🥉 3rd Place", `<@!355850412365971460> - 2 win(s)!`)
                  Data.find({
                      server: "758920926514511892"
                  }, (err, data) => {
                      if(err) console.log(err);
                      for(var i = 0; i < data.length; i++){
                          arr.length++
                          arr[i] = data[i].wins
                      }
                      arr = arr.sort((a,b) => b - a)
                      console.log(arr)
                      var q = [];
                      q = arr.filter(function(item, pos) {
                          return arr.indexOf(item) == pos;
                      })
                      var first = ""
                      var second = ""  
                      var third = ""
                      console.log(q)
                      
                      Data.find({
                          wins: q[0]
                      }, (err2, data2) => {
                          console.log(data2)
                          if(err2) console.log(err)
                          // let embed2 = new Discord.MessageEmbed()
                          if(data2.length < 3){
                              for(var j = 0; j < data2.length; j++){
                                    first += `<@!${data2[j].userID}> `  
                              }
                              // embed2.addField("🥇 1st Place", `${first} - ${data2[0].wins}win(s)!`)
  
                          } else{
                              for(var j = 0; j < 3; j++){
                                    first += `<@!${data2[j].userID}> `  
                              }
                              // embed2.addField("🥇 1st Place", `${first} and many more! - ${data2[0].wins}win(s)!`)
  
                          }
  
                          // embed2.setTitle("Top 3 Most Event Wins")
                              Data.find({
                              wins: q[1]
                          }, (err3, data3) => {
                              if(err3) console.log(err)
                              if(data3.length < 3){
                              for(var j = 0; j < data3.length; j++){
                                    second += `<@!${data3[j].userID}> `  
                              }
                                  // embed2.addField("🥈 2nd Place", `${second} - ${data3[0].wins}win(s)!`)
                                  } else{
                              for(var j = 0; j < 3; j++){
                                    second += `<@!${data3[j].userID}> `  
                              }
                                  // embed2.addField("🥈 2nd Place", `${second} and many more! - ${data3[0].wins}win(s)!`)
      
                              }
      
                      Data.find({
                          wins: q[2]
                      }, (err3, data4) => {
                          if(err3) console.log(err)
                          if(data4.length < 3){
                              for(var j = 0; j < data4.length; j++){
                                    third += `<@!${data4[j].userID}> `  
                              }
                          } else{
                              for(var j = 0; j < 3; j++){
                                    third += `<@!${data4[j].userID}> `  
                              }
                          }
                          let embed2 = new Discord.MessageEmbed()
                          .setTitle("Leaderboard for Most Event Wins - Pickle's Events")
                          .setDescription("Top 3 users on the leaderboard along with their wins.")
                          .setColor("RANDOM")
                          
                          if(data2.length > 3){

                            embed2.addField("🥇 1st Place", `${first} and many more - ${q[0]} win(s)!`)
                          } else{
                            embed2.addField("🥇 1st Place", `${first} - ${q[0]} win(s)!`)
                          }
                          if(data3.length > 3){
                          embed2.addField("🥈 2nd Place", `${second} and many more! - ${q[1]}win(s)!`)

                          } else{
                          embed2.addField("🥈 2nd Place", `${second} - ${q[1]} win(s)!`)
                          }
                          if(data4.length > 3){
                          embed2.addField("🥉 3rd Place", `${third} and many more! - ${q[2]} win(s)!`)
                          } else if(third == ""){
                          embed2.addField("🥉 3rd Place",`No winners yet!`)
                          } else{
                              embed2.addField("🥉 3rd Place", `${third} - ${q[2]} win(s)!`)
                          }
                          embed2.addField("🏆 Winner of the Month March 2021 🏆", "<@!778593728767066163> with 33 wins!")
                          embed2.addField("🏆 Winner of the Month April 2021 🏆", "<@!262823964999417857> with 15 wins!")
                          embed2.setFooter("Want to be on the leaderboard? Participate in fun events and try to win!")
                          message.channel.send(embed2);
                      })
                 
                          })
                      
                      })

                      })
          }
          
  //         else if(args[0] == "selfie"){
  //             let mentioned = message.mentions.members.first();
  //     if(mentioned){
          
  //         let canvas = Canvas.createCanvas(1300, 866);
  //         let ctx = canvas.getContext("2d");
  //         const background = await Canvas.loadImage("https://previews.123rf.com/images/theartofphoto/theartofphoto1708/theartofphoto170800006/83545678-two-young-men-taking-selfie-while-outdoors-point-of-view-of-the-camera-itself.jpg");
  //         ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  //         const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
  //         ctx.drawImage(avatar,250, 150, 300, 300);
  //         const avatar2 = await Canvas.loadImage(mentioned.user.displayAvatarURL({ format: 'jpg' }));
  //         ctx.drawImage(avatar2,620, 240, 300, 300); 
  //         const final = new Discord.MessageAttachment(canvas.toBuffer(), "selfie.jpg")
      
  //         message.channel.send(final);
  //     } else{
  //         message.channel.send("Bruh, mention someone!")
  //     }
  //     }
  //     else if(args[0] == "wide"){
  //         let mentioned = message.mentions.members.first();
  //         if(mentioned){
              
  //             let canvas = Canvas.createCanvas(1120, 400);
  //             let ctx = canvas.getContext("2d");
  //             const background = await await Canvas.loadImage(mentioned.user.displayAvatarURL({ format: 'jpg' }));
  //             ctx.drawImage(background, 0, 0, canvas.width, canvas.height)            
  //             const final = new Discord.MessageAttachment(canvas.toBuffer(), "wide.jpg")
  //             message.channel.send(final);
  //         } else{
  //             message.channel.send("Bruh, mention someone!")
  //         }
  //     }
  //     else if(args[0] == "winner"){
  //         let mentioned = message.mentions.members.first();
  //         if(mentioned){
              
  //             let canvas = Canvas.createCanvas(1300, 975);
  //             let ctx = canvas.getContext("2d");
  //             const background = await Canvas.loadImage("https://previews.123rf.com/images/abluecup/abluecup1209/abluecup120901875/15429888-podium-win-three-people-standing-on-the-podium.jpg                          ");
  //             ctx.drawImage(background, 0, 0, canvas.width, canvas.height)            
  //             const avatar = await await Canvas.loadImage(mentioned.user.displayAvatarURL({ format: 'jpg' }));
  //             ctx.drawImage(avatar, 560, 70, 200, 200)            
  //             const final = new Discord.MessageAttachment(canvas.toBuffer(), "wide.jpg")
  //             message.channel.send(final);
  //         } else{
  //             message.channel.send("Bruh, mention someone!")
  //         }
  //     }
  //     else if(args[0] == "dance"){
  //     let attachment = new Discord.MessageAttachment("./dance1.gif")
  //     message.reply(attachment)   
  // }        
   }  

})
keepAlive();
client.login(process.env.TOKEN)
 