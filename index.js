
import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

import "./utils/keepalive/keepalive.js";

import { atualizarHierarquia as executarHierarquia } from "./utils/atualizarHierarquia.js";



// ===============================
// SERVIDOR WEB KEEP ALIVE
// ===============================

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




// ===============================
// CLIENT DISCORD
// ===============================

const client = new Client({

  intents: [

    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers

  ]

});




// ===============================
// TOKEN
// ===============================

const TOKEN = process.env.TOKEN?.trim();


console.log("========== DEBUG TOKEN ==========");

console.log(
  "TOKEN EXISTE:",
  !!TOKEN
);

console.log(
  "TEM PONTO:",
  TOKEN.includes(".")
);

console.log(
  "FINAL:",
  TOKEN?.substring(
    TOKEN.length - 10
  )
);

console.log(
  "TAMANHO:",
  TOKEN?.length
);

console.log("================================");



if (!TOKEN) {

  console.error(
    "❌ TOKEN não encontrado no .env!"
  );

  process.exit(1);

}





// ===============================
// LOGIN DISCORD
// ===============================

async function iniciarBot(){

  try {

    await client.login(TOKEN);

    console.log(
      "✅ Login realizado!"
    );


  } catch (erro) {

    console.error(
      "❌ Erro login:",
      erro
    );

    process.exit(1);

  }

}





// ===============================
// CONTROLE HIERARQUIA
// ===============================

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







// ===============================
// LIMPAR CANAL
// ===============================

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







// ===============================
// BOT ONLINE
// ===============================

client.once(
"ready",
async () => {


  console.log(
    `✅ ${client.user.tag} está online!`
  );


  await limparCanalHierarquia();



  await atualizarHierarquia();





  setInterval(async () => {


    console.log(
      "🔍 Checagem automática..."
    );


    await atualizarHierarquia();



  }, 60000);



});







// ===============================
// ATUALIZA QUANDO MUDAR CARGO
// ===============================

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





  timerHierarquia = setTimeout(
  async () => {



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



  },
  5000
  );


});






// ===============================
// INICIAR BOT
// ===============================

iniciarBot();
