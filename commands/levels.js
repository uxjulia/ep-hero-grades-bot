const { log } = require("../Utils");

const data = {
  fire: "S2: 3-4, 3-8; S1: 20-4, 19-6, 19-4, 11-6, 6-8",
  ice: "S1: 8-7, 14-5",
  nature: "S1: 7-5",
  holy: "S1: 10-6, 12-9",
  dark: "S1: 7-4, 5-5"
};

module.exports = {
  name: "levels",
  aliases: "level",
  description: "Get best levels for filling elemental chests",
  args: true,
  execute(message, args) {
    let element = args[0].toUpperCase();
    let levels = data[args[0].toLowerCase()];
    message.channel
      .send(`Best level(s) for ${element} monsters: ${levels}`)
      .then(() => log(`Successfully sent reply for ${element} monsters`))
      .catch(error => console.error(error.message));
  }
};
