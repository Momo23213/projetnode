const app =require("./app")
const PORT=process.env.PORT|| 5000
//pour demarrer le server
app.listen(PORT,()=>{
    console.log(`Le server est lancé sur le port ${process.env.PORT}`);
})
