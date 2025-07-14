// const User=require('../models/User')
// const  generateToken=require('../utils/generateToken');
// const bcrypt=require('bcryptjs')
// const redis=require('../utils/redisClient');

// exports.register =async(req,res)=>{

//     try{
//         const{name,email,password,age,dob,contact}=req.body;
//         const existingUser= await User.findOne({email});
//         if(existingUser){
//             return res.status(400).json({message:"Email already exists"})
//         }
//         const hashed =await bcrypt.hash(password,10);
//          const user = new User({ name, email, password:hashed, age,dob, contact });

//           await user.save();

//          const token =generateToken(user._id);
//          await redis.set(token,user._id.toString(),{ EX: 60 * 60 * 24 })
       
// return res.status(201).json({token})

//     }
//     catch(error){
//         console.log("Registration error:",error);
//         res.status(500).json({message:"server error"});

//     }
// };
// exports.login=async(req,res)=>{
//     try{

//         const {email,password}=req.body;
//         const user=await User.findOne({email});
//         if (!user) {
//   return res.status(401).json({ message: 'Invalid credentials. Please try again.' });
// }
//        const match = await bcrypt.compare(password, user.password);
//         if (!match) {
//             return res.status(401).json({  message: 'Invalid credentials. Please try again.' });
//         }
//         const token =generateToken(user._id);
//         await redis.set(token,user._id.toString(), {
//             EX: 60* 60* 24,
//         });
//        return  res.status(200).json({token})
//     }catch(error){
//         console.log("login error:",error)
//         return res.status(500).json({message:"server error"});


//     }

// };

// exports.getProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select('-password');
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message:"server error" });
//     }
// };


// exports.updateProfile=async(req,res)=>{
//     try{
// const user =await User.findById(req.user.id);
// if(!user){
//     return res.status(404).json({message:"user Not found"});

// }
// const fields =['name', 'age', 'dob', 'contact'];
// fields.forEach((a)=>{
//     if(req.body[a]) user[a] =req.body[a];
// });
// const updated =await user.save();
// res.json({message:'updated successfully',user:updated})
//     }catch(error){
//   res.status(500).json({message:"server error"});
//     }
// };





// ✅ Modified userController.js with Redis Caching Util
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { setCache, getCache, deleteCache } = require('../utils/redisCache');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, dob, contact } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, age, dob, contact });

    const token = generateToken(user._id);
    await setCache(token, user._id.toString(), 60 * 60 * 24); // 24h

    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    await setCache(token, user._id.toString(), 60 * 60 * 24);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Profile (with Redis cache)
exports.getProfile = async (req, res) => {
  try {
    const cacheKey = `user:${req.user.id}`;

    getCache(cacheKey, async (err, cachedUser) => {
      if (cachedUser) return res.status(200).json(cachedUser);

      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });

      await setCache(cacheKey, user, 60 * 60); // cache profile for 1 hour
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile (also refresh Redis cache)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fields = ['name', 'age', 'dob', 'contact'];
    fields.forEach((field) => {
      if (req.body[field]) user[field] = req.body[field];
    });

    const updated = await user.save();

    const cacheKey = `user:${req.user.id}`;
    await setCache(cacheKey, updated, 60 * 60); // refresh cache

    res.status(200).json({ message: 'Updated successfully', user: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
