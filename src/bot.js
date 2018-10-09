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
  const hero = message.content.substr(prefix.length + command.length).trim().toLowerCase()
  try {
    console.log(`Executing command: ${command} ...`)
    client.commands.get(command).execute(message, hero)
  }
  catch (error) {
    console.error(error)
    message.reply(errorResponse)
  }
})

client.login(token)
