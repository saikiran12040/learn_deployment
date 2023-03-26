const express=require("express")
const noteRouter=express.Router()
const {NoteModel}=require("../model/note.model")
const jwt=require("jsonwebtoken")

noteRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    try{
        if(decoded){
            const notes=await NoteModel.find({"userID":decoded.userID})
            res.status(200).send(notes)
        }
    } catch(err) {
        res.status(400).send({"msg":err.message})
    }
})

noteRouter.post("/add",async(req,res)=>{
    try{
        const note=new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg":"A new note has been added"})
    } catch(err) {
        res.status(400).send({"msg":err.message})
    }
})

noteRouter.patch("/update/:noteID",async(req,res)=>{
    const payload=req.body
    const noteID=req.params.noteID
    try{
        await NoteModel.findByIdAndUpdate({_id:noteID},payload)
        res.status(200).send({"msg":"Note has been updated"})
    } catch (err) {
        res.status(400).send({"msg":err.message})
    }
})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const noteID=req.params.noteID
    const token=req.headers.authorization.split(" ")[1]
    const decoded=jwt.verify(token,"masai")
    const req_id=decoded.userID
    const note=NoteModel.findOne({_id:noteID})
    const userID_in_note=note.userID
    try{
        // await NoteModel.findByIdAndDelete({_id:noteID})
        // res.status(200).send({"msg":"Note has been deleted"})
        if(req_id===userID_in_note){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.status(200).send({"msg":"Note has been deleted"})
        } else {
            res.status(400).send({"msg":"Not Authorized"})
        }
    } catch (err) {
        res.status(400).send({"msg":err.message})
    }
})

module.exports={
    noteRouter 
}