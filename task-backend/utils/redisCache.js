const redis = require('@upstash/redis');
const redisClient = new redis.Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

function setCache(key, value, expiration = 3600) {
  redisClient.set(key, JSON.stringify(value), { ex: expiration });
}

function getCache(key, callback) {
  redisClient.get(key).then((data) => {
    if (data) {
      callback(null, JSON.parse(data));
    } else {
      callback(null, null);
    }
  }).catch((err) => {
    callback(err, null);
  });
}

function deleteCache(key, callback) {
  redisClient.del(key).then((response) => {
    callback(null, response);
  }).catch((err) => {
    callback(err);
  });
}

module.exports = { setCache, getCache, deleteCache };
