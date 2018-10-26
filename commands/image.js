// const Database = require('../Database')
const Discord = require('discord.js');
const images = require('../images')
const Canvas = require('canvas')
const Logger = require('../Logger');
const canvas = Canvas.createCanvas(459, 680);
const ctx = canvas.getContext('2d');
const {getHeroName} = require('../Utils')

const getImage = async(hero, message) => {
  const sendToDiscord = (inAws) => {
    const image = new Discord.Attachment(canvas.toBuffer(), `${hero}.png`);
    Logger.success['withImage'](image, message, inAws);
  }

  try {
    const awsName = hero.replace(/\s/g,'') // Remove white space for AWS
    let awsImage = Canvas.loadImage(`https://s3.amazonaws.com/ep-heroes/${awsName}.png`)
    awsImage.then((img) => {
      ctx.drawImage(img, 0, 0)
      sendToDiscord(true)
    }).catch(() => {
      console.error('Image not in AWS, getting image URL locally');
      try {
        let url = images.local[hero]
        if (url === undefined) {
          return message.reply(`Hmm. I can't seem to find an image for '${hero}'. Please try again`)
        } else {
        let img = Canvas.loadImage(url);
        img.then((img) => {
          ctx.drawImage(img, 0, 0, 432, canvas.height)
          sendToDiscord(false)
        })
        }
      }
      catch(err) {
        throw err
      }
    })
  }
  catch(error) {
    console.log(error.message)
    message.reply('Uh oh. Something went wrong. Please try again.')
  }
}

module.exports = {
  name: 'image',
  description: 'Get image for hero',
  args: true,
  execute: async function (message, args) {
    if (args.length) {
      try {
        const hero = getHeroName(args)
        return getImage(hero, message);
      }
      catch(error) {
        console.log(error)
        message.reply('Uh oh. Something went wrong. Please try again.')
      }
    }
  },
}