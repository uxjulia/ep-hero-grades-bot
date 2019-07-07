const Database = require("../Database");
const { getHeroName, log } = require("../utils");

function sendTitanGrades(message, data) {
  console.log("in sendTitanGrades >", data);
  message.channel
    .send(
      `Here are ${data.heroName}'s **titan** grades:

**Stamina**: ${data.stamina}
**Passive**: ${data.passive}
**Direct**: ${data.direct}
**Tiles**: ${data.tiles}
**Versatility**: ${data.versatility}
__
${data.heroName}'s overall **titan** grade is **${data.overallGrade}**`
    )
    .then(() => log(`Successfully retrieved titan data for ${data.heroName}`))
    .catch(error => console.error(error.message));
}

module.exports = {
  name: "titan",
  description: "Get titan grades",
  args: true,
  async execute(message, args) {
    if (args.length) {
      const hero = getHeroName(args);
      Database.fetchTitanGrade(hero, message)
        .then(stats => {
          sendTitanGrades(message, stats);
        })
        .catch(err => console.error(err));
    }
  }
};
