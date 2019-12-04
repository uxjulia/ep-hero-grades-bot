const ServiceHandler = require("../services");
const { getHeroName, log } = require("../utils");

async function getInfoMessage(data) {
  try {
    let family = data.family !== undefined ? data.family : "N/A";
    const message = `Here's some information on ${data.heroName}:
**Element**: ${data.element}
**Stars**: ${data.stars}
**Class**: ${data.class}
**Family**: ${family}
**Limited Availability?**: ${data.limited === true ? "Yes" : "No"}${
      data.hotmInfo !== undefined ? "\n**Hero of The Month**:" : ""
    } ${
      data.hotmInfo !== undefined
        ? `${data.hotmInfo.month}/${data.hotmInfo.year}`
        : ""
    }

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
${data.heroName}'s overall grade is **${data.overallGrade}**`;
    return message;
  } catch (err) {
    return new Error(err);
  }
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
            const infoMessage = getInfoMessage(stats).catch(err => rej(err));
            res(infoMessage);
          })
          .catch(err => {
            rej(err);
          });
      }
    });
  }
};
