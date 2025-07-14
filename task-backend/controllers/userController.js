const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { setCache, getCache, deleteCache } = require('../utils/redisCache');

// Login function with proper error handling
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log('Password mismatch for email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);
        
        // Store token in Redis with proper error handling
        try {
            await setCache(token, user._id.toString(), 60 * 60 * 24); // 24 hours
            console.log('Token stored in Redis successfully');
        } catch (redisError) {
            console.error('Redis error during login:', redisError);
            // Continue with login even if Redis fails
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

// Register function with proper error handling
exports.register = async (req, res) => {
    try {
        const { name, email, password, age, dob, contact } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
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

        // Generate token
        const token = generateToken(user._id);
        
        // Store token in Redis
        try {
            await setCache(token, user._id.toString(), 60 * 60 * 24); // 24 hours
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

// Get Profile with improved caching
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

        // Get from database
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cache the user data
        try {
            await setCache(cacheKey, user, 60 * 60); // 1 hour
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

        // Update allowed fields
        const allowedFields = ['name', 'age', 'dob', 'contact'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        const updated = await user.save();

        // Refresh cache
        const cacheKey = `user:${req.user.id}`;
        try {
            await setCache(cacheKey, updated, 60 * 60); // 1 hour
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





















// // const User=require('../models/User')
// // const  generateToken=require('../utils/generateToken');
// // const bcrypt=require('bcryptjs')
// // const redis=require('../utils/redisClient');

// // exports.register =async(req,res)=>{

// //     try{
// //         const{name,email,password,age,dob,contact}=req.body;
// //         const existingUser= await User.findOne({email});
// //         if(existingUser){
// //             return res.status(400).json({message:"Email already exists"})
// //         }
// //         const hashed =await bcrypt.hash(password,10);
// //          const user = new User({ name, email, password:hashed, age,dob, contact });

// //           await user.save();

// //          const token =generateToken(user._id);
// //          await redis.set(token,user._id.toString(),{ EX: 60 * 60 * 24 })
       
// // return res.status(201).json({token})

// //     }
// //     catch(error){
// //         console.log("Registration error:",error);
// //         res.status(500).json({message:"server error"});

// //     }
// // };
// // exports.login=async(req,res)=>{
// //     try{

// //         const {email,password}=req.body;
// //         const user=await User.findOne({email});
// //         if (!user) {
// //   return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
// // }
// //        const match = await bcrypt.compare(password, user.password);
// //         if (!match) {
// //             return res.status(401).json({  message: 'Invalid credentials. Please try again.' });
// //         }
// //         const token =generateToken(user._id);
// //         await redis.set(token,user._id.toString(), {
// //             EX: 60* 60* 24,
// //         });
// //        return  res.status(200).json({token})
// //     }catch(error){
// //         console.log("login error:",error)
// //         return res.status(500).json({message:"server error"});


// //     }

// // };

// // exports.getProfile = async (req, res) => {
// //     try {
// //         const user = await User.findById(req.user.id).select('-password');
// //         res.json(user);
// //     } catch (err) {
// //         res.status(500).json({ message:"server error" });
// //     }
// // };


// // exports.updateProfile=async(req,res)=>{
// //     try{
// // const user =await User.findById(req.user.id);
// // if(!user){
// //     return res.status(404).json({message:"user Not found"});

// // }
// // const fields =['name', 'age', 'dob', 'contact'];
// // fields.forEach((a)=>{
// //     if(req.body[a]) user[a] =req.body[a];
// // });
// // const updated =await user.save();
// // res.json({message:'updated successfully',user:updated})
// //     }catch(error){
// //   res.status(500).json({message:"server error"});
// //     }
// // };





// // ✅ Modified userController.js with Redis Caching Util
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const generateToken = require('../utils/generateToken');
// const { setCache, getCache, deleteCache } = require('../utils/redisCache');

// // Register
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, age, dob, contact } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: 'Email already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed, age, dob, contact });

//     const token = generateToken(user._id);
//     await setCache(token, user._id.toString(), 60 * 60 * 24); // 24h

//     res.status(201).json({ token });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Login
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = generateToken(user._id);
//     await setCache(token, user._id.toString(), 60 * 60 * 24);

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get Profile (with Redis cache)
// exports.getProfile = async (req, res) => {
//   try {
//     const cacheKey = `user:${req.user.id}`;

//     getCache(cacheKey, async (err, cachedUser) => {
//       if (cachedUser) return res.status(200).json(cachedUser);

//       const user = await User.findById(req.user.id).select('-password');
//       if (!user) return res.status(404).json({ message: 'User not found' });

//       await setCache(cacheKey, user, 60 * 60); // cache profile for 1 hour
//       res.status(200).json(user);
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Update Profile (also refresh Redis cache)
// exports.updateProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const fields = ['name', 'age', 'dob', 'contact'];
//     fields.forEach((field) => {
//       if (req.body[field]) user[field] = req.body[field];
//     });

//     const updated = await user.save();

//     const cacheKey = `user:${req.user.id}`;
//     await setCache(cacheKey, updated, 60 * 60); // refresh cache

//     res.status(200).json({ message: 'Updated successfully', user: updated });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };
