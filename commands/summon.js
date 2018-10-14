const Random = require('random-js')
const mt = Random.engines.mt19937()
const random = new Random(mt.autoSeed())
const heroes = require('../heroes')

const rate = {
  hotm: 1.3,
  legendary: 2.5,
  epic: 29,
  rare: 100
}

class Summon {
  constructor(type = 'elemental', element = '') {
    this.type = type
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

  get hero() {
    let r = Summon.rarity() //?
    let length = heroes[r].length
    const rdm = Summon.randomize(0, length)
    let hero = heroes[r][rdm] //?
    const allowBonus = Summon.allowBonusDraw() //?
    return `
    You summoned ${r === 'epic' ? 'an' : 'a'} **${r}** hero: **${hero}**!
    ${allowBonus === true ? 'Congrats! You also drew the Hero of the Month!' : 'Sorry, you didn\'t pull the Hero of the Month'}`
  }
}

module.exports = {
  name: 'summon',
  description: 'Test your luck and summon a hero without actually summoning a hero!',
  args: false,
  execute(message) {
    // if (args.length) {
    const summon = new Summon('elemental')
    message.reply(summon.hero)
    // }
  }
}
