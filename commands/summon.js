const Random = require('random-js')
const mt = Random.engines.mt19937()
const random = new Random(mt.autoSeed())
const heroes = require('../heroes')

//TODO: Add appearance rate for Elemental and Atlantis summons.
/**
 * The appearance rate of heroes for an Epic summon
 * @type {{hotm: number, legendary: number, epic: number, rare: number}}
 */
const rate = {
  hotm: 1.3,
  legendary: 2.5,
  epic: 29,
  rare: 100
}

/**
 * Represents a summon
 * @constructor
 * @param {string} option - One of [epic, elemental, atlantis]
 * @param {string} element - One of [fire, ice, holy, dark, nature]
 */
class Summon {
  constructor(option = 'epic', element = '') {
    this.option = option
    this.element = element
  }

  static randomize(min, max) {
    return Math.floor(random.real(min, max))
  }

  static rarity() {
    const outcome = Summon.randomize(0, 100)
    let r = 'rare'
    if (outcome < rate.legendary) {
      r = 'legendary'
    } else if (outcome > rate.legendary && outcome <= rate.epic) {
      r = 'epic'
    } else if (outcome > rate.epic && outcome <= rate.rare) {
      r = 'rare'
    }
    return r
  }

  static allowBonusDraw() {
    return Random.bool(.013)(mt)
  }

  static getHero() {
    let r = Summon.rarity()
    let length = heroes[r].length
    const rdm = Summon.randomize(0, length)
    let hero = `${heroes[r][rdm]} (**${r}**)`
    let allowBonus = Summon.allowBonusDraw()
    let result = hero
    if (allowBonus !== false) {
      result = hero.concat(` + BONUS HOTM`)
    }
    return result
  }

  pull() {
    const msg = `Here is the result of your summon: \n`
    const heroes = []
    if (this.option === '10') {
      let x = 10
      for (let i = 0; i < x; i++) {
        heroes.push(`${i + 1}) ${Summon.getHero()}`)
      }
      return msg + heroes.join('\n')
    }
    heroes.push(Summon.getHero())
    return msg + heroes
  }
}

module.exports = {
  name: 'summon',
  description: 'Test your luck and summon a hero without actually summoning a hero!',
  args: true,
  execute(message, args) {
    const summon = new Summon(args[0], args[1])
    message.reply(summon.pull())
  }
}
