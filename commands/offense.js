const ServiceHandler = require("../services");
const { getHeroName, log } = require("../utils");

function getOffenseMessage(data) {
  const message = `Here are ${data.heroName}'s **offense** grades:

**Speed**: ${data.speed}
**Effect**: ${data.effect}
**Stamina**: ${data.stamina}
**Versatility**: ${data.versatility}
**War**: ${data.war}
__
${data.heroName}'s overall **offense** grade is **${data.overallGrade}**`;
  return message;
}

module.exports = {
  name: "offense",
  description: "Get offense grades for a hero",
  args: true,
  execute: async function(message, args) {
    return new Promise((res, rej) => {
      if (args.length) {
        const hero = getHeroName(args);
        const Service = new ServiceHandler(hero, "offense");
        Service.getData()
          .then(stats => {
            const offenseMessage = getOffenseMessage(stats);
            res(offenseMessage);
          })
          .catch(err => {
            rej(err);
          });
      }
    });
  }
};
