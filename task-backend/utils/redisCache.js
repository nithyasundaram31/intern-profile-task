const { redis, isConnected, createRedisConnection } = require('./redisClient');

async function setCache(key, value, expiration = 3600) {
    try {
        if (!isConnected) {
            await createRedisConnection();
        }
        
        const result = await redis.set(key, JSON.stringify(value), { ex: expiration });
        console.log(`Cache set for key: ${key}`);
        return result;
    } catch (error) {
        console.error('Error setting cache:', error);
        return null;
    }
}

async function getCache(key) {
    try {
        if (!isConnected) {
            await createRedisConnection();
        }
        
        const data = await redis.get(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error getting cache:', error);
        return null; 
    }
}

module.exports = { setCache, getCache };