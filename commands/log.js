const { log, numberWithCommas } = require("../utils");
const request = require("request");

const postToGoogle = async data => {
  log("Sending to Google...");
  log(JSON.stringify(data));
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: process.env.GSCRIPTURL,
        formData: data
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          log(err);
          reject(err);
        }
        if (data.hp) {
          let bLoot;
          bLoot = data.hp * 0.033;
          resolve(
            `Successfully added ${data.titan.toUpperCase()} to the Titan Log. B Loot = ${numberWithCommas(
              Math.round(bLoot)
            )}`
          );
        } else {
          resolve(`Successfully logged data`);
        }
      }
    );
  });
};

module.exports = {
  name: "log",
  description: "Log titan spawns",
  args: true,
  execute(message, args) {
    // Since this bot is installed on other Discord Servers for other E&P Alliances,
    // verify where the message is coming from so that tracking data isn't initiated
    // from other alliances
    if (message.channel.id !== process.env.CHANNELID) {
      message.channel.send("That command is not allowed from this channel.");
      return;
    }

    // Check if arguments were provided
    if (!args.length) {
      log("Invalid Arguments: " + args.length);
      message.channel.send(
        "Invalid # of arguments. Sample command !log ancient-tiger red 10 3158000 --rare --date 03/28/2019"
      );
      return;
    }
    const messageText = message.content;
    const titanName = args[0];
    const color = args[1] === undefined ? "" : args[1];
    const stars = args[2] === undefined ? "" : args[2];
    const hp = args[3] === undefined ? "" : args[3];

    // Check if the titan is marked as "rare"
    const isRare = RegExp("--rare").test(messageText);
    let rare = isRare === true ? "RARE" : "";

    // Check if a specific date was provided
    const captureDate = /(?<=--date\s|--d\s)(\S+)/gi;
    const hasDate = RegExp("--date|--d").test(messageText);
    let date = hasDate === true ? messageText.match(captureDate)[0] : "";

    // Check if this should be an update to an existing record
    let option = titanName.toUpperCase() === "UPDATE" ? "UPDATE" : "LOG";
    if (option === "UPDATE") {
      // Reject if the update argument is not one of 'Killed' or 'Escaped'
      if (!["KILLED", "ESCAPED"].includes(color.toUpperCase())) {
        message.channel.send(
          "Invalid update option. Valid options include: [KILLED, ESCAPED]"
        );
      }
    }
    // Prepare the form data
    const formData = {
      option: option,
      titan: titanName,
      color: color,
      stars: stars,
      hp: hp,
      rare: rare,
      date: date
    };

    const postToSheets = async formData => {
      const response = await postToGoogle(formData);
      return response;
    };

    postToSheets(formData)
      .then(msg => message.channel.send(msg))
      .catch(error => {
        log("error posting", error);
      });
  }
};
