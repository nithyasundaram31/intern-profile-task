const express=require("express");
const userRouter = require("./routes/userRoutes");
const cors=require('cors')



const app=express()
app.use(express.json());
app.use(cors({
      origin: 'https://silver-liger-0e6f3f.netlify.app', 
    credentials: true, // Allow credentials to be sent
}))

app.use('/api/users',userRouter)

app.get("/",(req,res)=>{
 res.send("server is running")
})


module.exports=app