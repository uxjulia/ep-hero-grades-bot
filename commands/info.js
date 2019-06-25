const Database = require("../Database");
const { getHeroName } = require("../Utils");

module.exports = {
  name: "info",
  description: "Get basic hero info",
  args: true,
  execute(message, args) {
    if (args.length) {
      const hero = getHeroName(args);
      Database.getInfo(hero, message);
    }
  }
};
