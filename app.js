const express =require("express")
const cors=require("cors")
const cookieParser=require("cookie-parser")
require("dotenv").config({path:"./config/.env"})
const {db} =require("./config/db")




const app=express()
app.use(cookieParser());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
db()
app.use(express.json())
// Middleware pour capter les requêtes 
app.use(require("./middlewares/logger"))

//Les routes pour ajoute une taches
app.use("/tache",require("./routes/taches.routes"))

//les routes pour ajouter un membre
app.use("/membre",require("./routes/membre.routes"))

// Middleware pour capter les erreurs
app.use(require("./middlewares/errorHandler"))



module.exports=app