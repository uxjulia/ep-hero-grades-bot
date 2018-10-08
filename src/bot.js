const fs = require('fs')
const Discord = require('discord.js')
const {prefix, token} = require('../config.json')
const Database = require('./Database')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

const errorResponse = 'Uh oh. Something went wrong with my robot innards'

client.on('ready', () => {
  console.log(`Ready!`)
})

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()
  if (!client.commands.has(command)) return

  try {
    client.commands.get(command).execute(message, args)
  }
  catch (error) {
    console.error(error)
    message.reply(errorResponse)
  }

  // if (message.content.startsWith("!titan")) {
  //   const hero = message.content
  //     .substr(6)
  //     .trim()
  //     .toLowerCase();
  //   console.log(`The hero requested is: ${hero}`);
  //   try {
  //     Database.getTitanGrade(hero, message);
  //   } catch (err) {
  //     message.reply(errorResponse);
  //   }
  // }
  // if (message.content.startsWith("!offense")) {
  //   const hero = message.content
  //     .substr(8)
  //     .trim()
  //     .toLowerCase();
  //   console.log(`The hero named is: ${hero}`);
  //   try {
  //     Database.getOffenseGrade(hero, message);
  //   } catch (err) {
  //     message.reply(errorResponse);
  //   }
  // }
  // if (message.content.startsWith("!defense")) {
  //   const hero = message.content
  //     .substr(8)
  //     .trim()
  //     .toLowerCase();
  //   console.log(`The hero named is: ${hero}`);
  //   try {
  //     Database.getDefenseGrade(hero, message);
  //   } catch (err) {
  //     message.reply(errorResponse);
  //   }
  // }
  // if (message.content.startsWith("!info")) {
  //   const hero = message.content.substr(5).trim().toLowerCase();
  //   console.log(`The hero named is: ${hero}`);
  //   try {
  //     Database.getInfo(hero, message);
  //   } catch (err) {
  //     message.reply(errorResponse);
  //   }
  // }
})

client.login(token)
