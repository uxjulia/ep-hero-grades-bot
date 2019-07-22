const { log } = require("./utils");

const withImage = function(image, message, isUpdated) {
  const messageWithNote = "Note: This image needs to be updated";
  return isUpdated === false
    ? message.channel
        .send(messageWithNote, image)
        .then(() => log("Successfully sent image"))
        .catch(error => console.error(error))
    : message.channel
        .send(image)
        .then(() => log("Successfully sent image"))
        .catch(error => console.error(error));
};

const error = function(hero, err, message) {
  if (message) {
    message.channel
      .send(`An error occurred while retrieving ${hero}`)
      .then(() =>
        console.log(
          `An error occurred while retrieving ${hero} with error: ${err}`
        )
      )
      .catch(error => console.error(error.message));
  }
};

const noData = function(message, data) {
  console.error(`No record found for ${data}`);
  message
    .reply(
      "Uh oh. I can't seem to find that hero. If I should know this hero, please let my master <@!342706933389852672> know to add this hero."
    )
    .then(() =>
      console.log("Successfully responded to channel with error message")
    )
    .catch(error => console.error(error.message));
};

const success = { info, titan, defense, offense, withImage };
module.exports = { success, error, noData };
