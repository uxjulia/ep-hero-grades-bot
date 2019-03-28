const {log} = require('../Utils')
const request = require('request')
const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')

async function trackData(message, date) {
  const fileName = `${message.channel.name}-img.jpg`
  await compressImage(message.attachments.first().url, fileName)
  log('Compressed')
  let parsedText = await ocr(message, fileName)

  if (parsedText && parsedText !== false && parsedText.length > 0) {
    log('Posting data..')
    const response = await postTitanData(parsedText, date)
    message.channel.send(response)
  } else {
    log('Error getting OCR')
    message.channel.send(parsedText)
  }
}

function compressImage(imageUrl, filename) {
  log('Compressing')
  return new Promise((resolve) => {
    Jimp.read(imageUrl).then(image => {
      resolve(
        image.quality(95).write(filename)
      )
    }).catch(err => {
      throw err
    })
  })
}

function postTitanData(parsedText, date) {
  log('Sending to Google')
  return new Promise((resolve, reject) => {
    const url = process.env.GSCRIPTURL

    const form = {
      data: parsedText,
      date: date,
    }

    request.post({url: url, form: form}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        log('Error posting titan data: ' + err)
        reject(err)
      }
      log('Successfully sent to Google')
      resolve('Successfully posted data')
    })
  })
}

function ocr(message, fileName) {
  log('Running OCR')
  return new Promise((resolve, reject) => {
    const url = process.env.OCRURL
    const headers = {
      'apikey': process.env.OCRAPIKEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const r = request.post({url: url, headers: headers}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        log('upload failed:' + err)
        reject(err)
      }
      const jsonBody = JSON.parse(body)
      if (jsonBody.IsErroredOnProcessing === false) {
        const parsedText = jsonBody.ParsedResults[0].ParsedText
        console.log('parsed text', parsedText)
        resolve(parsedText)
      }
      resolve(false)
    })

    const form = r.form()
    form.append('isTable', 'true')
    form.append('file', fs.createReadStream(path.join(__dirname + '/../', `${fileName}`)))
  })
}

module.exports = {
  name: 'track',
  description: 'Track Titan/AW scores',
  args: true,
  execute(message, args) {

    if (!args.length) {
      log('Invalid Arguments: ' + args.length)
      message.reply('Invalid # of arguments. Sample command !track titan [date]')
      return
    }

    const option = args[0]
    const date = args[1] === undefined ? new Date().toLocaleDateString() : args[1]
    if (!['TITAN', 'WAR'].includes(option.toUpperCase())) {
      log('Invalid option')
      message.reply('Invalid tracking option. Valid options include: [Titan, War]')
    }
    //
    // let stars, element, name;
    // stars = args[1] === undefined ? "" : args[1];
    // element = args[2] === undefined ? "" : args[2];
    // name = args[3] === undefined ? "" : args[3];

    // if (option.toUpperCase() === "TITAN") {
    //   if (isNaN(stars) || stars < 0 || stars > 14) {
    //     log("Invalid # of stars: " + stars);
    //     message.reply("Invalid # of stars. Sample command !track titan 12 dark onyx-dragon");
    //     return;
    //   }
    //
    //   if (!["FIRE", "ICE", "NATURE", "HOLY", "DARK"].includes(element.toUpperCase())) {
    //     log("Invalid Titan element: " + element);
    //     message.reply("Invalid titan element. Sample command !track titan 12 dark onyx-dragon");
    //     return;
    //   }
    // }

    if (message.attachments.size === 1) {
      log(`Received file name: ${message.attachments.first().filename}`)
      log(`Received file size: ${message.attachments.first().filesize}`)
      log(`Received file url : ${message.attachments.first().url}`)

      trackData(message, date).then().catch(err => log(err))

    }

  },
}
