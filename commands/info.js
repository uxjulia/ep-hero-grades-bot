const ServiceHandler = require("../services");
const { getHeroName, log } = require("../utils");

function sendInfo(message, data) {
  let family = data.family !== undefined ? data.family : "N/A";
  message.channel
    .send(
      `Here's some information on ${data.heroName}:
**Element**: ${data.element}
**Stars**: ${data.stars}
**Limited Availability?**: ${data.limited}
**Class**: ${data.class}
**Atlantis Family**: ${family}

**Power**: ${data.power}  |  **Attack**: ${data.attack}  |  **Defense**: ${
        data.defense
      }  |  **Health**: ${data.health}
**Special Skill**: ${data.specialName}
**Mana Speed:** ${data.mana}
${data.special}

Titan grade: **${data.oTitan}**
Defense grade: **${data.oDefense}**
Offense grade: **${data.oOffense}**
__
${data.heroName}'s overall grade is **${data.overallGrade}**`
    )
    .then(() => log(`Successfully sent info for ${data.heroName}`))
    .catch(error => console.error(error.message));
}

module.exports = {
  name: "info",
  description: "Get basic hero info",
  args: true,
  execute: async function(message, args) {
    return new Promise((res, rej) => {
      if (args.length) {
        const hero = getHeroName(args);
        const Service = new ServiceHandler(hero, "info");
        Service.getData()
          .then(stats => {
            sendInfo(message, stats);
            res();
          })
          .catch(err => {
            rej(err);
          });
      }
    });
  }
};
