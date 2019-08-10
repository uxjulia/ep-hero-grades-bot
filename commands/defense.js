const ServiceHandler = require("../services");
const { getHeroName, log } = require("../utils");

function getDefenseMessage(data) {
  const message = `Here are ${data.heroName}'s **defense** grades:

**Speed**: ${data.speed}
**Effect**: ${data.effect}
**Stamina**: ${data.stamina}
**Strength**: ${data.strength}
**Tank**: ${data.tank}
**Support**: ${data.support}
__
${data.heroName}'s overall **defense** grade is **${data.overallGrade}**`;
  return message;
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
            const defenseMessage = getDefenseMessage(stats);
            res(defenseMessage);
          })
          .catch(err => {
            rej(err);
          });
      }
    });
  }
};
