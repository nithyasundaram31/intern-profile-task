const User=require('../models/User')
const  generateToken=require('../utils/generateToken');
const bcrypt=require('bcryptjs')
const redis=require('../utils/redisClient');

exports.register =async(req,res)=>{

    try{
        const{name,email,password,age,dob,contact}=req.body;
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists"})
        }
        const hashed =await bcrypt.hash(password,10);
         const user = new User({ name, email, password:hashed, age,dob, contact });

          await user.save();

         const token =generateToken(user._id);
         await redis.set(token,user._id.toString(),{EX:60*60*24})
       
res.status(201).json({token})

    }
    catch(error){
        console.log("Registration error:",error);
        res.status(500).json({message:"server error"});

    }
};
exports.login=async(req,res)=>{
    try{

        const {email,password}=req.body;
        const user=await User.findOne({email});
       const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({  message: 'Invalid credentials. Please try again.' });
        }
        const token =generateToken(user._id);
        await redis.set(token,user._id.toString(), {
            EX: 60* 60* 24,
        });
        res.json({token})
    }catch(error){
        console.log("login error:",error)
          res.status(500).json({message:"server error"});


    }

};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message:"server error" });
    }
};


exports.updateProfile=async(req,res)=>{
    try{
const user =await User.findById(req.user.id);
if(!user){
    return res.status(404).json({message:"user Not found"});

}
const fields =['name', 'age', 'dob', 'contact'];
fields.forEach((a)=>{
    if(req.body[a]) user[a] =req.body[a];
});
const updated =await user.save();
res.json({message:'updated successfully',user:updated})
    }catch(error){
  res.status(500).json({message:"server error"});
    }
};