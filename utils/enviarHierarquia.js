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


  // Apaga mensagens antigas do bot
  const mensagens = await canal.messages.fetch({ limit: 100 });

  for (const msg of mensagens.values()) {
    if (msg.author.id === client.user.id) {
      await msg.delete();
    }
  }


  const membros = await canal.guild.members.fetch();

  const listaCargos = {};

  cargos.forEach(cargo => {
    listaCargos[cargo.id] = [];
  });



  // Deixa o membro somente no cargo mais alto
  membros.forEach(member => {

    let cargoMaisAlto = null;
    let maiorPosicao = -1;


    cargos.forEach(cargo => {

      const role = canal.guild.roles.cache.get(cargo.id);

      if (!role) return;


      if (member.roles.cache.has(cargo.id)) {

        if (role.position > maiorPosicao) {

          maiorPosicao = role.position;
          cargoMaisAlto = cargo;

        }

      }

    });


    if (cargoMaisAlto) {
      listaCargos[cargoMaisAlto.id].push(member);
    }

  });



  // Cria um embed por cargo
  for (const cargo of cargos) {

    const role = canal.guild.roles.cache.get(cargo.id);

    if (!role) continue;


    const membrosCargo = listaCargos[cargo.id];


    const lista = membrosCargo.length > 0
      ? membrosCargo.map(member => `• ${member}`).join("\n")
      : "Sem membros";



    const embed = new EmbedBuilder()

      .setDescription(lista)

      // Pega a cor do cargo
      .setColor(role.color || "#2b2d31")

      .setFooter({
        text: `♻️ Atualizado Automaticamente | Última Atualização: ${new Date().toLocaleString("pt-BR")}`
      });



    await canal.send({

      // Menção do cargo
      content: `# ${role} - [${membrosCargo.length}] membros`,

      allowedMentions: {
        roles: [role.id]
      },

      embeds: [embed]

    });

  }


  console.log("♻️ Hierarquia atualizada!");
}
