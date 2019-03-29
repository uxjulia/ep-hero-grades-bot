const { log } = require('../Utils');
const request = require('request');

const postToGoogle = async(data) => {
  log('Sending to Google...')
  log(JSON.stringify(data));
  return new Promise((resolve, reject) => {
    request.post({
      url: process.env.GSCRIPTURL,
      formData: data
    }, function optionalCallback(err, httpResponse, body) {
      if (err) {
        log(err)
        reject(err)
      }
      resolve("Successfully posted to Google")
    })
  })
}

module.exports = {
  name: 'log',
  description: 'Log titan spawns',
  args: true,
  execute(message, args) {
    if (!args.length) {
      log('Invalid Arguments: ' + args.length)
      message.reply('Invalid # of arguments. Sample command !log ancient-tiger red 10 3158000 --rare -date 03/28/2019')
      return
    }
    const messageText = message.content;
    const titanName = args[0];
    const color = args[1];
    const stars = args[2];
    const hp = args[3];

    // Check if the titan is marked as "rare"
    const isRare = RegExp('--rare').test(messageText);
    let rare = isRare === true ? "RARE" : "";

    // Check if a specific date was provided
    const captureDate = /(?<=--date\s|--d\s)(\S+)/ig;
    const hasDate = RegExp('--date|--d').test(messageText);
    let date = hasDate === true ? messageText.match(captureDate)[0] : new Date().toLocaleDateString();

    // Prepare the form data
    const formData = {
      "option": "log",
      "titan": titanName,
      "color": color,
      "stars": stars,
      "hp": hp,
      "rare": rare,
      "date": date,
    }

    const postToSheets = async (formData) => {
      const response = await postToGoogle(formData);
      return response;
    }

    postToSheets(formData).then(msg => message.reply(msg)).catch(error => {
      log('error posting', error)
    });

  },
}
