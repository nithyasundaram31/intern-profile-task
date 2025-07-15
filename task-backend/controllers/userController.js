const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { setCache, getCache } = require('../utils/redisCache');

// Login 
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log('Password mismatch for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        
        // Store token in Redis 
        try {
            await setCache(token, user._id.toString(), 60 * 60 * 24); 
            console.log('Token stored in Redis successfully');
        } catch (redisError) {
            console.error('Redis error during login:', redisError);
           
        }

        res.status(200).json({ 
            token,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Register 
exports.register = async (req, res) => {
    try {
        const { name, email, password, age, dob, contact } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({ 
            name, 
            email, 
            password: hashed, 
            age, 
            dob, 
            contact 
        });

        const token = generateToken(user._id);
        
        // Store token in Redis
        try {
            await setCache(token, user._id.toString(), 60 * 60 * 24); 
            console.log('Registration token stored in Redis');
        } catch (redisError) {
            console.error('Redis error during registration:', redisError);
        }

        res.status(201).json({ 
            token,
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

//  Profile
exports.getProfile = async (req, res) => {
    try {
        const cacheKey = `user:${req.user.id}`;
        
        // Try to get from cache first
        let cachedUser = null;
        try {
            cachedUser = await getCache(cacheKey);
        } catch (cacheError) {
            console.error('Cache retrieval error:', cacheError);
        }

        if (cachedUser) {
            console.log('User data retrieved from cache');
            return res.status(200).json(cachedUser);
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cache the user data
        try {
            await setCache(cacheKey, user, 60 * 60); 
            console.log('User data cached successfully');
        } catch (cacheError) {
            console.error('Cache storage error:', cacheError);
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Profile with cache refresh
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const allowedFields = ['name', 'age', 'dob', 'contact'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        const updated = await user.save();

        const cacheKey = `user:${req.user.id}`;
        try {
            await setCache(cacheKey, updated, 60 * 60); 
            console.log('User cache updated after profile update');
        } catch (cacheError) {
            console.error('Cache update error:', cacheError);
        }

        res.status(200).json({ 
            message: 'Profile updated successfully', 
            user: {
                id: updated._id,
                name: updated.name,
                email: updated.email,
                age: updated.age,
                dob: updated.dob,
                contact: updated.contact
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};















