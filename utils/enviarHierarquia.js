import { EmbedBuilder } from "discord.js";

export async function enviarHierarquia(client) {

  const canal = await client.channels.fetch("1527420188503576629");

  const embed = new EmbedBuilder()
    .setTitle("📋 HIERARQUIA DA ORGANIZAÇÃO")
    .setDescription(
      "Lista atualizada automaticamente dos membros por cargo."
    )
    .setColor("#2b2d31")
    .setTimestamp();

  const cargos = [
    // COLOQUE SEUS CARGOS AQUI
    // Exemplo:
    // { id: "ID_DO_CARGO", nome: "NOME DO CARGO" }
  ];

  for (const cargo of cargos) {

    const role = canal.guild.roles.cache.get(cargo.id);

    if (!role) continue;

    const membros = role.members.map(member => {
      return `• ${member} | ${member.displayName}`;
    });

    embed.addFields({
      name: `${role.name} - [${membros.length}] membros`,
      value: membros.length > 0
        ? membros.join("\n")
        : "Sem membros"
    });
  }


  // procura a mensagem antiga do bot
  const mensagens = await canal.messages.fetch({ limit: 20 });

  const antiga = mensagens.find(
    msg => msg.author.id === client.user.id &&
    msg.embeds.length > 0 &&
    msg.embeds[0].title === "📋 HIERARQUIA DA ORGANIZAÇÃO"
  );


  if (antiga) {

    await antiga.edit({
      embeds: [embed]
    });

    console.log("♻️ Hierarquia atualizada!");

  } else {

    await canal.send({
      embeds: [embed]
    });

    console.log("✅ Hierarquia criada!");

  }
}
