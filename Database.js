const Airtable = require("airtable");
const { promisify } = require("util");
var redis = require("redis");
var cache = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
});
const base = new Airtable({ apiKey: process.env.AIRTABLEAPI }).base(
  process.env.AIRTABLEBASE
);
const Logger = require("./Logger");
const gradesBase = base("Grades");
const heroBase = base("Heroes");

const getAsync = promisify(cache.get).bind(cache);
const setAsync = promisify(cache.set).bind(cache);

async function fetchHeroStats(hero) {
  return new Promise((res, rej) => {
    getAsync(`info-${hero}`).then(cachedData => {
      if (cachedData === null) {
        getInfo(hero)
          .then(stats => {
            setAsync(`info-${hero}`, JSON.stringify(stats), "EX", 3600).then(
              () => {
                res(stats);
              }
            );
          })
          .catch(err => console.error(err));
      } else {
        console.log("retrieved cached data");
        res(JSON.parse(cachedData));
      }
    });
  });
}

async function fetchTitanGrade(hero) {
  return new Promise((res, rej) => {
    getAsync(`titan-${hero}`).then(cachedData => {
      if (cachedData === null) {
        console.log(
          "in fetchTitanGrade > record not cached, retrieving data..."
        );
        getTitan(hero)
          .then(stats => {
            setAsync(`titan-${hero}`, JSON.stringify(stats), "EX", 3600).then(
              () => {
                res(stats);
              }
            );
          })
          .catch(err => console.error(err));
      } else {
        console.log("retrieved cached data");
        res(JSON.parse(cachedData));
      }
    });
  });
}

async function fetchDefenseGrade(hero) {
  return new Promise((res, rej) => {
    getAsync(`defense-${hero}`).then(cachedData => {
      if (cachedData === null) {
        console.log(
          "in fetchDefenseGrade > record not cached, retrieving data..."
        );
        getDefense(hero)
          .then(stats => {
            setAsync(`defense-${hero}`, JSON.stringify(stats), "EX", 3600).then(
              () => {
                res(stats);
              }
            );
          })
          .catch(err => console.error(err));
      } else {
        console.log("retrieved cached data");
        res(JSON.parse(cachedData));
      }
    });
  });
}

async function fetchOffenseGrade(hero) {
  return new Promise((res, rej) => {
    getAsync(`offense-${hero}`).then(cachedData => {
      if (cachedData === null) {
        console.log(
          "in fetchOffenseGrade > record not cached, retrieving data..."
        );
        getOffense(hero)
          .then(stats => {
            setAsync(`offense-${hero}`, JSON.stringify(stats), "EX", 3600).then(
              () => {
                res(stats);
              }
            );
          })
          .catch(err => console.error(err));
      } else {
        console.log("retrieved cached data");
        res(JSON.parse(cachedData));
      }
    });
  });
}

function getHeroData(hero, record, message) {
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

async function getInfo(hero) {
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

async function getTitan(hero) {
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

async function getDefense(hero, message) {
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

async function getOffense(hero, message) {
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

module.exports = {
  fetchDefenseGrade,
  fetchOffenseGrade,
  fetchHeroStats,
  fetchTitanGrade
};
