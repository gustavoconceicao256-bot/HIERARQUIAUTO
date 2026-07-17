import { EmbedBuilder } from "discord.js";
import fs from "fs";
import config from "../config.js";

const arquivoMensagens = "./utils/mensagensHierarquia.json";


function lerMensagens() {

  if (!fs.existsSync(arquivoMensagens)) {
    return {};
  }

  try {

    return JSON.parse(
      fs.readFileSync(arquivoMensagens, "utf8")
    );

  } catch {

    return {};

  }

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






  const mensagensAtuais = await canal.messages.fetch({
    limit: 100
  });



  const mensagensBot = mensagensAtuais.filter(
    msg => msg.author.id === client.user.id
  );





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





    const dadosMensagem = {

      content: `# ${role} - [${membrosCargo.length}] membros`,

      allowedMentions: {

        roles: [role.id]

      },

      embeds: [embed]

    };





    const mensagemExistente = mensagensBot.at(indice);





    if (mensagemExistente) {


      await mensagemExistente.edit(dadosMensagem);


      mensagensSalvas[cargo.id] = mensagemExistente.id;



    } else {



      const novaMensagem = await canal.send(dadosMensagem);


      mensagensSalvas[cargo.id] = novaMensagem.id;



    }



    indice++;


  }





  salvarMensagens(mensagensSalvas);



  console.log("📁 IDs salvos:", mensagensSalvas);

  console.log("♻️ Hierarquia sincronizada!");

}
