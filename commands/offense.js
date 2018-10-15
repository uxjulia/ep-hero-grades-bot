const Database = require('../Database')

module.exports = {
  name: 'offense',
  description: 'Get offense grades for a hero',
  args: true,
  execute(message, args) {
    console.log('executing offense..', args)
    if (args.length) {
      const input = args.length >= 2 ? args[0].concat(' ', args[1]) : args[0]
      const hero = input.toLowerCase()
      Database.getOffense(hero, message)
    }
  },
}