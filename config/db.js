const mongoose=require("mongoose")
require("dotenv").config({path:"./config/.env"});

exports.db=async ()=>{
    try{
          await mongoose.connect(process.env.DB)
          console.log("Mongodb connecté");
    }catch(err){
          console.log("Mongodb non connecté");
          console.log(`error ${err}`);
    }
}