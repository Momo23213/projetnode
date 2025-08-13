const app =require("./app")
const https=require("https")
const PORT=process.env.PORT|| 5000
//pour demarrer le server

// --- ANTI-SOMMEIL ---
function antiSleep(url) {
  if (!url) return console.error("❌ URL Render manquante");
  setInterval(() => {
    https.get(url, (res) => {
      console.log(`🔄 Ping à ${url} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error("⚠️ Erreur ping :", err.message);
    });
  }, 5 * 60 * 1000);
}

antiSleep(process.env.RENDER_URL)

app.listen(PORT,()=>{
    console.log(`Le server est lancé sur le port ${process.env.PORT}`);
})
