const { log } = require("../Utils");
const request = require("request");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const fetchOCRText = async form => {
  log("Getting OCR Text");
  return new Promise((resolve, reject) => {
    request.post(
      {
        timeout: 5000,
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
          console.log("Read error:", err.code === "ETIMEDOUT");
          console.log("Connection timeout:", err.connect === true);
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

const compressImage = async (fileUrl, fileName = "tempFile") => {
  await Jimp.read(fileUrl)
    .then(image => {
      return image
        .quality(80) // set JPEG quality
        .write(fileName); // save
    })
    .catch(err => {
      console.error(err);
    });
  return fs.createReadStream(path.join(__dirname + "/../", fileName));
};

const removeTempFile = async fileName => {
  const filePath = path.join(__dirname + "/../", fileName);
  fs.unlink(filePath, err => {
    if (err) throw err;
    console.log(`${fileName} was successfully deleted`);
  });
};

const getFormData = async message => {
  const file = message.attachments.first();
  const url = message.attachments.first().url;
  const filesize = file.filesize;
  const form = {
    isTable: "true",
    filetype: "JPG"
  };
  if (filesize > 1000000) {
    message.channel.send("Compressing image...");
    let tempFileName = `${message.channel.name}-temp-file.jpg`;
    form.file = await compressImage(url, tempFileName);
  } else {
    form.url = url;
  }
  return form;
};

module.exports = {
  name: "ocr",
  description:
    "Grab text from an image using the Optical Character Recognition (OCR) service provided by OCR.space",
  args: false,
  execute: async function(message) {
    if (message.attachments.size < 1 || message.attachments.size > 1) {
      message.channel.send(
        "Please attach a single image for text to be parsed. Multiple attachments is not supported."
      );
    }

    if (message.attachments.size === 1) {
      message.channel.send("Parsing text from image...");
      const file = message.attachments.first();
      log(`Received file name: ${file.filename} with url: \n ${file.url}`);
      const fileName = `${message.channel.name}-temp-file.jpg`;

      const sendParsedText = async () => {
        const form = await getFormData(message);
        return await fetchOCRText(form);
      };

      return new Promise((resolve, reject) => {
        sendParsedText()
          .then(data => {
            if (data === false) {
              message.channel.send(
                `An error occurred while parsing data. Please try again.`
              );
              throw new Error();
            } else {
              log("Sending OCR results...");
              message.channel.send(`Parsing complete! Results:\n \n ${data}`);
              resolve(data);
            }
          })
          .then(() => {
            if (file.filesize > 1000000)
              removeTempFile(fileName).catch(err => log(err));
          })
          .catch(error => {
            log(error);
            reject(error);
          });
      });
    }
  }
};
