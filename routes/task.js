const express=require("express");
const router = express.Router();
const Task=require('../models/Task');
const { body, validationResult } = require('express-validator');
const { request } = require("express");
const fetchtask = require("../middelware/fetchtask");

// Route1: fetchingAllTask using get request
router.get('/fetchalltask',fetchtask, async(req, res) => {
    try {
      const task=await Task.find();
      res.json(task);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  });

// Route2: fetchingATask using get request
router.get('/fetchatask',fetchtask, async(req, res) => {
  try {
    const task=await Task.find({user:req.user.id});
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

// Route2: adding new Task using post 
router.post("/addtask",[
  body("title"),
  body("description"),
  body("due_date"),
  body("priority"),
  body("status")
],fetchtask,async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const {title,description,due_date,priority,status}=req.body;
    const task=new Task({
      title,description,due_date,priority,status,user:req.user.id
    });
    const saveData=await task.save();
    res.json(saveData);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

// Route3:Updateing the existing Task
router.put("/updatetask/:id",fetchtask,async (req,res)=>{
  const {title,description,due_date,priority,status}=req.body;
  // creating a Task object
  const newTask={};
  if(title){newTask.title=title};
  if(description){newTask.description=description};
  if(due_date){newTask.due_date=due_date};
  if(priority){newTask.priority=priority};
  if(status){newTask.status=status};
  //find the Task to be update and update it
  let task=await Task.findById(req.params.id);
  if(!task){return res.status(404).send("Not Found")};
  if(task.user.toString()!==req.user.id){
    return res.send("Not Allowed");
  }
  task=await Task.findByIdAndUpdate(req.params.id,{$set:newTask},{new:true});
  res.json({Task});
});

// Route:4 delete the using delete request
router.delete("/deletetask/:id",fetchtask,async (req,res)=>{
  //find the Task to be delete and delete it
  try{
    let task=await Task.findById(req.params.id);
    if(!task){return res.status(404).send("Not Found")};
    if(task.user.toString()!==req.user.id){
      return res.send("Not Allowed");
    }
    task=await Task.findByIdAndDelete(req.params.id);
    res.json("Success:The note has been deleted");
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports=router