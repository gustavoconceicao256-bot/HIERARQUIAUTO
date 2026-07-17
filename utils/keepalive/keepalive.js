import https from "https";

const URL = "https://hierarquiauto.onrender.com";

setInterval(() => {
  https.get(URL, () => {
    console.log("🔋 KeepAlive funcionando!");
  });
}, 5 * 60 * 1000);

console.log("🟢 KeepAlive iniciado!");
