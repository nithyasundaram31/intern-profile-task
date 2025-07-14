// const redis = require('@upstash/redis');
// const redisClient = new redis.Redis({
//   url: process.env.UPSTASH_REDIS_URL,
//   token: process.env.UPSTASH_REDIS_TOKEN,
// });

// function setCache(key, value, expiration = 3600) {
//   redisClient.set(key, JSON.stringify(value), { ex: expiration });
// }

// function getCache(key, callback) {

//   redisClient.get(key).then((data) => {
//     if (data) {
//       callback(null, JSON.parse(data));
//     } else {
//       callback(null, null);
//     }
//   }).catch((err) => {
//     callback(err, null);
//   });
// }

// function deleteCache(key, callback) {
//   redisClient.del(key).then((response) => {
//     callback(null, response);
//   }).catch((err) => {
//     callback(err);
//   });
// }

// module.exports = { setCache, getCache, deleteCache };





const redis = require('./redisClient');

// Set cache with promise
async function setCache(key, value, expiration = 3600) {
    try {
        const result = await redis.set(key, JSON.stringify(value), { ex: expiration });
        console.log(`Cache set for key: ${key}`);
        return result;
    } catch (error) {
        console.error('Error setting cache:', error);
        throw error;
    }
}

// Get cache with promise
async function getCache(key) {
    try {
        const data = await redis.get(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error getting cache:', error);
        throw error;
    }
}

// Delete cache with promise
async function deleteCache(key) {
    try {
        const result = await redis.del(key);
        console.log(`Cache deleted for key: ${key}`);
        return result;
    } catch (error) {
        console.error('Error deleting cache:', error);
        throw error;
    }
}

module.exports = { setCache, getCache, deleteCache };