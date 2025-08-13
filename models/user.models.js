const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  email:{
     type: String, 
     unique: true 
    },
  password:{
     type:String,
     required:true
    },
  role: { 
    type: String, 
    enum: ['Admin', 'Membre'],
    default: "Membre" 

  } // 'admin' ou 'member'
},{timestamps:true});

module.exports=mongoose.model("MembreEquique",UserSchema)