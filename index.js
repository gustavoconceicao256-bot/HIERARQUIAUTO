import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

import "./utils/keepalive/keepalive.js";

import { atualizarHierarquia } from "./utils/atualizarHierarquia.js";

import readyEvent from "./Eventos/ready.js";
import guildMemberUpdateEvent from "./Eventos/guildMemberUpdate.js";

// ======================================
// SERVIDOR WEB
// ======================================

const app = express();

app.get("/", (req, res) => {
    res.send("Bot de hierarquia online!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Servidor web iniciado na porta ${PORT}`);
});

// ======================================
// CLIENT DISCORD
// ======================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ======================================
// EVENTOS
// ======================================

client.once("ready", () => {
    readyEvent.execute(client);
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    try {
        await guildMemberUpdateEvent.execute(oldMember, newMember);
    } catch (erro) {
        console.error(
            "❌ Erro no evento guildMemberUpdate:",
            erro
        );
    }
});

// ======================================
// TOKEN
// ======================================

const TOKEN = process.env.TOKEN?.trim();

if (!TOKEN) {
    console.error("❌ TOKEN não encontrado!");
    process.exit(1);
}

console.log("🔑 TOKEN carregado com sucesso!");

// ======================================
// LIMPAR CANAL
// ======================================

async function limparCanalHierarquia() {

    try {

        const canal = await client.channels.fetch(
            "1527420188503576629"
        );

        if (!canal) {
            console.log("❌ Canal não encontrado!");
            return;
        }

        console.log("🧹 Limpando canal de hierarquia...");

        let mensagens;

        do {

            mensagens = await canal.messages.fetch({
                limit: 100
            });

            for (const mensagem of mensagens.values()) {

                try {
                    await mensagem.delete();
                } catch {
                    // Ignorar mensagens que não puderem ser apagadas
                }

            }

        } while (mensagens.size > 0);

        console.log("✅ Canal limpo!");

    } catch (erro) {

        console.error(
            "❌ Erro limpando canal:",
            erro
        );

    }
}

// ======================================
// READY
// ======================================

client.once("ready", async () => {

    console.log(
        "🤖 BOT ONLINE: " + client.user.tag
    );

    console.log(
        "🆔 BOT ID: " + client.user.id
    );

    // ==================================
    // LIMPAR CANAL
    // ==================================

    await limparCanalHierarquia();

    // ==================================
    // PRIMEIRA HIERARQUIA
    // ==================================

    try {

        await atualizarHierarquia(client);

        console.log(
            "✅ Hierarquia enviada!"
        );

    } catch (erro) {

        console.error(
            "❌ Erro primeira hierarquia:",
            erro
        );

    }

    // ==================================
    // ATUALIZAÇÃO AUTOMÁTICA
    // ==================================

    setInterval(async () => {

        console.log(
            "🔄 Checagem automática..."
        );

        try {

            await atualizarHierarquia(client);

            console.log(
                "✅ Hierarquia atualizada!"
            );

        } catch (erro) {

            console.error(
                "❌ Erro atualização automática:",
                erro
            );

        }

    }, 60000);

});

// ======================================
// LOGIN
// ======================================

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
