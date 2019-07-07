const Database = require("../Database");
const { getHeroName, log } = require("../utils");

function sendDefenseGrade(message, data) {
  message.channel
    .send(
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
    .then(() => log(`Successfully retrieved defense data for ${data.heroName}`))
    .catch(error => console.error(error.message));
}

module.exports = {
  name: "defense",
  description: "Get defense grades",
  args: true,
  async execute(message, args) {
    if (args.length) {
      const hero = getHeroName(args);
      Database.fetchDefenseGrade(hero, message)
        .then(stats => {
          sendDefenseGrade(message, stats);
        })
        .catch(err => console.error(err));
    }
  }
};
