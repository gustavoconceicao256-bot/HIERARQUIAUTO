import { EmbedBuilder } from "discord.js";
import config from "../config.js";


export async function enviarHierarquia(client) {

  const canal = await client.channels.fetch(config.canalId);


  const membros = await canal.guild.members.fetch();


  const listaCargos = {};

  config.cargos.forEach(cargo => {
    listaCargos[cargo.id] = [];
  });



  // Deixa o membro somente no cargo mais alto
  membros.forEach(member => {

    let maior = -1;
    let cargoEscolhido = null;


    config.cargos.forEach(cargo => {

      const role = canal.guild.roles.cache.get(cargo.id);

      if (!role) return;


      if (member.roles.cache.has(cargo.id)) {

        if (role.position > maior) {

          maior = role.position;
          cargoEscolhido = cargo;

        }

      }

    });


    if (cargoEscolhido) {
      listaCargos[cargoEscolhido.id].push(member);
    }

  });



  // Busca mensagens antigas do bot
  const mensagens = await canal.messages.fetch({ limit: 100 });



  for (const cargo of config.cargos) {


    const role = canal.guild.roles.cache.get(cargo.id);

    if (!role) continue;



    const membrosCargo = listaCargos[cargo.id];


    const lista = membrosCargo.length > 0

      ? membrosCargo.map(member => `• ${member}`).join("\n")

      : "Sem membros";



    const embed = new EmbedBuilder()

      .setDescription(lista)

      .setColor(role.color || "#2b2d31")

      .setFooter({

        text:
        `♻️ Atualizado Automaticamente | Última Atualização: ${new Date().toLocaleString("pt-BR")}`

      });



    // procura a mensagem desse cargo
    const mensagemExistente = mensagens.find(msg =>

      msg.author.id === client.user.id &&

      msg.content.includes(role.id)

    );



    if (mensagemExistente) {


      await mensagemExistente.edit({

        content: `# ${role} - [${membrosCargo.length}] membros`,

        allowedMentions: {

          roles: [role.id]

        },

        embeds: [embed]

      });



    } else {


      await canal.send({

        content: `# ${role} - [${membrosCargo.length}] membros`,

        allowedMentions: {

          roles: [role.id]

        },

        embeds: [embed]

      });


    }


  }


  console.log("♻️ Hierarquia sincronizada!");

}
