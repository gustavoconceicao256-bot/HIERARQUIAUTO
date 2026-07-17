import config from "../config.js";

export async function enviarHierarquia(client) {

  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) return;

  const canal = guild.channels.cache.get(config.canalId);
  if (!canal) return;


  let mensagem = "";


  for (const cargo of config.cargos) {

    const role = guild.roles.cache.get(cargo.id);

    if (!role) continue;


    const membros = role.members.map(member => {

      let idPersonagem = "";

      if (member.nickname) {
        const pegarID = member.nickname.match(/\d+/);
        if (pegarID) idPersonagem = pegarID[0];
      }

      return idPersonagem
        ? `• ${member} | ${idPersonagem}`
        : `• ${member}`;

    });


    mensagem += `## ${role.name} - [${membros.length}] membros\n\n`;

    mensagem += `${role}\n\n`;


    if (membros.length > 0) {
      mensagem += membros.join("\n");
    } else {
      mensagem += "Sem membros";
    }


    mensagem += `\n\n━━━━━━━━━━━━━━━━━━\n`;

    mensagem += `Atualizado Automaticamente | Última Atualização: ${new Date().toLocaleString("pt-BR")}\n\n`;

  }


  let msg;

  try {
    msg = await canal.messages.fetch(config.mensagemId);

    await msg.edit({
      content: mensagem
    });

  } catch {

    msg = await canal.send({
      content: mensagem
    });

    console.log("Nova mensagem criada:", msg.id);

  }


  console.log("✅ Hierarquia atualizada!");
}
