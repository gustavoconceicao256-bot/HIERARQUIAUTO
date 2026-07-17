import { EmbedBuilder } from "discord.js";

export async function enviarHierarquia(client) {

  const canal = await client.channels.fetch("1527420188503576629");

  const cargos = [
    { nome: "00", id: "1521984073969569883" },
    { nome: "01", id: "1522086542716305548" },
    { nome: "02", id: "1522086730008629289" },
    { nome: "Líder Tático", id: "1460499655640092780" },
    { nome: "Gerente Geral", id: "1460375600681324668" },
    { nome: "Gerente Tático", id: "1522793484036083812" },
    { nome: "Gerente de Vendas", id: "1522789809934827582" },
    { nome: "Gerente de Recrutamento", id: "1522788240598237314" },
    { nome: "Gerente de Farme", id: "1460375600681324669" },
    { nome: "Tático", id: "1460499779602878548" },
    { nome: "Recrutador", id: "1461194746235195525" },
    { nome: "Vendas", id: "1523014992927133759" },
    { nome: "Membro", id: "1521938900418035842" },
    { nome: "Olheiro", id: "1522085772826775713" }
  ];


  // Apaga a hierarquia antiga do bot
  const mensagens = await canal.messages.fetch({ limit: 100 });

  const antigas = mensagens.filter(
    msg =>
      msg.author.id === client.user.id &&
      msg.embeds.length > 0 &&
      msg.embeds[0].title === "📋 HIERARQUIA"
  );

  for (const msg of antigas.values()) {
    await msg.delete();
  }


  // Cria um embed para cada cargo
  for (const cargo of cargos) {

    const role = canal.guild.roles.cache.get(cargo.id);

    if (!role) continue;


    const membros = role.members.map(member => {
      return `• ${member} | ${member.displayName}`;
    });


    const embed = new EmbedBuilder()
      .setTitle("📋 HIERARQUIA")
      .setDescription(
        membros.length > 0
          ? membros.join("\n")
          : "Sem membros"
      )
      .setColor("#2b2d31")
      .setFooter({
        text: `Total: ${membros.length} membro(s)`
      })
      .setTimestamp();


    await canal.send({
      content: `${role}`,
      embeds: [embed]
    });

  }


  console.log("♻️ Hierarquia atualizada por cargo!");

}
