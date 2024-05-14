import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRoute from "./routes/userRoute.js"

dotenv.config()
const app = express()
const port = process.env.port
const uri = process.env.mongo_url

app.use(express.json())
app.use("/user",userRoute)

mongoose.connect(uri)
.then(()=>{
    app.listen(port ,()=>{
        console.log(`Server Running on port ${port}`)
    })
    
})
.catch((error)=>{
    console.log(error)})
