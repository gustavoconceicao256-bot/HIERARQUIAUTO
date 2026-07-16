import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import readyEvent from "./events/ready.js";
import guildMemberUpdateEvent from "./events/guildMemberUpdate.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// Evento Ready
client.once("ready", () => {
  readyEvent.execute(client);
});

// Evento de atualização de cargos
client.on("guildMemberUpdate", (oldMember, newMember) => {
  console.log("Evento de cargo detectado!");
  guildMemberUpdateEvent.execute(oldMember, newMember);
});

client.login(process.env.TOKEN);
