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

client.on('message', message => {
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()
  if (commandName.length === 0) return // Exit if an empty command was sent

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return
  try {
    log(`Executing command ${command.name.toUpperCase()} initiated from server: ${message.guild.name.toUpperCase()} in channel: ${message.channel.name.toUpperCase()}`)
    if (command.args === true && !args.length) {
      return message.channel.send("No arguments were provided for this command. Please try again")
    }
    command.execute(message, args)
  }
  catch (err) {
    log(`Something went wrong while executing the command: ${command}`)
    log(err);
  }
})

client.login(token).then(() => log('Successfully logged in')).catch(error => console.error(error))
