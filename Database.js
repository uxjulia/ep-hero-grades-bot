// import Airtable from 'airtable'
var Airtable = require('airtable')
const {airtableApi, airtableBase} = require('../config.json')
var base = new Airtable({apiKey: airtableApi}).base(airtableBase)

function getTitanGrade(hero, message) {
  let count = 0
  base('Titan Grades').select({
    view: 'Grid view',
    filterByFormula: `TRUE({Hero} = '${hero}')`,
    fields: [
      'Hero',
      'Stamina',
      'Passive',
      'Direct',
      'Tiles',
      'Versatility',
      'Overall'
    ]
  }).eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        const heroName = record.get('Hero')
        const overallGrade = record.get('Overall')
        const stamina = record.get('Stamina')
        const passive = record.get('Passive')
        const direct = record.get('Direct')
        const tiles = record.get('Tiles')
        const versatility = record.get('Versatility')

        if (heroName.toLowerCase() === hero) {
          count++
          console.log('Retrieved', heroName)
          message.reply(
            `Here are ${heroName}'s **titan** grades:

          **Stamina**: ${stamina}
          **Passive**: ${passive}
          **Direct**: ${direct}
          **Tiles**: ${tiles}
          **Versatility**: ${versatility}
          __
          ${heroName}'s overall **titan** grade is **${overallGrade}**`
          )
        }
      })

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage()
    },
    function done(err) {
      if (err) {
        console.error(err)
        return err
      }
      if (count === 0) {
        message.reply(
          'Uh oh. I can\'t seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains.'
        )
      }
    }
  )
}

function getOffenseGrade(hero, message) {
  let count = 0
  base('Offense Grades').select({
    view: 'Grid view',
    filterByFormula: `TRUE({Hero} = '${hero}')`,
    fields: [
      'Hero',
      'Speed',
      'Effect',
      'Stamina',
      'War',
      'Versatility',
      'Overall'
    ]
  }).eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        const heroName = record.get('Hero')
        const overallGrade = record.get('Overall')
        const speed = record.get('Speed')
        const effect = record.get('Effect')
        const stamina = record.get('Stamina')
        const war = record.get('War')
        const versatility = record.get('Versatility')

        if (heroName.toLowerCase() === hero) {
          count++
          console.log('Retrieved', heroName)
          message.reply(
            `Here are ${heroName}'s **offense** grades:

            **Speed**: ${speed}
            **Effect**: ${effect}
            **Stamina**: ${stamina}
            **Versatility**: ${versatility}
            **War**: ${war}
            __
            ${heroName}'s overall **offense** grade is **${overallGrade}**`
          )
        }
      })
      fetchNextPage()
    },
    function done(err) {
      if (err) {
        console.error(err)
        return err
      }
      if (count === 0) {
        message.reply(
          'Uh oh. I can\'t seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains.'
        )
      }
    }
  )
}

function getDefenseGrade(hero, message) {
  let count = 0
  base('Defense Grades').select({
    view: 'Grid view',
    filterByFormula: `TRUE({Hero} = '${hero}')`,
    fields: [
      'Hero',
      'Speed',
      'Effect',
      'Stamina',
      'Strength',
      'Tank',
      'Support',
      'Overall'
    ]
  }).eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        const heroName = record.get('Hero')
        const overallGrade = record.get('Overall')
        const speed = record.get('Speed')
        const effect = record.get('Effect')
        const stamina = record.get('Stamina')
        const strength = record.get('Strength')
        const tank = record.get('Tank')
        const support = record.get('Support')

        if (heroName.toLowerCase() === hero) {
          count++
          console.log('Retrieved', heroName)
          message.reply(
            `Here are ${heroName}'s **defense** grades:

            **Speed**: ${speed}
            **Effect**: ${effect}
            **Stamina**: ${stamina}
            **Strength**: ${strength}
            **Tank**: ${tank}
            **Support**: ${support}
            __
            ${heroName}'s overall **defense** grade is **${overallGrade}**`
          )
        }
      })
      fetchNextPage()
    },
    function done(err) {
      if (err) {
        console.error(err)
        return err
      }
      if (count === 0) {
        message.reply(
          'Uh oh. I can\'t seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains.'
        )
      }
    }
  )
}

function getInfo(hero, message) {
  let count = 0
  base('Heroes').select({
    view: 'Grid view',
    filterByFormula: `TRUE({Hero} = '${hero}')`,
    fields: ['Hero', 'Element', 'Stars', 'Limited', 'Overall']
  }).eachPage(
    function page(records, fetchNextPage) {
      records.forEach(function (record) {
        const heroName = record.get('Hero')
        const overallGrade = record.get('Overall')
        const element = record.get('Element')
        const stars = record.get('Stars')
        const limited = record.get('Limited') === 'TRUE' ? 'Yes' : 'No'

        if (heroName.toLowerCase() === hero) {
          count++
          console.log('Retrieved', heroName)
          message.reply(
            `Here's some information on ${heroName}:

              **Element**: ${element}
              **Stars**: ${stars}
              **Limited Availability?**: ${limited}

              __
              ${heroName}'s overall grade is **${overallGrade}**`
          )
        }
      })
      fetchNextPage()
    },
    function done(err) {
      if (err) {
        console.error(err)
        return err
      }
      if (count === 0) {
        message.reply(
          'Uh oh. I can\'t seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains.'
        )
      }
    }
  )
}

module.exports = {getTitanGrade, getOffenseGrade, getDefenseGrade, getInfo}