const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLEAPI }).base(
  process.env.AIRTABLEBASE
);
const Logger = require("./Logger");
const gradesBase = base("Grades");
const heroBase = base("Heroes");

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
  return Logger.success["info"](message, data);
}

function getInfo(hero, message) {
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
            try {
              getHeroData(heroName, record, message);
            } catch (err) {
              Logger.error(hero, err, message);
            }
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          Logger.error(hero, err, message);
        }
        if (count === 0) {
          Logger.noData(message, hero);
        }
      }
    );
}

function getTitan(hero, message) {
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
            Logger.success["titan"](message, data);
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          Logger.error(hero, err);
        }
        if (count === 0) {
          Logger.noData(message, hero);
        }
      }
    );
}

function getDefense(hero, message) {
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
            Logger.success["defense"](message, data);
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          Logger.error(hero, err);
        }
        if (count === 0) {
          Logger.noData(message, hero);
        }
      }
    );
}

function getOffense(hero, message) {
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
            Logger.success["offense"](message, data);
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          Logger.error(hero, err);
        }
        if (count === 0) {
          Logger.noData(message, hero);
        }
      }
    );
}

module.exports = { getInfo, getTitan, getDefense, getOffense };
