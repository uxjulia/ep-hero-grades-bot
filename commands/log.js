const { log, numberWithCommas } = require("../utils");
const request = require("request");

const postToGoogle = async data => {
  log("Sending to Google...");
  log(JSON.stringify(data));
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: process.env.GSCRIPT_URL,
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
  execute: async function(message, args) {
    // Since this bot is installed on other Discord Servers for other E&P Alliances,
    // verify where the message is coming from so that tracking data isn't initiated
    // from other alliances
    try {
      if (message.channel.id !== process.env.AUTHORIZED_CHANNEL_ID) {
        throw new Error("That command is not allowed from this channel.");
      }

      // Check if arguments were provided
      if (!args.length) {
        log("Invalid Arguments: " + args.length);
        return "Invalid # of arguments. Sample command !log ancient-tiger red 10 3158000 --rare --date 03/28/2019";
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

      if (
        ![
          "RED",
          "BLUE",
          "YELLOW",
          "PURPLE",
          "GREEN",
          "FIRE",
          "ICE",
          "HOLY",
          "DARK",
          "NATURE"
        ].includes(color.toUpperCase())
      ) {
        log(`Invalid titan color/element submitted: ${color}`);
        return "Invalid titan color/element submitted. Valid colors/elements iclude: Red, Blue, Yellow, Purple, Green, Fire, Ice, Holy, Dark or Nature";
      }

      // Prepare the form data
      const formData = {
        option: "log",
        titan: titanName,
        color: color,
        stars: stars,
        hp: hp,
        rare: rare,
        date: date
      };

      const postToSheets = async formData => {
        try {
          const response = await postToGoogle(formData);
          return response;
        } catch (err) {
          log(err);
          return "An error ocurred while attempting to post to Google";
        }
      };
      // postToSheets(formData).then(msg => return msg);
      return postToSheets(formData).then(resp => {
        return resp;
      });
    } catch (err) {
      return err;
    }
  }
};
