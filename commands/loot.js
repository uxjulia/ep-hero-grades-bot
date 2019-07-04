const { log, numberWithCommas } = require("../utils");

const b = 0.033;
const c = 0.01;

function damage(hp) {
  const bLoot = Math.round(hp * b);
  const cLoot = Math.round(hp * c);
  return {
    b: bLoot,
    c: cLoot
  };
}

const getMessage = data => {
  return `Titan damage needed for:
  **A+ loot**: Rank #1 on damage scoreboard
  **A loot**: Rank #2-5 on damage scoreboard
  **B loot**: ${numberWithCommas(data.b)} or greater
  **C loot**: ${numberWithCommas(data.c)} - ${numberWithCommas(data.b - 1)}
  **D loot**: Less than ${numberWithCommas(data.c)}`;
};

module.exports = {
  name: "loot",
  aliases: ["titan-loot"],
  description: "Calculate damage needed for various titan loot tiers",
  args: true,
  execute(message, args) {
    const hp = args[0];
    if (isNaN(hp)) {
      log(`Invalid HP value given: ${hp}`);
      message.channel.send(
        "Total titan health needs to be a number, ex: `!loot 4254000`"
      );
      return;
    }
    const dmg = damage(hp);
    const msg = getMessage(dmg);
    message.channel
      .send(msg)
      .then(() => log(`Successfully sent reply for titan loot`))
      .catch(error => console.error(error.message));
  }
};
