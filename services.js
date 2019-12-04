const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const Logger = require("./Logger");
const gradesBase = base("Grades");
const heroBase = base("Heroes");
const { getAsync, setAsync } = require("./cache");
const { log } = require("./utils");

function getHeroData(hero, json) {
  console.log(json);
  const record = json.fields;
  const data = {};
  data.heroName = hero;
  data.overallGrade = record.grade;
  data.oTitan = record.titanGrade;
  data.oDefense = record.defenseGrade;
  data.oOffense = record.offenseGrade;
  data.element = record.element;
  data.class = record.class;
  data.family = record.family;
  data.stars = record.stars;
  data.power = record.power;
  data.attack = record.attack;
  data.defense = record.defense;
  data.health = record.health;
  data.special = record.special;
  data.specialName = record.specialName;
  data.mana = record.mana;
  data.limited = record.limited;
  return data;
}

class Service {
  constructor(hero, option) {
    this.hero = hero;
    this.option = option.toLowerCase();
  }

  async getData() {
    return new Promise((resolve, reject) => {
      this[this.option](this.hero)
        .then(stats => {
          resolve(stats);
        })
        .catch(err => reject(err));
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
              let heroName = record.get("hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = getHeroData(heroName, record._rawJson);
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
              rej(
                `Hmm.. I couldn't find info on ${hero}. If this is an error, please let my owner <@!${process.env.ERROR_NOTIFICATION_USER_ID}> know.`
              );
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
              rej(`An error occurred trying to retrieve stats for ${hero}`);
            }
            if (count === 0) {
              log("No titan grades found");
              rej(`Titan grades not found for ${hero}`);
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
              rej(`An error occurred trying to retrieve stats for ${hero}`);
            }
            if (count === 0) {
              log("No defense grades found");
              rej(`Defense grades not found for ${hero}`);
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
              rej(`An error occurred trying to offense stats for ${hero}`);
            }
            if (count === 0) {
              log("No offense grades found");
              rej(`Offense grades not found for ${hero}`);
            }
          }
        );
    });
  }
}

module.exports = Service;
