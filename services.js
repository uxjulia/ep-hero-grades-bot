const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const gradesBase = base("Grades");
const heroBase = base("Heroes");
const hotmBase = base("Hotm");
const { log } = require("./utils");

async function getHotm(id) {
  return new Promise((resolve, reject) => {
    hotmBase
      .find(id)
      .then(data => {
        resolve(data._rawJson.fields);
      })
      .catch(err => {
        resolve(undefined);
      });
  });
}

async function getHeroData(hero, json) {
  const record = json.fields;
  const data = {};
  let hotmInfo = await getHotm(record.hotm_link_id);

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
  data.hotmInfo = hotmInfo;
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
              let heroName = record.get("hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = {};
                data.heroName = heroName;
                data.overallGrade = record.get("titanOverall");
                data.stamina = record.get("titanStamina");
                data.passive = record.get("titanPassive");
                data.direct = record.get("titanDirect");
                data.tiles = record.get("titanTiles");
                data.versatility = record.get("titanVersatility");
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
              let heroName = record.get("hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = {};
                data.heroName = heroName;
                data.overallGrade = record.get("defenseOverall");
                data.speed = record.get("defenseSpeed");
                data.stamina = record.get("defenseStamina");
                data.passive = record.get("defensePassive");
                data.direct = record.get("defenseDirect");
                data.tank = record.get("defenseTank");
                data.flank = record.get("defenseFlank");
                data.wing = record.get("defenseWing");
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
              let heroName = record.get("hero");
              if (heroName.toLowerCase() === hero) {
                count++;
                const data = {};
                data.heroName = heroName;
                data.overallGrade = record.get("offenseOverall");
                data.speed = record.get("offenseSpeed");
                data.stamina = record.get("offenseStamina");
                data.passive = record.get("offensePassive");
                data.direct = record.get("offenseDirect");
                data.war = record.get("offenseWar");
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
