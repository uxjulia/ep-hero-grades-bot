const Database = require('../Database')

module.exports = {
  name: 'info',
  description: 'Get basic hero info',
  args: true,
  execute(message, args) {
    if (args.length) {
      const input = args.length >= 2 ? args[0].concat(' ', args[1]) : args[0]
      const hero = input.toLowerCase()
      Database.getInfo(hero, message)
    }
  },
}