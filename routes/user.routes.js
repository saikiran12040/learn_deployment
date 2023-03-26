const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");

userRouter.post("/register", async (req, res) => {
  const {email,password,location,age}=req.body
   try {
    bcrypt.hash(password,5,async(err,hash)=>{
      const user=new UserModel({email,password:hash,location,age})
      await user.save()
      res.status(200).send({"msg":"Registration has been done!"})
    })   
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// login(authentication)
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    console.log(user);
    if(user){
      bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
          res.status(200).send({"msg":"login successfull!","token":jwt.sign({"userID":user._id},"masai")})
        } else {
          res.status(400).send({"msg":"Wrong Credentials"})
        }
      });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});


userRouter.get("/details",(req,res)=>{
    const {token}=req.query
    jwt.verify(token,'bruce',(err,decoded)=>{
        decoded?res.status(200).send("User details"):res.status(400).send({"msg":"login required cannot access the restricted route"})
    })
})

// passing authorization inside headers instead of query thing 

userRouter.get("/moviedata",(req,res)=>{
    const token=req.headers.authorization
    jwt.verify(token,'bruce',(err,decoded)=>{
        decoded?res.status(200).send("Movie"):res.status(403).send({"msg":err.message})
    });
})

module.exports = {
  userRouter,
};
