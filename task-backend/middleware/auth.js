// middleware/auth.js
const jwt = require('jsonwebtoken');

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