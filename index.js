import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import express from "express";

import "./utils/keepalive/keepalive.js";

import readyEvent from "./events/ready.js";
import { atualizarHierarquia as executarHierarquia } from "./utils/atualizarHierarquia.js";


dotenv.config();





const app = express();



app.get("/", (req, res) => {

  res.send("Bot de hierarquia online!");

});



const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {

  console.log(
    `🌐 Servidor web iniciado na porta ${PORT}`
  );

});









const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,

    GatewayIntentBits.GuildMembers

  ]

});




console.log("========== DEBUG ENV ==========");

console.log("TOKEN REAL:");
console.log(process.env.TOKEN);

console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("GUILD_ID:", process.env.GUILD_ID);

console.log("TAMANHO TOKEN:");
console.log(process.env.TOKEN?.length);

console.log("================================");

client.login(process.env.TOKEN)
    .then(() => {
        console.log("✅ Login realizado");
    })
    .catch((err) => {
        console.error("❌ Erro login:", err);
    });







let atualizando = false;





async function atualizarHierarquia() {


  if (atualizando) {


    console.log(
      "⏳ Atualização já em andamento."
    );


    return;

  }



  atualizando = true;



  try {


    console.log(
      "♻️ Atualizando hierarquia..."
    );



    await executarHierarquia(client);



    console.log(
      "✅ Hierarquia atualizada!"
    );



  } catch (erro) {


    console.log(
      "❌ Erro na hierarquia:",
      erro
    );


  }



  atualizando = false;


}









async function limparCanalHierarquia() {


  try {


    const canal = await client.channels.fetch(
      "1527420188503576629"
    );



    console.log(
      "🧹 Limpando canal..."
    );



    let mensagens;



    do {



      mensagens = await canal.messages.fetch({
        limit: 100
      });





      for (const msg of mensagens.values()) {


        try {


          await msg.delete();



        } catch {}

      }





    } while (mensagens.size > 0);





    console.log(
      "✅ Canal limpo!"
    );



  } catch (erro) {


    console.log(
      "❌ Erro limpando canal:",
      erro
    );


  }


}









client.once("ready", async () => {



  console.log(
    `✅ ${client.user.tag} está online!`
  );



  try {


    await readyEvent.execute(client);



  } catch (erro) {


    console.log(
      "❌ Erro no ready:",
      erro
    );


  }






  await limparCanalHierarquia();





  await atualizarHierarquia();







  // SCAN AUTOMÁTICO DA HIERARQUIA

  setInterval(async () => {



    console.log(
      "🔍 Checagem automática..."
    );



    await atualizarHierarquia();



  }, 60000);



});












// ATUALIZA QUANDO MUDAR CARGO

let timerHierarquia = null;





client.on(
"guildMemberUpdate",
(oldMember, newMember) => {



  console.log(
    "🔄 Mudança de cargo detectada!"
  );




  if (timerHierarquia) {


    clearTimeout(timerHierarquia);


  }






  timerHierarquia = setTimeout(async () => {



    try {



      console.log(
        "⏳ Aplicando resultado final..."
      );



      await newMember.fetch();



      await atualizarHierarquia();



      console.log(
        "✅ Atualização concluída!"
      );



    } catch (erro) {



      console.log(
        "❌ Erro atualização cargo:",
        erro
      );


    }





  }, 5000);



});









client.login(
  process.env.TOKEN
);
