const heroes = require("../heroes");
const Chance = require("chance");

const chance = new Chance();

const pullType = {
  CLASSIC: ["Legendary", "Epic", "Rare"],
  ATLANTIS: [
    "Legendary",
    "Epic",
    "Rare",
    "Rare Atlantis",
    "Epic Atlantis",
    "Legendary Atlantis",
    "Featured Legendary"
  ]
};

const appearanceRates = {
  CLASSIC: [1.5, 26.5, 72],
  ATLANTIS: [1, 11.9, 21.8, 49.2, 14.6, 0.2, 1.3]
};

/**
 * Represents a summon
 * @constructor
 * @param {string} optional count of 10
 * @param {string} optional option - One of [classic, atlantis]
 */
class Summon {
  constructor(count = "1", option = "CLASSIC") {
    this.option = option.toUpperCase();
    this.count = count;
  }

  static rarity(opt) {
    return chance.weighted(pullType[opt], appearanceRates[opt]);
  }

  static allowBonusDraw() {
    return chance.weighted([true, false], [1.3, 98.7]);
  }

  static getHero(opt) {
    let option = opt !== "ATLANTIS" ? "CLASSIC" : opt;
    let r = this.rarity(option);
    let hero = `${chance.pickone(heroes[r])} (**${r}**)`;
    let allowBonus = this.allowBonusDraw();
    let result = hero;
    if (allowBonus !== false) {
      result = hero.concat(` + BONUS HOTM`);
    }
    return result;
  }

  pull() {
    const msg = `Here is the result of your summon: \n`;
    const heroes = [];
    if (this.count === "10") {
      let x = 10;
      for (let i = 0; i < x; i++) {
        heroes.push(`${i + 1}) ${Summon.getHero(this.option)}`);
      }
      return msg + heroes.join("\n");
    }
    // Check if the first parameter passed is actually the summon type (for a single Atlantis pull).
    if (this.count.toUpperCase() === "ATLANTIS") {
      heroes.push(Summon.getHero("ATLANTIS"));
      return msg + heroes;
    }
    heroes.push(Summon.getHero("CLASSIC"));
    return msg + heroes;
  }
}

module.exports = {
  name: "summon",
  description:
    "Test your luck and summon a hero without actually summoning a hero!",
  execute: async function(message, args) {
    try {
      const summon = new Summon(args[0], args[1]);
      const pull = summon.pull();
      return pull;
    } catch (err) {
      return new Error(err);
    }
  }
};
