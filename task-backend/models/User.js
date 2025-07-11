const mongoose = require('mongoose');
const userSchema =new mongoose.Schema({

    name: { 
        
    type:String,
    reqired: true
},
email:{
     type:String,
    reqired: true,
    lowercase:true,
    unique:true
},
password:{
     type:String,
    reqired: true 
},
age:{
    type: Number,
    min :0
},
dob:{
    type:Date
},
contact:{
    type:String,
},

}, {
    timestamps:true
});

module.exports = mongoose.model('User', userSchema, 'users');