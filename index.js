import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";

import readyEvent from "./events/ready.js";
import guildMemberUpdateEvent from "./events/guildMemberUpdate.js";
import { enviarHierarquia } from "./utils/enviarHierarquia.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Bot de hierarquia online!");
});

app.listen(3000, () => {
  console.log("🌐 Servidor web iniciado na porta 3000");
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// Bot online
client.once("ready", async () => {
  readyEvent.execute(client);

  await enviarHierarquia(client);
});

// Atualização de cargos
client.on("guildMemberUpdate", (oldMember, newMember) => {
  console.log("Evento de cargo detectado!");
  guildMemberUpdateEvent.execute(oldMember, newMember);
});

client.login(process.env.TOKEN);
