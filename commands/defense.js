const ServiceHandler = require("../services");
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
    .then(() => log(`Successfully sent defense data for ${data.heroName}`))
    .catch(error => console.error(error.message));
}

module.exports = {
  name: "defense",
  description: "Get defense grades",
  args: true,
  execute: async function(message, args) {
    return new Promise((res, rej) => {
      if (args.length) {
        const hero = getHeroName(args);
        const Service = new ServiceHandler(hero, "defense");
        Service.getData()
          .then(stats => {
            sendDefenseGrade(message, stats);
            res();
          })
          .catch(err => {
            message.reply(err);
            rej(err);
          });
      }
    });
  }
};
