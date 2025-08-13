const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status:{ 
    type: String, 
    enum: ['en cours', 'terminée'], 
    default: 'en cours' 
},
  priority:{ 
    type: String, 
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne' 
},
assignedTo:{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'MembreEquique'
    },
  createdBy:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MembreEquique' 
}
},{ timestamps: true });

module.exports=mongoose.model("Taches",TaskSchema)