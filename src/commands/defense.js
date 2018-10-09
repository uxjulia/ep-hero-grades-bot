var Airtable = require('airtable')
const {airtableApi, airtableBase} = require('../../config.json')
var base = new Airtable({apiKey: airtableApi}).base(airtableBase)
const Logger = require('../Logger')

module.exports = {
  name: 'defense',
  description: 'Get defense grades',
  execute(message, hero) {
    let count = 0
    base('Defense Grades').select({
      view: 'Grid view',
      filterByFormula: `TRUE({Hero} = '${hero}')`,
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          const data = {}
          data.heroName = record.get('Hero')
          data.overallGrade = record.get('Overall')
          data.speed = record.get('Speed')
          data.effect = record.get('Effect')
          data.stamina = record.get('Stamina')
          data.strength = record.get('Strength')
          data.tank = record.get('Tank')
          data.support = record.get('Support')

          if (data.heroName.toLowerCase() === hero) {
            count++
            Logger.success['defense'](message, data)
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