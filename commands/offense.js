var Airtable = require('airtable')
var base = new Airtable({apiKey: process.env.AIRTABLEAPI}).base(process.env.AIRTABLEBASE)
const Logger = require('../Logger')

module.exports = {
  name: 'offense',
  description: 'Get offense grades',
  execute(message, hero) {
    let count = 0
    base('Offense Grades').select({
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
          data.war = record.get('War')
          data.versatility = record.get('Versatility')

          if (data.heroName.toLowerCase() === hero) {
            count++
            console.log('Retrieved', data.heroName)
            message.reply(
              `Here are ${data.heroName}'s **offense** grades:

            **Speed**: ${data.speed}
            **Effect**: ${data.effect}
            **Stamina**: ${data.stamina}
            **Versatility**: ${data.versatility}
            **War**: ${data.war}
            __
            ${data.heroName}'s overall **offense** grade is **${data.overallGrade}**`
            )
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