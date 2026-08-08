import { EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import config from "../config.js";

// ======================================
// CAMINHOS
// ======================================

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const arquivoMensagens = path.join(
    __dirname,
    "mensagensHierarquia.json"
);

// ======================================
// LER MENSAGENS
// ======================================

function lerMensagens() {

    if (!fs.existsSync(arquivoMensagens)) {

        return {};

    }

    try {

        return JSON.parse(
            fs.readFileSync(
                arquivoMensagens,
                "utf8"
            )
        );

    } catch {

        return {};

    }

}

// ======================================
// SALVAR MENSAGENS
// ======================================

function salvarMensagens(dados) {

    fs.writeFileSync(
        arquivoMensagens,
        JSON.stringify(
            dados,
            null,
            2
        )
    );

}

// ======================================
// ATUALIZAR HIERARQUIA
// ======================================

export async function atualizarHierarquia(client) {

    if (!client) {

        console.log(
            "❌ Client Discord não foi enviado!"
        );

        return;

    }

    try {

        // ==================================
        // CANAL
        // ==================================

        const canal = await client.channels.fetch(
            config.canalId
        );

        if (!canal) {

            console.log(
                "❌ Canal da hierarquia não encontrado!"
            );

            return;

        }

        // ==================================
        // SERVIDOR
        // ==================================

        const guild = canal.guild;

        if (!guild) {

            console.log(
                "❌ Servidor não encontrado!"
            );

            return;

        }

        // ==================================
        // ATUALIZAR CARGOS
        // ==================================

        await guild.roles.fetch();

        // ==================================
        // MENSAGENS SALVAS
        // ==================================

        const mensagensSalvas =
            lerMensagens();

        // ==================================
        // BUSCAR MEMBROS
        // ==================================

        console.log(
            "👥 Buscando membros do servidor..."
        );

        const membros =
            await guild.members.fetch({
                force: true
            });

        console.log(
            `👥 ${membros.size} membros encontrados.`
        );

        // ==================================
        // ORGANIZAR CARGOS
        // ==================================

        const listaCargos = {};

        config.cargos.forEach(cargo => {

            listaCargos[cargo.id] = [];

        });

        // ==================================
        // IDENTIFICAR MAIOR CARGO
        // ==================================

        membros.forEach(member => {

            let maior = -1;

            let cargoEscolhido = null;

            config.cargos.forEach(cargo => {

                const role =
                    guild.roles.cache.get(
                        cargo.id
                    );

                if (!role) return;

                if (
                    member.roles.cache.has(
                        cargo.id
                    )
                ) {

                    if (
                        role.position > maior
                    ) {

                        maior =
                            role.position;

                        cargoEscolhido =
                            cargo;

                    }

                }

            });

            if (cargoEscolhido) {

                listaCargos[
                    cargoEscolhido.id
                ].push(member);

            }

        });

        // ==================================
        // ATUALIZAR CADA CARGO
        // ==================================

        for (const cargo of config.cargos) {

            const role =
                guild.roles.cache.get(
                    cargo.id
                );

            if (!role) {

                console.log(
                    `⚠️ Cargo não encontrado: ${cargo.nome}`
                );

                continue;

            }

            const membrosCargo =
                listaCargos[cargo.id];

            const lista =
                membrosCargo.length > 0

                    ? membrosCargo
                        .map(
                            member =>
                                `• <@${member.id}>`
                        )
                        .join("\n")

                    : "Sem membros";

            // ==================================
            // HORÁRIO
            // ==================================

            const horario =
                new Date()
                    .toLocaleTimeString(
                        "pt-BR",
                        {
                            timeZone:
                                "America/Sao_Paulo",

                            hour: "2-digit",

                            minute: "2-digit"
                        }
                    );

            // ==================================
            // EMBED
            // ==================================

            const embed =
                new EmbedBuilder()

                    .setTitle(
                        `🏷️ ${cargo.nome}`
                    )

                    .setDescription(
                        lista
                    )

                    .setColor(
                        role.color || "#2b2d31"
                    )

                    .setFooter({
                        text:
                            `♻️ Atualizado Automaticamente | ${horario}`
                    })

                    .setTimestamp();

            // ==================================
            // DADOS DA MENSAGEM
            // ==================================

            const dadosMensagem = {

                content:
                    `# ${role} - [${membrosCargo.length}] membros`,

                allowedMentions: {

                    roles: [
                        role.id
                    ],

                    users:
                        membrosCargo.map(
                            member =>
                                member.id
                        )

                },

                embeds: [
                    embed
                ]

            };

            // ==================================
            // EDITAR MENSAGEM EXISTENTE
            // ==================================

            if (
                mensagensSalvas[cargo.id]
            ) {

                try {

                    const mensagem =
                        await canal.messages.fetch(
                            mensagensSalvas[cargo.id]
                        );

                    await mensagem.edit(
                        dadosMensagem
                    );

                    continue;

                } catch {

                    delete mensagensSalvas[
                        cargo.id
                    ];

                }

            }

            // ==================================
            // CRIAR NOVA MENSAGEM
            // ==================================

            const novaMensagem =
                await canal.send(
                    dadosMensagem
                );

            mensagensSalvas[
                cargo.id
            ] = novaMensagem.id;

        }

        // ==================================
        // SALVAR IDS
        // ==================================

        salvarMensagens(
            mensagensSalvas
        );

        console.log(
            "♻️ Hierarquia sincronizada!"
        );

    } catch (erro) {

        console.error(
            "❌ Erro dentro de atualizarHierarquia:",
            erro
        );

        throw erro;

    }

}
