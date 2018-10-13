var Airtable = require('airtable')
var base = new Airtable({apiKey: process.env.AIRTABLEAPI}).base(process.env.AIRTABLEBASE)
const Logger = require('../Logger')

function getRecord(heroName, id, message) {
  base('Overview').find(id, function (err, record) {
    if (err) {
      console.error(err)
      return
    }
    const data = {}
    data.heroName = heroName
    data.overallGrade = record.get('Overall')
    data.oTitan = record.get('Overall Titan')
    data.oDefense = record.get('Overall Defense')
    data.oOffense = record.get('Overall Offense')
    data.element = record.get('Element')
    data.stars = record.get('Stars')
    data.power = record.get('Power')
    data.attack = record.get('Attack')
    data.defense = record.get('Defense')
    data.health = record.get('Health')
    data.special = record.get('Special')
    data.specialName = record.get('Special Name')
    data.mana = record.get('Mana')
    data.limited = record.get('Limited') === 'TRUE' ? 'Yes' : 'No'
    Logger.success['info'](message, data)
  })
}

module.exports = {
  name: 'info',
  description: 'Get basic hero info',
  args: true,
  execute(message, args) {
    if (args.length) {
      const input = args.length >= 2 ? args[0].concat(' ', args[1]) : args[0]
      const hero = input.toLowerCase()
      let count = 0
      base('Heroes').select({
        view: 'Grid view',
        filterByFormula: `TRUE({Name} = '${hero}')`,
      }).eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            let heroName = record.get('Name')
            if (heroName.toLowerCase() === hero) {
              count++
              const id = record.get('Stats')
              getRecord(heroName, id, message)
            }
          })
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            Logger.error(hero, err)
            return err
          }
          if (count === 0) {
            Logger.noData(message, hero)
          }
        }
      )
    }
  },
}