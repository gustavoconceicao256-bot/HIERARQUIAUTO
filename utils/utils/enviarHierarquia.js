import { EmbedBuilder } from "discord.js";
import config from "../config.js";


export async function enviarHierarquia(client) {

  const canal = await client.channels.fetch(config.canalId);


  const membros = await canal.guild.members.fetch();


  const listaCargos = {};


  config.cargos.forEach(cargo => {

    listaCargos[cargo.id] = [];

  });



  // deixa somente o cargo mais alto
  membros.forEach(member => {

    let maior = -1;
    let escolhido = null;


    config.cargos.forEach(cargo => {

      const role = canal.guild.roles.cache.get(cargo.id);

      if (!role) return;


      if (member.roles.cache.has(cargo.id)) {

        if (role.position > maior) {

          maior = role.position;
          escolhido = cargo;

        }

      }

    });



    if (escolhido) {

      listaCargos[escolhido.id].push(member);

    }

  });




  // pega mensagens antigas do bot
  const mensagens = await canal.messages.fetch({ limit: 100 });


  const mensagensBot = mensagens.filter(
    msg => msg.author.id === client.user.id
  );



  let indice = 0;



  for (const cargo of config.cargos) {


    const role = canal.guild.roles.cache.get(cargo.id);

    if (!role) continue;



    const membrosCargo = listaCargos[cargo.id];



    const lista = membrosCargo.length > 0

      ? membrosCargo.map(member =>
          `• ${member} | ${member.user.username}`
        ).join("\n")

      : "Sem membros";




    const embed = new EmbedBuilder()

      .setDescription(lista)

      .setColor(role.color || "#2b2d31")

      .setFooter({

        text:
        `♻️ Atualizado Automaticamente 24h | Última Atualização: ${new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        })}`

      });



    const mensagem = mensagensBot.at(indice);



    if (mensagem) {


      await mensagem.edit({

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



    indice++;


  }



  console.log("♻️ Hierarquia sincronizada!");

}
