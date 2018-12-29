const info = function (message, data) {
  message.channel.send(
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
  ).then(() => console.log('Successfully retrieved info for', data.heroName))
  .catch(error => console.error(error.message));
};

const titan = function (message, data) {
  message.channel.send(
    `Here are ${data.heroName}'s **titan** grades:

**Stamina**: ${data.stamina}
**Passive**: ${data.passive}
**Direct**: ${data.direct}
**Tiles**: ${data.tiles}
**Versatility**: ${data.versatility}
__
${data.heroName}'s overall **titan** grade is **${data.overallGrade}**`
  )
    .then(() => console.log('Successfully retrieved titan data for', data.heroName))
    .catch(error => console.error(error.message));
};

const defense = function (message, data) {
  message.channel.send(
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
    .then(() => console.log('Successfully retrieved defense data for', data.heroName))
    .catch(error => console.error(error.message));
};

const offense = function (message, data) {
  message.channel.send(
    `Here are ${data.heroName}'s **offense** grades:

**Speed**: ${data.speed}
**Effect**: ${data.effect}
**Stamina**: ${data.stamina}
**Versatility**: ${data.versatility}
**War**: ${data.war}
__
${data.heroName}'s overall **offense** grade is **${data.overallGrade}**`
  )
  .then(() => console.log('Successfully retrieved offense data for', data.heroName))
  .catch(error => console.error(error.message));
};

const withImage = function(image, message, isUpdated) {
  console.log('Successfully retrieved image')
  const messageWithNote = 'Note: This image needs to be updated'
  return isUpdated===false ? message.channel.send(messageWithNote, image) : message.channel.send(image)
};

const success = {info, titan, defense, offense, withImage };

const error =  function(hero, err, message) {
  if (message) {
    message.channel.send(`An error occurred while retrieving ${hero}`)
    .then(() => console.log(`An error occurred while retrieving ${hero} with error: ${err}`))
    .catch(error => console.error(error.message));
  }
};

const noData = function(message, data) {
  console.error(`No record found for ${data}`)
  message.reply('Uh oh. I can\'t seem to find that hero. If I should know this hero, please let my master <@!342706933389852672> know to add this hero.')
  .then(() => console.log(`Successfully responded to channel with error message`))
  .catch(error => console.error(error.message));
};

module.exports = { success, error, noData };
