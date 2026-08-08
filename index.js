import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

import "./utils/keepalive/keepalive.js";
import { atualizarHierarquia } from "./utils/atualizarHierarquia.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Bot de hierarquia online!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor web iniciado na porta " + PORT);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN?.trim();

if (!TOKEN) {
    console.error("TOKEN nao encontrado!");
    process.exit(1);
}

console.log("TOKEN carregado com sucesso!");

async function limparCanalHierarquia() {
    try {
        const canal = await client.channels.fetch(
            "1527420188503576629"
        );

        if (!canal) {
            console.log("Canal nao encontrado!");
            return;
        }

        console.log("Limpando canal...");

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

        console.log("Canal limpo!");

    } catch (erro) {
        console.error(
            "Erro limpando canal:",
            erro
        );
    }
}

client.once("ready", async () => {

    console.log(
        "BOT ONLINE: " + client.user.tag
    );

    console.log(
        "BOT ID: " + client.user.id
    );

    await limparCanalHierarquia();

    try {
        await atualizarHierarquia(client);

        console.log(
            "Hierarquia enviada!"
        );

    } catch (erro) {
        console.error(
            "Erro primeira hierarquia:",
            erro
        );
    }

    setInterval(async () => {

        console.log(
            "Checagem automatica..."
        );

        try {
            await atualizarHierarquia(client);

            console.log(
                "Hierarquia atualizada!"
            );

        } catch (erro) {
            console.error(
                "Erro atualizacao automatica:",
                erro
            );
        }

    }, 60000);

});

async function iniciarBot() {

    try {

        await client.login(TOKEN);

        console.log(
            "Login realizado!"
        );

    } catch (erro) {

        console.error(
            "Erro login:",
            erro
        );

        process.exit(1);
    }
}

iniciarBot();
