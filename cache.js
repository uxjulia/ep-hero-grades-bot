const { promisify } = require("util");
const redis = require("redis");
const cache = redis.createClient(process.env.REDIS_CLOUD_URL, {
  no_ready_check: true
});

const getAsync = promisify(cache.get).bind(cache);
const setAsync = promisify(cache.set).bind(cache);

module.exports = {
  getAsync,
  setAsync
};
