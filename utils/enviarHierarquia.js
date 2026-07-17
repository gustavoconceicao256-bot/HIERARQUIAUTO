import { EmbedBuilder } from "discord.js";
import config from "../config.js";

export async function enviarHierarquia(client) {

  const guild = client.guilds.cache.get(config.guildId);

  if (!guild) return console.log("Servidor não encontrado");

  const canal = guild.channels.cache.get(config.canalId);

  if (!canal) return console.log("Canal não encontrado");


  let texto = "";

  for (const cargo of config.cargos) {

    const role = guild.roles.cache.get(cargo.id);

    if (!role) continue;


    const membros = role.members.map(member => {

      // pega ID do personagem se tiver no nick
      const id = member.nickname?.match(/\|\s*(\d+)/)?.[1];

      return id
        ? `• ${member} | ${id}`
        : `• ${member}`;

    });


    texto += `## ${cargo.nome} - [${membros.length}] membros\n`;

    texto += `${role}\n\n`;


    if (membros.length > 0) {
      texto += membros.join("\n");
    } else {
      texto += "Sem membros";
    }


    texto += `\n\nAtualizado Automaticamente | Última Atualização: <t:${Math.floor(Date.now()/1000)}:f>\n\n`;

  }


  const mensagem = await canal.messages.fetch(config.mensagemId);

  await mensagem.edit({
    content: texto
  });


  console.log("✅ Hierarquia atualizada!");
}
