const fs = require('fs')
const Discord = require('discord.js')
const {prefix, token} = require('../config.json')

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

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'general')
  // Do nothing if the channel wasn't found on this server
  if (!channel) return
  // Send the message, mentioning the member
  channel.send(`Welcome to the ${member.guild.name} Discord server, ${member}! Be sure to check out the #welcome channel for helpful server information.`)
})

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return
  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()
  if (!client.commands.has(commandName)) return
  const command = client.commands.get(commandName)
  try {
    console.log(`Executing command: ${command} ...`)
    command.execute(message, args)
  }
  catch (error) {
    console.error(error)
    message.reply(errorResponse)
  }
})

client.login(token)
