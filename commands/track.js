const { log } = require("../utils");
const request = require("request");
const Ocr = require("./ocr");

const postData = async (dataType, parsedText, date) => {
  log("Sending to Google Sheets");
  return new Promise((resolve, reject) => {
    const url = process.env.GSCRIPT_URL;
    const form = {
      data: parsedText,
      date: date,
      option: "track",
      dataType: dataType
    };
    request.post({ url: url, formData: form }, function optionalCallback(err) {
      if (err) {
        log(err);
        reject(err);
      }
      log(`Successfully posted ${dataType.toUpperCase()} data`);
      resolve(`Successfully posted ${dataType.toUpperCase()} data`);
    });
  });
};

async function saveJson(type = "titan") {
  return new Promise((resolve, reject) => {
    const legendsApiUrl = process.env.LEGENDS_GSCRIPT_URL;
    request.get(
      `${legendsApiUrl}?query=saveJson&type=${type}`,
      function callback(err) {
        if (err) {
          resolve(`An error occurred while generating new player ${type} data`);
        } else {
          resolve(`Successfully generated new player ${type} data`);
        }
      }
    );
  });
}

module.exports = {
  name: "track",
  description: "Track Titan/AW scores",
  args: true,
  execute: async function(message, args) {
    try {
      // Since this bot is installed on other Discord Servers for other E&P Alliances,
      // verify where the message is coming from so that tracking data isn't initiated
      // from other alliances
      if (message.channel.id !== process.env.AUTHORIZED_CHANNEL_ID) {
        return "That command is not allowed from this channel.";
      }
      // Check if arguments were provided
      if (!args.length) {
        log("Invalid Arguments: " + args.length);
        return "Invalid # of arguments. Sample command !track titan [date]";
        return;
      }
      const dataType = args[0];
      const date = args[1] === undefined ? "" : args[1];

      // Check that tracked data is one of these types
      if (!["TITAN", "WAR"].includes(dataType.toUpperCase())) {
        log("Invalid tracking data type");
        return "Invalid tracking data type. Valid data type options include: Titan or War";
      }

      if (message.attachments.size === 1) {
        const ocr = await Ocr.execute(message)
          .then(data => {
            message.channel.send(`${data} \n\nPosting to Google Sheets...`);
            return postData(dataType, data, date).then(resp => {
              const type = dataType.toLowerCase();
              message.channel.send(resp);
              return saveJson(type)
                .then(msg => {
                  log(msg);
                })
                .catch(err => err);
            });
          })
          .catch(err => {
            log(err);
          });
        return ocr;
      }
    } catch (err) {
      log(err);
      return "Something went wrong... please try again.";
    }
  }
};
