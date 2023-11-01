const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resumeSchema = new Schema({
   chatId: {
    type: String,
    required:true
    },
   photoURL:{
    type: String,
    required:true
    },
   aboutMe:{
   type:String,
   required:true
    },
   fullName: {
    type: String,
    required:true
   },
   jobTitle: {
    type: String,
    required:true
   },
   age: {
    type: String,
    required:true
   },
   email: {
    type: String,
    required:true
   },
   phone: {
    type: String,
    required:true
   },
   address:{
    type:String,
    required:true
   },
   professionalSkills:[
      {
         title:[],
         skillLevel: [],
      }
   ],
   // workExperience:[
   //    {
   //       title:String,
   //       interval:String,
   //       keyAchievement:String,
   //       required:true
   //    }
   // ],
   // Education:[
   //    {
   //       title:String,
   //       interval:String,
   //       detail:String,
   //       required:true
   //    }
   // ],
   // softSkills:[
   //    {
   //       skillName:String
   //    }
   // ]
});

module.exports = mongoose.model('resume',resumeSchema);