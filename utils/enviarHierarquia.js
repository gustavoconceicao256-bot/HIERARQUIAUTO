import { EmbedBuilder } from "discord.js";

export async function enviarHierarquia(client) {

  const canal = await client.channels.fetch("1527420188503576629");

  const cargos = [
    { nome: "00", id: "1521984073969569883" },
    { nome: "01", id: "1522086542716305548" },
    { nome: "02", id: "1522086730008629289" },
    { nome: "Olheiro", id: "1522085772826775713" },
    { nome: "Membro", id: "1521938900418035842" },
    { nome: "Vendas", id: "1523014992927133759" },
    { nome: "Recrutador", id: "1461194746235195525" },
    { nome: "Tático", id: "1460499779602878548" },
    { nome: "Gerente de Farme", id: "1460375600681324669" },
    { nome: "Gerente de Recrutamento", id: "1522788240598237314" },
    { nome: "Gerente de Vendas", id: "1522789809934827582" },
    { nome: "Gerente Tático", id: "1522793484036083812" },
    { nome: "Gerente Geral", id: "1460375600681324668" },
    { nome: "Líder Tático", id: "1460499655640092780" }
  ];


  // Limpa mensagens antigas do bot
  const mensagens = await canal.messages.fetch({ limit: 100 });

  const antigas = mensagens.filter(
    msg => msg.author.id === client.user.id
  );

  for (const msg of antigas.values()) {
    await msg.delete();
  }


  // Guarda quem já apareceu
  const membrosUsados = new Set();


  // Faz do menor para o maior
  for (const cargo of cargos) {

    const role = canal.guild.roles.cache.get(cargo.id);

    if (!role) continue;


    const membros = role.members.filter(member => {

      // se já apareceu em cargo maior, ignora
      if (membrosUsados.has(member.id)) {
        return false;
      }

      return true;

    });


    const lista = membros.map(member => {

      membrosUsados.add(member.id);

      return `• ${member} | ${member.displayName}`;

    });


    const embed = new EmbedBuilder()
      .setDescription(
        lista.length > 0
          ? lista.join("\n")
          : "Sem membros"
      )
      .setColor("#2b2d31")
      .setFooter({
        text: `Total: ${lista.length} membro(s)`
      })
      .setTimestamp();


    await canal.send({
      content: `${role}`,
      embeds: [embed]
    });

  }


  console.log("♻️ Hierarquia atualizada por cargo!");
}
