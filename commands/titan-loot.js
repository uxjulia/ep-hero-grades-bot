const b = .033
const c = .01

function damage(hp) {
  const bLoot = hp * b
  const cLoot = hp * c
  const result = {
    b: bLoot,
    c: cLoot
  }
  return result
}

const getMessage = (data) => {
  return `Titan damage needed for:
  **A+ loot**: Rank #1 on damage scoreboard
  **A loot**: Rank #2-5 on damage scoreboard
  **B loot**: ${data.b} or greater
  **C loot**: ${data.c} - ${data.b - 1}
  **D loot**: Less than ${data.c}`
}

module.exports = {
  name: 'titan-loot',
  description: 'Calculate damage needed for various titan loot tiers',
  args: true,
  execute(message, args) {
    const hp = args[0]
    const dmg = damage(hp)
    const msg = getMessage(dmg)
    message.channel.send(msg).then(() => console.log(`Successfully sent reply for titan loot`)).catch(error => console.error(error.message))
  }
}
