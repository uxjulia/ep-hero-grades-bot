// const Database = require('../Database')
const Discord = require("discord.js");
const images = require("../images");
const Canvas = require("canvas");
const Logger = require("../Logger");

const { getHeroName, log } = require("../utils");

const getImage = async (hero, message) => {
  try {
    const canvas = Canvas.createCanvas(460, 680);
    const ctx = canvas.getContext("2d");
    const sendToDiscord = inAws => {
      const image = new Discord.Attachment(canvas.toBuffer(), `${hero}.png`);
      Logger.success["withImage"](image, message, inAws);
    };

    const awsName = hero.replace(/\s/g, ""); // Remove white space for AWS
    let awsImage = Canvas.loadImage(
      `${process.env.AWSHEROESURL}/${awsName}.png`
    );
    awsImage
      .then(img => {
        ctx.drawImage(img, 0, 0, 460, 680);
        log(`Sending image for ${hero}...`);
        sendToDiscord(true);
      })
      .catch(() => {
        console.error(`Image for ${awsName} not in AWS, trying JPG...`);
        let jpgImage = Canvas.loadImage(
          `${process.env.AWSHEROESURL}/${awsName}.jpg`
        );
        jpgImage
          .then(img => {
            ctx.drawImage(img, 0, 0, 460, 680);
            log(`Sending image for ${hero}...`);
            sendToDiscord(true);
          })
          .catch(() => {
            console.error(
              `JPG for ${awsName} not in AWS, getting image URL locally`
            );
            // Try getting the image from one of the URLs listed in local images file.
            // TODO: Remove retrieving local URLS once all hero images have been updated.
            let url = images.local[hero];
            if (url === undefined) {
              console.error(`Image for ${awsName} not found locally`);
              return message.reply(
                `Hmm. I can't seem to find an image for '${hero}'. Please try again.`
              );
            } else {
              let img = Canvas.loadImage(url);
              img
                .then(img => {
                  ctx.drawImage(img, 0, 0, 432, canvas.height);
                  sendToDiscord(false);
                })
                .catch(err => {
                  log(err);
                  return message.reply(
                    `Hmm. I can't seem to find an image for '${hero}'. Please try again.`
                  );
                });
            }
          });
      });
  } catch (error) {
    console.error(error);
    message.reply("Uh oh. Something went wrong. Please try again.");
  }
};

module.exports = {
  name: "image",
  description: "Get image for hero",
  args: true,
  execute: async function(message, args) {
    if (args.length) {
      try {
        const hero = getHeroName(args);
        return getImage(hero, message);
      } catch (error) {
        console.error(error);
        message.reply("Uh oh. Something went wrong. Please try again.");
      }
    }
  }
};
