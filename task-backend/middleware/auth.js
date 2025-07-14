const jwt = require('jsonwebtoken');
const { getCache } = require('../utils/redisCache');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided or invalid format'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token exists in Redis
        let storedUserId = null;
        try {
            storedUserId = await getCache(token);
        } catch (redisError) {
            console.error('Redis error in auth middleware:', redisError);
            // Continue without Redis check if Redis is down
        }

        // If Redis is working, verify the token is still valid
        if (storedUserId !== null && storedUserId !== decoded.id) {
            return res.status(401).json({ 
                message: "Session expired or invalid" 
            });
        }

        // Add user info to request
        req.user = { id: decoded.id };
        next();

    } catch (err) {
        console.error('Auth middleware error:', err);
        
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token has expired' 
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Token is invalid' 
            });
        }
        
        return res.status(401).json({ 
            message: 'Authentication failed' 
        });
    }
};


module.exports = auth;

// const jwt = require('jsonwebtoken');
// const redis = require('../utils/redisClient');

// const auth = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader?.startsWith('Bearer ')) {
//         return res.status(401).json({
//             message: 'Not authorized'
//         });
//     }      

//     const token = authHeader.split(' ')[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const stored = await redis.get(token);
//         if (!stored || stored !== decoded.id) {
//             return res.status(401).json({ message: "session expired or invalid" });
//         }

//         req.user = { id: decoded.id }
//         next();
//     }

//     catch (err) {

//         res.status(401).json({ message: 'Token is invalid or expired' })
//     }
// };
// module.exports = auth;