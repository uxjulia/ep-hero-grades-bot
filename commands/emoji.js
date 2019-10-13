const Discord = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { log } = require("../utils");

const canvas = createCanvas(800, 998);
const ctx = canvas.getContext("2d");

const prepImage = img => {
  ctx.drawImage(img, 0, 0);
  const buffedImg = canvas.toBuffer();
  return new Discord.Attachment(buffedImg, "emojis.png");
};

module.exports = {
  name: "emojis",
  aliases: "emoji",
  description: "Get the list of chat emoji codes",
  args: false,
  execute: async function() {
    try {
      return loadImage(`${process.env.AWS_MISC_URL}/emojis.jpg`).then(img => {
        const emojiImg = prepImage(img);
        return emojiImg;
      });
    } catch (err) {
      return new Error("Whoops! An error occurred. Please try again");
    }
  }
};
