// middleware/auth.js
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided or invalid format'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // JWT verify pannunga
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Redis check optional aakkunga
        try {
            const storedUserId = await getCache(token);
            if (storedUserId !== null && storedUserId !== decoded.id) {
                return res.status(401).json({
                    message: "Session expired or invalid"
                });
            }
        } catch (redisError) {
            console.error('Redis error in auth middleware:', redisError);
            // Redis fail aanalum JWT valid na continue pannunga
        }

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