const express=require("express");
const router = express.Router();
const subTask=require('../models/Subtask');
const { body, validationResult } = require('express-validator');
const { request } = require("express");
const fetchtask = require("../middelware/fetchtask");

// Route1: fetchingAllsubTask using get request
router.get('/fetchallsubtask',fetchtask, async(req, res) => {
    try {
      const subtask=await subTask.find();
      res.json(subtask);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  });

// Route2: fetchingAsubTask using get request
router.get('/fetchasubtask',fetchtask, async(req, res) => {
  try {
    const subtask=await subTask.find({user:req.user.id});
    res.json(subtask);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

// Route2: adding new subTask using post 
router.post("/addsubtask",[
  body("status")
],fetchtask,async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const {status}=req.body;
    const subtask=new subTask({
      task_id:req.user.id,status
    });
    const saveData=await subtask.save();
    res.json(saveData);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

// Route3:Updateing the existing subTask
router.put("/updatesubtask/:id",fetchtask,async (req,res)=>{
  const {status}=req.body;
  // creating a subTask object
  const newsubTask={};
  if(status){newsubTask.status=status};
  //find the subTask to be update and update it
  let subtask=await subTask.findById(req.params.id);
  if(!subtask){return res.status(404).send("Not Found")};
//   console.log(subtask.task_id);
//   console.log(req.user.id);
  if(subtask.task_id.toString()!==req.user.id){
    return res.send("Not Allowed");
  }
  subtask=await subTask.findByIdAndUpdate(req.params.id,{$set:newsubTask},{new:true});
  res.json({subTask});
});

// Route:4 delete the using delete request
router.delete("/deletesubtask/:id",fetchtask,async (req,res)=>{
  //find the subTask to be delete and delete it
  try{
    let subtask=await subTask.findById(req.params.id);
    if(!subtask){return res.status(404).send("Not Found")};
    if(subtask.task_id.toString()!==req.user.id){
      return res.send("Not Allowed");
    }
    subtask=await subTask.findByIdAndDelete(req.params.id);
    res.json("Success:The note has been deleted");
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports=router