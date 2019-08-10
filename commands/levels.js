const { log } = require("../utils");

const data = {
  FIRE: "\nS2: 3-4, 3-8 \nS1: 20-4, 19-6, 19-4, 11-6, 6-8",
  ICE: "S1: 8-7, 14-5",
  NATURE: "S1: 7-5",
  HOLY: "S1: 10-6, 12-9",
  DARK: "S1: 7-4, 5-5"
};

module.exports = {
  name: "levels",
  aliases: "level",
  description: "Get best levels for filling elemental chests",
  args: true,
  execute: async function(message, args) {
    try {
      let element = args[0].toUpperCase();
      if (!["FIRE", "HOLY", "ICE", "DARK", "NATURE"].includes(element)) {
        log(`Invalid element entered: ${element}`);
        throw new Error(
          `${element} is not a valid element. Try one of the following: Fire, Ice, Nature, Holy, or Dark`
        );
      }
      let levels = data[args[0].toUpperCase()];
      return `Best level(s) for ${element} monsters: ${levels}`;
    } catch (err) {
      return new Error(err);
    }
  }
};
