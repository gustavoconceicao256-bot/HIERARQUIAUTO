import https from "https";

const URL = "https://hierarquiauto.onrender.com/";

function acordarBot() {
  https.get(URL, (res) => {
    console.log(`🔋 KeepAlive: ${res.statusCode}`);
  }).on("error", (err) => {
    console.log("❌ KeepAlive erro:", err.message);
  });
}

console.log("🟢 KeepAlive iniciado!");

setInterval(acordarBot, 60 * 1000);
