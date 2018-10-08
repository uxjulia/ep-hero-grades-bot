module.exports = {
  success: {
    info: function (message, data) {
      console.log('Succesfully retrieved info for', data.heroName)
      message.reply(
        `Here's some information on ${data.heroName}:
  
          **Element**: ${data.element}
          **Stars**: ${data.stars}
          **Limited Availability?**: ${data.limited}

          __
          ${data.heroName}'s overall grade is **${data.overallGrade}**`
      )
    },
    titan: function (message, data) {
      console.log('Succesfully retrieved titan data for', data.heroName)
      message.reply(
        `Here are ${data.heroName}'s **titan** grades:

              **Stamina**: ${data.stamina}
              **Passive**: ${data.passive}
              **Direct**: ${data.direct}
              **Tiles**: ${data.tiles}
              **Versatility**: ${data.versatility}
              __
              ${data.heroName}'s overall **titan** grade is **${data.overallGrade}**`
      )
    },
    defense: function (message, data) {
      console.log('Succesfully retrieved defense data for', data.heroName)
      message.reply(
        `Here are ${data.heroName}'s **defense** grades:

            **Speed**: ${data.speed}
            **Effect**: ${data.effect}
            **Stamina**: ${data.stamina}
            **Strength**: ${data.strength}
            **Tank**: ${data.tank}
            **Support**: ${data.support}
            __
            ${data.heroName}'s overall **defense** grade is **${data.overallGrade}**`
      )
    },
    offense: function (message, data) {

    }
  },
  error(data) {
    console.error(`An error occurred while retrieving ${data}`)
  },
  noData(message, data) {
    console.err(`No record found for ${data}`)
    message.reply('Uh oh. I can\'t seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains.')
  }
}