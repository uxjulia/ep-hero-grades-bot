const Database = require("../Database");
const { getHeroName } = require("../utils");

module.exports = {
  name: "defense",
  description: "Get defense grades",
  args: true,
  execute(message, args) {
    if (args.length) {
      const hero = getHeroName(args);
      Database.getDefense(hero, message);
    }
  }
};
