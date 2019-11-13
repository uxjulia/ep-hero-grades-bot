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
            reject(json.ErrorMessage);
          }
          resolve(json.ParsedResults[0].ParsedText);
        }
      }
    );
  });
};

const compressImage = async (fileUrl, fileName = "tempFile") => {
  await Jimp.read(fileUrl)
    .then(image => {
      return image
        .resize(440, Jimp.AUTO) // Resize
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
    if (err) throw new Error(err);
  });
};

const getFormData = async message => {
  const file = message.attachments.first();
  const url = message.attachments.first().url;
  const filesize = file.filesize;
  const form = {
    language: process.env.OCR_LANGUAGE,
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
            if (file.filesize > 1000000)
              removeTempFile(fileName)
                .then(() => log(`${fileName} was successfully deleted`))
                .catch(err => log(err));
          });
      });
    }
  }
};
