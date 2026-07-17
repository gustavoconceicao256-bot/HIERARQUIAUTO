import { EmbedBuilder } from "discord.js";
import fs from "fs";
import config from "../config.js";

const arquivoMensagens = "./utils/mensagensHierarquia.json";


function lerMensagens() {

  if (!fs.existsSync(arquivoMensagens)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(arquivoMensagens, "utf8")
  );

}


function salvarMensagens(dados) {

  fs.writeFileSync(
    arquivoMensagens,
    JSON.stringify(dados, null, 2)
  );

}



export async function atualizarHierarquia(client) {


  const canal = await client.channels.fetch(config.canalId);


  const mensagensSalvas = lerMensagens();



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





    const conteudo = {

      content: `# ${role} - [${membrosCargo.length}] membros`,

      allowedMentions: {

        roles: [role.id]

      },

      embeds: [embed]

    };






    // EDITA se já existe
    if (mensagensSalvas[cargo.id]) {


      try {


        const mensagem = await canal.messages.fetch(
          mensagensSalvas[cargo.id]
        );


        await mensagem.edit(conteudo);



      } catch {


        delete mensagensSalvas[cargo.id];


      }



    }





    // CRIA se não existe
    if (!mensagensSalvas[cargo.id]) {


      const mensagem = await canal.send(conteudo);



      mensagensSalvas[cargo.id] = mensagem.id;


      salvarMensagens(mensagensSalvas);


    }



  }





  console.log("♻️ Hierarquia sincronizada!");

}
