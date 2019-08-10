const ServiceHandler = require("../services");
const { getHeroName, log } = require("../utils");

function getTitanMessage(data) {
  return `Here are ${data.heroName}'s **titan** grades:

**Stamina**: ${data.stamina}
**Passive**: ${data.passive}
**Direct**: ${data.direct}
**Tiles**: ${data.tiles}
**Versatility**: ${data.versatility}
__
${data.heroName}'s overall **titan** grade is **${data.overallGrade}**`;
}

module.exports = {
  name: "titan",
  description: "Get titan grades",
  args: true,
  execute: async function(message, args) {
    return new Promise((res, rej) => {
      if (args.length) {
        const hero = getHeroName(args);
        const Service = new ServiceHandler(hero, "titan");
        Service.getData()
          .then(stats => {
            const titanMessage = getTitanMessage(stats);
            res(titanMessage);
          })
          .catch(err => {
            rej(err);
          });
      }
    });
  }
};
