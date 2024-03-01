const express=require("express");
const User=require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchtask=require("../middelware/fetchtask");

const JWT_SECRET="Rannyisagood$boy";

// Route1:create a user using post: ./api/auth/ 
router.post('/createuser',[
  body("phone_number"),
  body("priority")
], async (req, res) => {
  let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try{
    let user=await User.findOne({phone_number:req.body.phone_number});
    if(user){
      return res.status(400).json({ errors: "invalid phone_number" });
    }
    // const salt = await bcrypt.genSalt(10);
    // const secpass = await bcrypt.hash(req.body.phone_number, salt);
    user= await User.create({
      phone_number:req.body.phone_number,
      priority:req.body.priority});
      const data={
        user:{
          id:user.id
        }
      }
      const Authtoken=jwt.sign(data,JWT_SECRET);
      success=true;
      res.json({success,Authtoken});
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  });
// Route2:creating a login endpoint using post request
  router.post('/login',[
    body("phone_number"),
    body("priority").exists()
  ], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {phone_number,priority}=req.body;
    try{
      let user=await User.findOne({phone_number});
      if(!user){
        return res.status(400).json({ errors: "user does not exist" });
      }

      // const phone_numberCompare= await bcrypt.compare(phone_number,user.phone_number);
      // if(!p){
      //   return res.status(400).json({ errors: "user does not exist" });
      // }

      const data={
        user:{
          id:user.id
        }
      }
      const Authtoken=jwt.sign(data,JWT_SECRET);
      success=true;
      res.json({success,Authtoken});
      }
      catch(error){
        console.error(error.message);
        res.status(500).send("Internal error occured");
      }

    });

  //   // Route3:creating a getuser endpoint using post request
  // router.post('/getuser',fetchprofile,async (req, res) => {
  //   try{
  //     userid=req.user.id;
  //     const user=await User.findById(userid).select("-passward");
  //     res.send(user);
  //     }
  //     catch(error){
  //       console.error(error.message);
  //       res.status(500).send("Internal  server error occured");
  //     }

  //   });

module.exports=router