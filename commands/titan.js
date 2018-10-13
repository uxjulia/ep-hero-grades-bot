var Airtable = require('airtable')
var base = new Airtable({apiKey: process.env.AIRTABLEAPI}).base(process.env.AIRTABLEBASE)
const Logger = require('../Logger')

module.exports = {
  name: 'titan',
  description: 'Get titan grades',
  execute(message, hero) {
    let count = 0
    base('Titan Grades').select({
      view: 'Grid view',
      filterByFormula: `TRUE({Hero} = '${hero}')`,
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          const data = {}
          data.heroName = record.get('Hero')
          data.overallGrade = record.get('Overall')
          data.stamina = record.get('Stamina')
          data.passive = record.get('Passive')
          data.direct = record.get('Direct')
          data.tiles = record.get('Tiles')
          data.versatility = record.get('Versatility')

          if (data.heroName.toLowerCase() === hero) {
            count++
            Logger.success['titan'](message, data)
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