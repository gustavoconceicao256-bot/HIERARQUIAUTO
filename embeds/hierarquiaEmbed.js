import { EmbedBuilder } from "discord.js";
import config from "../config.js";

export function criarEmbedsHierarquia(guild) {

  const embeds = [];


  const horario = new Date().toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit"
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

      .setColor(role.color || "#2b2d31")

      .setTitle(`🏷️ ${cargo.nome}`)

      .setDescription(
        `👥 **Quantidade:** ${membros.length}\n\n${listaMembros}`
      )

      .setFooter({

        text:
        `♻️ Atualizado Automaticamente 24h | Última Atualização: ${horario}`

      })

      .setTimestamp();



    embeds.push(embed);


  }



  return embeds;

}
