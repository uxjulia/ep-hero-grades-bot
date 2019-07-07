const { promisify } = require("util");
const redis = require("redis");
const cache = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
});

const getAsync = promisify(cache.get).bind(cache);
const setAsync = promisify(cache.set).bind(cache);

module.exports = {
  getAsync,
  setAsync
};
