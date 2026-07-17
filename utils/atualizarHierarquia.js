import { EmbedBuilder } from "discord.js";
import config from "../config.js";

export async function atualizarHierarquia(client) {

  const canal = await client.channels.fetch(config.canalId);


  const mensagens = await canal.messages.fetch({ limit: 100 });


  const mensagensBot = mensagens.filter(
    msg => msg.author.id === client.user.id
  );



  const membros = await canal.guild.members.fetch();


  const listaCargos = {};

  config.cargos.forEach(cargo => {
    listaCargos[cargo.id] = [];
  });



  // deixa somente o cargo mais alto
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



  let indice = 0;


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



  // remove mensagens extras
  const extras = mensagensBot.filter(
    (_, index) => index >= config.cargos.length
  );


  for (const msg of extras.values()) {

    await msg.delete();

  }



  console.log("♻️ Hierarquia sincronizada!");

}
