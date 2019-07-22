const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLEAPI }).base(
  process.env.AIRTABLEBASE
);
const Logger = require("./Logger");
const gradesBase = base("Grades");
const heroBase = base("Heroes");
const { getAsync, setAsync } = require("./cache");
const { log } = require("./utils");

function getHeroData(hero, record) {
  const data = {};
  data.heroName = hero;
  data.overallGrade = record.get("Grade");
  data.oTitan = record.get("Titan Grade")[0];
  data.oDefense = record.get("Defense Grade")[0];
  data.oOffense = record.get("Offense Grade")[0];
  data.element = record.get("Element");
  data.class = record.get("Class");
  data.family = record.get("Family");
  data.stars = record.get("Stars");
  data.power = record.get("Power");
  data.attack = record.get("Attack");
  data.defense = record.get("Defense");
  data.health = record.get("Health");
  data.special = record.get("Special");
  data.specialName = record.get("Special Name");
  data.mana = record.get("Mana");
  data.limited = record.get("Limited") === "TRUE" ? "Yes" : "No";
  return data;
}

class Service {
  constructor(hero, option) {
    this.hero = hero;
    this.option = option.toLowerCase();
  }

  async getData() {
    return new Promise((resolve, reject) => {
      getAsync(`${this.option}-${this.hero}`).then(cachedData => {
        if (cachedData === null) {
          console.log("No cached data, getting from database");
          this[this.option](this.hero).then(stats => {
            setAsync(
              `${this.option}-${this.hero}`,
              JSON.stringify(stats),
              "EX",
              86400
            )
              .then(() => {
                resolve(stats);
              })
              .catch(err => console.error(err));
          });
        } else {
          console.log("Cached data found.");
          resolve(JSON.parse(cachedData));
        }
      });
    });
  }

  info(hero) {
    return new Promise((res, rej) => {
      let count = 0;
      heroBase
        .select({
          view: "All Heroes"
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function(record) {
              let heroName = record.get("Hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = getHeroData(heroName, record);
                res(data);
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              rej(err);
            }
            if (count === 0) {
              res("Hero not found");
            }
          }
        );
    });
  }

  async titan(hero) {
    return new Promise((res, rej) => {
      let count = 0;
      gradesBase
        .select({
          view: "Hero Grades"
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function(record) {
              let heroName = record.get("Hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = {};
                data.heroName = heroName;
                data.overallGrade = record.get("Titan Overall");
                data.stamina = record.get("Titan Stamina");
                data.passive = record.get("Titan Passive");
                data.direct = record.get("Titan Direct");
                data.tiles = record.get("Titan Tiles");
                data.versatility = record.get("Titan Versatility");
                res(data);
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              log(err);
              rej(`An error occurred trying to retrieve stats for ${hero}`);
            }
            if (count === 0) {
              log("No grades found");
              res(`Titan grades not found for ${hero}`);
            }
          }
        );
    });
  }

  async defense(hero) {
    return new Promise((res, rej) => {
      let count = 0;
      gradesBase
        .select({
          view: "Hero Grades"
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function(record) {
              let heroName = record.get("Hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = {};
                data.heroName = heroName;
                data.overallGrade = record.get("Defense Overall");
                data.speed = record.get("Defense Speed");
                data.effect = record.get("Defense Effect");
                data.stamina = record.get("Defense Stamina");
                data.strength = record.get("Defense Strength");
                data.tank = record.get("Defense Tank");
                data.support = record.get("Defense Flank");
                res(data);
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              log(err);
              rej(`An error occurred trying to retrieve stats for ${hero}`);
            }
            if (count === 0) {
              res(`Defense grades not found for ${hero}`);
            }
          }
        );
    });
  }

  async offense(hero) {
    return new Promise((res, rej) => {
      let count = 0;
      gradesBase
        .select({
          view: "Hero Grades"
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(function(record) {
              let heroName = record.get("Hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = {};
                data.heroName = heroName;
                data.overallGrade = record.get("Offense Overall");
                data.speed = record.get("Offense Speed");
                data.effect = record.get("Offense Effect");
                data.stamina = record.get("Offense Stamina");
                data.war = record.get("Offense War");
                data.versatility = record.get("Offense Versatility");
                res(data);
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              log(err);
              rej(`An error occurred trying to offense stats for ${hero}`);
            }
            if (count === 0) {
              res(`Offense grades not found for ${hero}`);
            }
          }
        );
    });
  }
}

module.exports = Service;
