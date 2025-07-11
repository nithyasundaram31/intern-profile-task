const express=require('express');
const { register, getProfile, updateProfile, login } = require('../controllers/userController');
const auth = require('../middleware/auth');

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login', login);
userRouter.get('/profile', auth, getProfile);
userRouter.put('/profile',auth , updateProfile);

module.exports=userRouter;