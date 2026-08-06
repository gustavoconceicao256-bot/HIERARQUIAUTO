import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import express from "express";


import { atualizarHierarquia } from "./utils/atualizarHierarquia.js";




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
    TOKEN?.includes(".")
);


console.log(
    "TAMANHO:",
    TOKEN?.length
);


console.log(
    "FINAL:",
    TOKEN?.slice(-10)
);


console.log("================================");



if (!TOKEN) {

    console.error(
        "❌ TOKEN não encontrado!"
    );

    process.exit(1);

}





// ===============================
// CONTROLE DE ATUALIZAÇÃO
// ===============================

let atualizando = false;



async function atualizar() {


    if (atualizando) {

        console.log(
            "⏳ Atualização já em andamento"
        );

        return;

    }


    atualizando = true;


    try {


        console.log(
            "♻️ Atualizando hierarquia..."
        );


        await atualizarHierarquia(client);


        console.log(
            "✅ Hierarquia atualizada!"
        );


    } catch (erro) {


        console.error(
            "❌ Erro atualizando hierarquia:",
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

                limit:100

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


        console.error(
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



    await atualizar();




    setInterval(async () => {


        console.log(
            "🔍 Checagem automática..."
        );


        await atualizar();



    },60000);



});







// ===============================
// MUDANÇA DE CARGO
// ===============================

let timerHierarquia = null;



client.on(
"guildMemberUpdate",
(oldMember,newMember)=>{


    console.log(
        "🔄 Mudança de cargo detectada!"
    );



    if(timerHierarquia){

        clearTimeout(timerHierarquia);

    }



    timerHierarquia = setTimeout(async()=>{


        try{


            await newMember.fetch();


            await atualizar();



            console.log(
                "✅ Atualização por cargo concluída!"
            );


        }catch(erro){


            console.error(
                "❌ Erro atualização cargo:",
                erro
            );


        }


    },5000);



});








// ===============================
// LOGIN
// ===============================

async function iniciarBot(){


    try{


        await client.login(TOKEN);



        console.log(
            "✅ Login realizado!"
        );



    }catch(erro){


        console.error(
            "❌ Erro login:",
            erro
        );


        process.exit(1);


    }


}



iniciarBot();
