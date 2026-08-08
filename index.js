import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

import "./utils/keepalive/keepalive.js";

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

if (!TOKEN) { console.error("❌ TOKEN não encontrado!");
             
             process.exit(1); } 
console.log("🔑 TOKEN carregado com sucesso!");


// ===============================
// LIMPAR CANAL
// ===============================

async function limparCanalHierarquia() {

    try {


        const canal = await client.channels.fetch(
            "1527420188503576629"
        );


        if (!canal) {

            console.log(
                "❌ Canal não encontrado"
            );

            return;

        }



        console.log(
            "🧹 Limpando canal..."
        );



        let mensagens;



        do {


            mensagens = await canal.messages.fetch({

                limit: 100

            });



            for (const mensagem of mensagens.values()) {


                try {

                    await mensagem.delete();

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
// READY
// ===============================

client.once(
"ready",
async () => {


    console.log(
        `✅ ${client.user.tag} está online!`
    );



    await limparCanalHierarquia();



    try {


        await atualizarHierarquia(client);



        console.log(
            "✅ Hierarquia enviada!"
        );


    } catch (erro) {


        console.log(
            "❌ Erro primeira hierarquia:",
            erro
        );


    }





    setInterval(async () => {


        console.log(
            "🔍 Checagem automática..."
        );



        try {


            await atualizarHierarquia(client);



            console.log(
                "♻️ Hierarquia atualizada!"
            );


        } catch (erro) {


            console.log(
                "❌ Erro atualização automática:",
                erro
            );


        }


    }, 60000);



});







// ===============================
// ALTERAÇÃO DE CARGO
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
                "⏳ Atualizando após mudança..."
            );



            await newMember.fetch();



            await atualizarHierarquia(client);



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
// LOGIN
// ===============================

async function iniciarBot() {


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




iniciarBot();
