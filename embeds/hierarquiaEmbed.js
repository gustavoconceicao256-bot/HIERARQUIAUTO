import { EmbedBuilder } from "discord.js";
import config from "../config.js";

export function criarEmbedsHierarquia(guild) {
  const embeds = [];

  const data = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo"
  });

  for (const cargo of config.cargos) {
    const role = guild.roles.cache.get(cargo.id);

    if (!role) {
      console.log(`Cargo não encontrado: ${cargo.nome}`);
      continue;
    }

    const membros = role.members.map(member => {
      return `👤 ${member.user.tag}`;
    });

    const listaMembros = membros.length > 0
      ? membros.join("\n")
      : "Nenhum membro possui este cargo.";

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`🏷️ ${cargo.nome}`)
      .setDescription(
        `👥 **Quantidade:** ${membros.length}\n\n${listaMembros}`
      )
      .setFooter({
        text: `Última atualização: ${data}`
      })
      .setTimestamp();

    embeds.push(embed);
  }

  return embeds;
}
