const { log } = require("../Utils");
const request = require("request");

const fetchOCRText = async fileUrl => {
  log("Getting OCR Text");
  return new Promise((resolve, reject) => {
    const form = {
      isTable: "true",
      url: fileUrl,
      filetype: "JPG"
    };
    request.post(
      {
        url: process.env.OCRURL,
        headers: {
          apiKey: process.env.OCRAPIKEY,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        formData: form
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          log(err);
          reject(err);
        }
        const json = JSON.parse(body);
        if (json.IsErroredOnProcessing) {
          return false;
        }
        resolve(json.ParsedResults[0].ParsedText);
      }
    );
  });
};

module.exports = {
  name: "ocr",
  description:
    "Grab text from an image using the Optical Character Recognition (OCR) service provided by OCR.space",
  args: false,
  execute(message, args) {
    if (message.attachments.size < 1 || message.attachments.size > 1) {
      message.channel.send(
        "Please attach a single image for text to be parsed. Multiple attachments is not supported."
      );
    }
    if (message.attachments.size === 1) {
      message.channel.send("Parsing text from image...");
      const file = message.attachments.first();
      const url = message.attachments.first().url;
      log(`Received file name: ${file.filename} with url: \n ${file.url}`);

      const sendParsedText = async fileUrl => {
        const data = await fetchOCRText(fileUrl);
        return data;
      };
      sendParsedText(url)
        .then(data =>
          message.channel.send(`Parsing complete! Results:\n \n ${data}`)
        )
        .catch(error => {
          log(error);
        });
    }
  }
};
