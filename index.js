import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";

import "./utils/keepalive/keepalive.js";

import readyEvent from "./events/ready.js";
import guildMemberUpdateEvent from "./events/guildMemberUpdate.js";
import { atualizarHierarquia as executarHierarquia } from "./utils/atualizarHierarquia.js";

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







let atualizando = false;



async function atualizarHierarquia() {


  if (atualizando) {

    console.log("⏳ Atualização já está acontecendo.");

    return;

  }



  atualizando = true;



  try {


    console.log("♻️ Atualizando hierarquia...");



    await executarHierarquia(client);



    console.log("✅ Hierarquia atualizada!");



  } catch (erro) {


    console.log("❌ Erro na hierarquia:", erro);



  }



  atualizando = false;



}









client.once("ready", async () => {



  console.log(`✅ ${client.user.tag} está online!`);



  await readyEvent.execute(client);



  await atualizarHierarquia();



});









// BLOQUEADOR DE AÇÕES RÁPIDAS

let timerHierarquia = null;

let ultimaMudanca = null;



client.on("guildMemberUpdate", (oldMember, newMember) => {



  console.log("🔄 Mudança de cargo detectada!");



  // guarda a última alteração
  ultimaMudanca = {
    oldMember,
    newMember
  };



  // cancela qualquer atualização pendente
  if (timerHierarquia) {

    clearTimeout(timerHierarquia);

  }





  // espera 5 segundos sem nenhuma mudança

  timerHierarquia = setTimeout(async () => {



    if (!ultimaMudanca) return;



    try {



      console.log("⏳ Aplicando somente última alteração...");



      await guildMemberUpdateEvent.execute(

        ultimaMudanca.oldMember,

        ultimaMudanca.newMember

      );



      await atualizarHierarquia();



      console.log("✅ Resultado final atualizado!");



      ultimaMudanca = null;



    } catch (erro) {



      console.log("❌ Erro no resultado final:", erro);



    }



  }, 5000);



});








client.login(process.env.TOKEN);
