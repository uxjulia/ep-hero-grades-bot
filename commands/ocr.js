const { log } = require("../utils");
const request = require("request");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const fetchOCRText = async form => {
  log("Getting OCR Text");
  return new Promise((resolve, reject) => {
    request.post(
      {
        timeout: 60000,
        forever: true,
        url: process.env.OCR_URL,
        headers: {
          apiKey: process.env.OCR_API_KEY,
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
        } else {
          const json = JSON.parse(body);
          if (json.IsErroredOnProcessing) {
            resolve(false);
          }
          const lines = json.ParsedResults[0].TextOverlay.Lines;
          let returnMessage = lines.map(line => {
            return `${line.LineText}`;
          });
          resolve(returnMessage);
        }
      }
    );
  });
};

const compressImage = async (fileUrl, fileName = "tempFile") => {
  await Jimp.read(fileUrl)
    .then(image => {
      return image
        .resize(1000, Jimp.AUTO) // Resize
        .rgba(false)
        .greyscale()
        .contrast(1)
        .posterize(2)
        .quality(80) // set JPEG quality
        .write(fileName); // save
    })
    .catch(err => {
      console.error("JIMP errror:", err);
    });
  return fs.createReadStream(path.join(__dirname + "/../", fileName));
};

const removeTempFile = async fileName => {
  const filePath = path.join(__dirname + "/../", fileName);
  fs.unlink(filePath, err => {
    if (err) throw new Error(err);
  });
};

const getFormData = async message => {
  const file = message.attachments.first();
  const url = message.attachments.first().url;
  const tempFileName = `${message.channel.name}-temp-file.jpg`;
  const image = await compressImage(url, tempFileName);
  const form = {
    language: process.env.OCR_LANGUAGE,
    filetype: "JPG",
    scale: "true",
    file: image,
    isOverlayRequired: "true",
    OCREngine: process.env.OCR_ENGINE
  };
  return form;
};

module.exports = {
  name: "ocr",
  description:
    "Grab text from an image using the Optical Character Recognition (OCR) service provided by OCR.space",
  args: false,
  execute: async function(message) {
    if (message.attachments.size < 1 || message.attachments.size > 1) {
      return "Please attach a single image for text to be parsed. Multiple attachments is not supported.";
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
              reject(`An error occurred while parsing data. Please try again.`);
            } else {
              resolve(data);
            }
          })
          .catch(error => {
            log(error);
            reject(
              `An error occurred while trying to reach OCR service. Please try again.`
            );
          })
          .finally(() => {
            removeTempFile(fileName)
              .then(() => log(`${fileName} was successfully deleted`))
              .catch(err => log(err));
          });
      });
    }
  }
};
