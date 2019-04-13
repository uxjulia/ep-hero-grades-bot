const {log} = require('../Utils');

const data = {
  fire: '20-4, 19-6, 19-4, 11-6, 6-8',
  ice: '8-7',
  nature: '7-5',
  holy: '10-6, 12-9',
  dark: '7-4'
}

module.exports = {
  name: 'levels',
  aliases: 'level',
  description: 'Get best levels for filling elemental chests',
  args: true,
  execute(message, args) {
    let element = args[0].toUpperCase();
    let levels = data[args[0].toLowerCase()];
    message.channel.send(`Best level(s) for ${element} monsters: ${levels}`)
      .then(() => log(`Successfully sent reply for ${element} monsters`))
      .catch(error => console.error(error.message))
  }
}