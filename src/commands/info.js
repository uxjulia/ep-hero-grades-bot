var Airtable = require('airtable')
const {airtableApi, airtableBase} = require('../../config.json')
var base = new Airtable({apiKey: airtableApi}).base(airtableBase)
const Logger = require('../Logger')

module.exports = {
  name: 'info',
  description: 'Get basic hero info',
  execute(message, hero) {
    let count = 0
    base('Heroes').select({
      view: 'Grid view',
      filterByFormula: `TRUE({Hero} = '${hero}')`,
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          const data = {}
          data.heroName = record.get('Hero')
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

          if (data.heroName.toLowerCase() === hero) {
            count++
            Logger.success['info'](message, data)
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
}