const { log } = require("../Utils");
const request = require("request");
const {
  fetchOCRText,
  compressImage,
  removeTempFile,
  getFormData
} = require("./ocr");

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
    request.post({ url: url, formData: form }, function optionalCallback(
      err,
      httpResponse,
      body
    ) {
      if (err) {
        log(err);
        reject(err);
      }
      log("Successfully posted to Google Sheets");
      resolve("Successfully posted to Google Sheets");
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

    if (message.attachments.size === 1) {
      const file = message.attachments.first();
      const url = message.attachments.first().url;
      log(`Received file name: ${file.filename} with url: \n ${file.url}`);
      // TODO make this filename dynamic
      let tempFileName = `${message.channel.name}-temp-file.jpg`;

      const postToSheets = async fileUrl => {
        const form = await getFormData(message);
        const data = await fetchOCRText(form);
        message.channel.send(`OCR result:\n ${data}`);
        const response = await postData(dataType, data, date);
        return response;
      };
      await postToSheets(url)
        .then(msg => message.channel.send(msg))
        .catch(error => {
          log(error);
          message.channel.send(
            "Unable to complete the request. Please try again later."
          );
        });

      if (file.filesize > 1000000) {
        removeTempFile(tempFileName).catch(err => log(err));
      }
    }
  }
};
