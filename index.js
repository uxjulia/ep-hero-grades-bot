const { prefix, token } = require("./config.json");
const Discord = require("discord.js");
// const fs = require("fs");
const client = new Discord.Client();
var Airtable = require("airtable");
const { airtableApi, airtableBase } = require("./config.json");
var base = new Airtable({ apiKey: airtableApi }).base(airtableBase);

// TODO: Write to a log file.

function getTitanGrades(hero, message) {
  let count = 0;
  base("Titan Grades")
    .select({
      view: "Grid view",
      filterByFormula: `TRUE({Hero} = '${hero}')`,
      fields: [
        "Hero",
        "Stamina",
        "Passive",
        "Direct",
        "Tiles",
        "Versatility",
        "Overall"
      ]
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          const heroName = record.get("Hero");
          const overallGrade = record.get("Overall");
          const stamina = record.get("Stamina");
          const passive = record.get("Passive");
          const direct = record.get("Direct");
          const tiles = record.get("Tiles");
          const versatility = record.get("Versatility");

          if (heroName.toLowerCase() === hero) {
            count++;
            console.log("Retrieved", heroName);
            message.reply(
              `Here are ${heroName}'s **titan** grades:

            **Stamina**: ${stamina}
            **Passive**: ${passive}
            **Direct**: ${direct}
            **Tiles**: ${tiles}
            **Versatility**: ${versatility}
            __
            ${heroName}'s overall **titan** grade is **${overallGrade}**`
            );
          }
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return err;
        }
        if (count === 0) {
          message.reply(
            "Uh oh. I can't seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains."
          );
        }
      }
    );
}
function getOffenseGrades(hero, message) {
  let count = 0;
  base("Offense Grades")
    .select({
      view: "Grid view",
      filterByFormula: `TRUE({Hero} = '${hero}')`,
      fields: [
        "Hero",
        "Speed",
        "Effect",
        "Stamina",
        "War",
        "Versatility",
        "Overall"
      ]
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          const heroName = record.get("Hero");
          const overallGrade = record.get("Overall");
          const speed = record.get("Speed");
          const effect = record.get("Effect");
          const stamina = record.get("Stamina");
          const war = record.get("War");
          const versatility = record.get("Versatility");

          if (heroName.toLowerCase() === hero) {
            count++;
            console.log("Retrieved", heroName);
            message.reply(
              `Here are ${heroName}'s **offense** grades:

              **Speed**: ${speed}
              **Effect**: ${effect}
              **Stamina**: ${stamina}
              **Versatility**: ${versatility}
              **War**: ${war}
              __
              ${heroName}'s overall **offense** grade is **${overallGrade}**`
            );
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return err;
        }
        if (count === 0) {
          message.reply(
            "Uh oh. I can't seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains."
          );
        }
      }
    );
}
function getDefenseGrades(hero, message) {
  let count = 0;
  base("Defense Grades")
    .select({
      view: "Grid view",
      filterByFormula: `TRUE({Hero} = '${hero}')`,
      fields: [
        "Hero",
        "Speed",
        "Effect",
        "Stamina",
        "Strength",
        "Tank",
        "Support",
        "Overall"
      ]
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          const heroName = record.get("Hero");
          const overallGrade = record.get("Overall");
          const speed = record.get("Speed");
          const effect = record.get("Effect");
          const stamina = record.get("Stamina");
          const strength = record.get("Strength");
          const tank = record.get("Tank");
          const support = record.get("Support");

          if (heroName.toLowerCase() === hero) {
            count++;
            console.log("Retrieved", heroName);
            message.reply(
              `Here are ${heroName}'s **defense** grades:

              **Speed**: ${speed}
              **Effect**: ${effect}
              **Stamina**: ${stamina}
              **Strength**: ${strength}
              **Tank**: ${tank}
              **Support**: ${support}
              __
              ${heroName}'s overall **defense** grade is **${overallGrade}**`
            );
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return err;
        }
        if (count === 0) {
          message.reply(
            "Uh oh. I can't seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains."
          );
        }
      }
    );
}
function getInfo(hero, message) {
  let count = 0;
  base("Heroes")
    .select({
      view: "Grid view",
      filterByFormula: `TRUE({Hero} = '${hero}')`,
      fields: ["Hero", "Element", "Stars", "Limited", "Overall"]
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          const heroName = record.get("Hero");
          const overallGrade = record.get("Overall");
          const element = record.get("Element");
          const stars = record.get("Stars");
          const limited = record.get("Limited") === "TRUE" ? "Yes" : "No";

          if (heroName.toLowerCase() === hero) {
            count++;
            console.log("Retrieved", heroName);
            message.reply(
              `Here's some information on ${heroName}:

              **Element**: ${element}
              **Stars**: ${stars}
              **Limited Availability?**: ${limited}

              __
              ${heroName}'s overall grade is **${overallGrade}**`
            );
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return err;
        }
        if (count === 0) {
          message.reply(
            "Uh oh. I can't seem to find that hero. If I should know this hero, please let my master @Av0 know to update my brains."
          );
        }
      }
    );
}

client.on("ready", () => {
  console.log(`Ready!`);
});

client.on("message", message => {
  if (message.author.bot) return;
  if (message.content === "!ping") {
    message.reply("Pong.");
  }
  if (message.content.startsWith("!titan")) {
    const hero = message.content
      .substr(6)
      .trim()
      .toLowerCase();
    console.log(`The hero named is: ${hero}`);
    try {
      getTitanGrades(hero, message);
    } catch (err) {
      message.reply("Uh oh. Something went wrong with my robot innards");
    }
  }
  if (message.content.startsWith("!offense")) {
    const hero = message.content
      .substr(8)
      .trim()
      .toLowerCase();
    console.log(`The hero named is: ${hero}`);
    try {
      getOffenseGrades(hero, message);
    } catch (err) {
      message.reply("Uh oh. Something went wrong with my robot innards");
    }
  }
  if (message.content.startsWith("!defense")) {
    const hero = message.content
      .substr(8)
      .trim()
      .toLowerCase();
    console.log(`The hero named is: ${hero}`);
    try {
      getDefenseGrades(hero, message);
    } catch (err) {
      message.reply("Uh oh. Something went wrong with my robot innards");
    }
  }
  if (message.content.startsWith("!info")) {
    const hero = message.content.substr(5).trim().toLowerCase();
    console.log(`The hero named is: ${hero}`);
    try {
      getInfo(hero, message);
    } catch (err) {
      message.reply("Uh oh. Something went wrong with my robot innards");
    }
  }
});

client.login(token);
