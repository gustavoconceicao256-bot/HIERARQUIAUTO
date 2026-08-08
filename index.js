```js
import dotenv from "dotenv";
dotenv.config();

import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

import "./utils/keepalive/keepalive.js";
import { atualizarHierarquia } from "./utils/atualizarHierarquia.js";

// ================================
// CONFIGURAÇÕES
// ================================

const app = express();

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.TOKEN?.trim();

const CANAL_HIERARQUIA = "1527420188503576629";

// ================================
// VERIFICAR TOKEN
// ================================

if (!TOKEN) {
    console.error("❌ TOKEN nao encontrado!");
    process.exit(1);
}

console.log("✅ TOKEN carregado com sucesso!");

// ================================
// SERVIDOR WEB
// ================================

app.get("/", (req, res) => {
    res.send("Bot de hierarquia online!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `🌐 Servidor web iniciado na porta ${PORT}`
    );
});

// ================================
// CLIENT DISCORD
// ================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ================================
// LIMPAR CANAL
// ================================

async function limparCanalHierarquia() {
    try {
        const canal = await client.channels.fetch(
            CANAL_HIERARQUIA
        );

        if (!canal) {
            console.log("❌ Canal nao encontrado!");
            return;
        }

        if (!canal.isTextBased()) {
            console.log(
                "❌ O canal nao e um canal de texto!"
            );
            return;
        }

        console.log("🧹 Limpando canal...");

        let mensagens;

        do {
            mensagens = await canal.messages.fetch({
                limit: 100
            });

            if (mensagens.size === 0) {
                break;
            }

            for (const mensagem of mensagens.values()) {
                try {
                    await mensagem.delete();
                } catch (erro) {
                    console.log(
                        "⚠️ Nao foi possivel apagar uma mensagem."
                    );
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

// ================================
// BOT ONLINE
// ================================

client.once("ready", async () => {

    console.log("");
    console.log("================================");
    console.log(
        "🤖 BOT ONLINE: " + client.user.tag
    );
    console.log(
        "🆔 BOT ID: " + client.user.id
    );
    console.log("================================");
    console.log("");

    // ================================
    // LIMPAR CANAL
    // ================================

    await limparCanalHierarquia();

    // ================================
    // PRIMEIRA HIERARQUIA
    // ================================

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

    // ================================
    // ATUALIZAÇÃO AUTOMÁTICA
    // ================================

    setInterval(async () => {

        console.log(
            "🔄 Checagem automatica..."
        );

        try {

            await atualizarHierarquia(client);

            console.log(
                "✅ Hierarquia atualizada!"
            );

        } catch (erro) {

            console.error(
                "❌ Erro atualizacao automatica:",
                erro
            );
        }

    }, 60000);
});

// ================================
// INICIAR BOT
// ================================

async function iniciarBot() {

    try {

        console.log(
            "🔐 Tentando conectar ao Discord..."
        );

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
```
