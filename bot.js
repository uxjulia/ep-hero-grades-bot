require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const prefix = process.env.PREFIX
const token = process.env.TOKEN
const {log} = require('./Utils')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.once('ready', () => {
  log(`Ready!`)
})

client.on('guildMemberAdd', member => {
  // Do nothing if the member added is a bot.
  if (member.user.bot) return;

  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'general')
  const welcomeChannel = member.guild.channels.find(ch => ch.name === 'welcome')

  // Do nothing if the channels are not found on this server
  if (!channel || !welcomeChannel) return;

  // Send the message, mentioning the member
  channel.send(`Welcome to the ${member.guild.name} Discord server, ${member}! Be sure to check out the ${welcomeChannel} channel for helpful server information.`)
})

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return
  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return
  try {
    log(`Executing command ${command.name.toUpperCase()} initiated from server: ${message.guild.name.toUpperCase()} in channel: ${message.channel.name.toUpperCase()}`)
    command.execute(message, args)
  }
  catch (err) {
    log(`Something went wrong while executing the command: ${command}`)
    log(err);
  }
})

client.login(token).then(() => log('Successfully logged in')).catch(error => console.error(error))
