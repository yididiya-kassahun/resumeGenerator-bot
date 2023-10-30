const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resumeSchema = new Schema({
   chatId: {
    type: String,
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
   }
});

module.exports = mongoose.model('resume',resumeSchema);