const Discord = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { log } = require("../Utils");

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
  execute: function(message) {
    try {
      loadImage(`${process.env.AWSMISCURL}/emojis.jpg`).then(img => {
        const emojiImg = prepImage(img);
        message.channel
          .send(emojiImg)
          .then(() => log("Successfully sent emoji image"))
          .catch(err => console.log(err));
      });
    } catch (err) {
      message.channel
        .send("Whoops! An error occurred. Please try again")
        .then(() => log("Error occured while attempting to send emoji image."))
        .catch(err => console.log(err));
      log(err);
    }
  }
};
