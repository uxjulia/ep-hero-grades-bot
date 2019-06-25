const Database = require("../Database");
const { getHeroName } = require("../utils");

module.exports = {
  name: "offense",
  description: "Get offense grades for a hero",
  args: true,
  execute(message, args) {
    console.log("executing offense..", args);
    if (args.length) {
      const hero = getHeroName(args);
      Database.getOffense(hero, message);
    }
  }
};
