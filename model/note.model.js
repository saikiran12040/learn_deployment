const mongoose=require("mongoose")

const noteSchema=mongoose.Schema({
    title:String,
    body:String,
    sub:String,
    userID:String,
},{
    versionKey:false
})

const NoteModel=mongoose.model("note",noteSchema)

module.exports={
    NoteModel
}