const { log } = require("../utils");
const request = require("request");
const Ocr = require("./ocr");

const postData = async (dataType, parsedText, date) => {
  log("Sending to Google Sheets");
  return new Promise((resolve, reject) => {
    const url = process.env.GSCRIPTURL;
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

module.exports = {
  name: "track",
  description: "Track Titan/AW scores",
  args: true,
  execute: async function(message, args) {
    if (!args.length) {
      log("Invalid Arguments: " + args.length);
      message.channel.send(
        "Invalid # of arguments. Sample command !track titan [date]"
      );
      return;
    }
    const dataType = args[0];
    const date = args[1] === undefined ? "" : args[1];

    if (!["TITAN", "WAR"].includes(dataType.toUpperCase())) {
      log("Invalid tracking data type");
      message.channel.send(
        "Invalid tracking data type. Valid data type options include: [Titan, War]"
      );
    }

    const postToSheets = async data => {
      return await postData(dataType, data, date);
    };
    if (message.attachments.size === 1) {
      Ocr.execute(message)
        .then(data => {
          message.channel.send("Posting data to Google Sheets...");
          postToSheets(data)
            .then(resp => message.channel.send(resp))
            .catch(err => {
              log(err);
              message.channel.send(
                "An error occurred while posting to Google Sheets"
              );
            });
        })
        .catch(err => log(err));
    }
  }
};
