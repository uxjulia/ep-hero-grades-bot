const Discord = require('discord.js');
const Canvas = require('canvas');

const canvas = Canvas.createCanvas(432, 680);
const ctx = canvas.getContext('2d');


module.exports = {
  success: {
    info: function (message, data) {
      console.log('Successfully retrieved info for', data.heroName)
      message.reply(
        `Here's some information on ${data.heroName}:
        **Element**: ${data.element}
        **Stars**: ${data.stars}
        **Limited Availability?**: ${data.limited}
        **Power**: ${data.power}  |  **Attack**: ${data.attack}  |  **Defense**: ${data.defense}  |  **Health**: ${data.health}
        **Special Skill**: ${data.specialName}
        **Mana Speed:** ${data.mana}
        ${data.special}
        
        Titan grade: **${data.oTitan}**
        Defense grade: **${data.oDefense}**
        Offense grade: **${data.oOffense}**
        __
        ${data.heroName}'s overall grade is **${data.overallGrade}**`
      )
    },
    titan: function (message, data) {
      console.log('Successfully retrieved titan data for', data.heroName)
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
      console.log('Successfully retrieved defense data for', data.heroName)
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
      console.log('Successfully retrieved offense data for', data.heroName)
      message.reply(
        `Here are ${data.heroName}'s **offense** grades:

        **Speed**: ${data.speed}
        **Effect**: ${data.effect}
        **Stamina**: ${data.stamina}
        **Versatility**: ${data.versatility}
        **War**: ${data.war}
        __
        ${data.heroName}'s overall **defense** grade is **${data.overallGrade}**`
      )
    },
    withImage: function(image, message, isUpdated) {
      console.log('Successfully retrieved image')
      const messageWithNote = 'Note: This image needs to be updated'
      return isUpdated===false ? message.reply(messageWithNote, image) : message.reply(image)
    }
  },
  error(data) {
    console.error(`An error occurred while retrieving ${data}`)
  },
  noData(message, data) {
    console.error(`No record found for ${data}`)
    message.reply('Uh oh. I can\'t seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains.')
  }
}
