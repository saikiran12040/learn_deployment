const express=require("express")
const {connection}=require("./db")
const {userRouter}=require("./routes/user.routes")
const {noteRouter}=require("./routes/note.routes")
const {auth}=require("./middleware/auth.middleware")
const cors=require("cors")
require("dotenv").config()


const app=express()
app.use(express.json())
app.use(cors())

app.use("/users",userRouter) 
app.use(auth)
app.use("/notes",noteRouter)


app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to db")
    } catch(err) {
        console.log("Cannot connect to db")
        console.log(err)
    }
    console.log(`Server is running at port ${process.env.port}`)
})