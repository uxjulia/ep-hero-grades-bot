const {log} = require('../Utils')
const request = require('request');

const postData = async(dataType, parsedText, date) => {
  log ('Sending to Google Sheets');
  return new Promise((resolve, reject) => {
    const url = process.env.GSCRIPTURL;
    const form = {
      data: parsedText,
      date: date,
      option: "track",
      dataType: dataType,
    }
    request.post({url: url, formData: form}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        log(err);
        reject(err);
      }
      log('Successfully posted to Google Sheets');
      resolve('Successfully posted to Google Sheets');
    })
  })
}

const fetchOCRText = async(fileUrl) => {
  log('Getting OCR Text');
  return new Promise((resolve, reject) => {
    const form = {
      "isTable": "true",
      "url": fileUrl,
      "filetype": 'JPG'
    }
    request.post({
      url: process.env.OCRURL,
      headers: {
        'apiKey': process.env.OCRAPIKEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      formData: form
    }, function optionalCallback(err, httpResponse, body) {
      if (err) {
        log(err)
        reject(err)
      }
      const json = JSON.parse(body)
      if (json.IsErroredOnProcessing) {
        return false
      }
      resolve(json.ParsedResults[0].ParsedText)
    })
  })
}

module.exports = {
  name: 'track',
  description: 'Track Titan/AW scores',
  args: true,
  execute(message, args) {
    if (!args.length) {
      log('Invalid Arguments: ' + args.length)
      message.channel.send('Invalid # of arguments. Sample command !track titan [date]')
      return
    }
    const dataType = args[0]
    const date = args[1] === undefined ? "" : args[1];

    if (!['TITAN', 'WAR'].includes(dataType.toUpperCase())) {
      log('Invalid tracking data type')
      message.channel.send('Invalid tracking data type. Valid data type options include: [Titan, War]')
    }

    if (message.attachments.size === 1) {
      const file = message.attachments.first();
      const url = message.attachments.first().url;
      log(`Received file name: ${file.filename} with url: \n ${file.url}`)

      const postToSheets = async (fileUrl) => {
        const data = await fetchOCRText(fileUrl);
        message.channel.send(`OCR result:\n ${data}`);
        const response = await postData(dataType, data, date);
        return response;
      }
      postToSheets(url).then(msg => message.channel.send(msg)).catch(error => {
        log(error)
      });
    }
  },
}
