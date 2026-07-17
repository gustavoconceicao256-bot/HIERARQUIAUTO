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
    // deixa aqui os mesmos cargos que você já colocou
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

  await canal.send({
    embeds: [embed]
  });

  console.log("✅ Hierarquia enviada!");
}
