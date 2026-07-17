import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";

import "./utils/keepalive/keepalive.js";

import readyEvent from "./events/ready.js";
import guildMemberUpdateEvent from "./events/guildMemberUpdate.js";
import { enviarHierarquia } from "./utils/enviarHierarquia.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Bot de hierarquia online!");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Servidor web iniciado na porta ${PORT}`);
});


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});


console.log("TOKEN EXISTE?", !!process.env.TOKEN);


// Evita várias atualizações juntas
let atualizando = false;


async function atualizarAgora() {

  if (atualizando) return;

  atualizando = true;

  try {

    console.log("♻️ Atualizando hierarquia...");

    await enviarHierarquia(client);

    console.log("✅ Hierarquia atualizada!");

  } catch (err) {

    console.log("❌ Erro ao atualizar hierarquia:", err);

  }

  atualizando = false;

}



client.once("ready", async () => {

  console.log(`✅ ${client.user.tag} está online!`);

  await readyEvent.execute(client);

  await atualizarAgora();

});



client.on("guildMemberUpdate", async (oldMember, newMember) => {

  console.log("🔄 Cargo alterado detectado!");

  await guildMemberUpdateEvent.execute(oldMember, newMember);

  // Atualiza na hora
  await atualizarAgora();

});



client.login(process.env.TOKEN);
