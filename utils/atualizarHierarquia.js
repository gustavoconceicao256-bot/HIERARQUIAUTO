import { EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../config.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const arquivoMensagens = path.join(
  __dirname,
  "mensagensHierarquia.json"
);



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


  // força atualizar dados do Discord
  await canal.guild.roles.fetch();


  const mensagensSalvas = lerMensagens();



  // força pegar membros atualizados
  const membros = await canal.guild.members.fetch({
    force: true
  });




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






    const horario = new Date().toLocaleTimeString("pt-BR", {

      timeZone: "America/Sao_Paulo",

      hour: "2-digit",

      minute: "2-digit"

    });







    const embed = new EmbedBuilder()


      .setTitle(`🏷️ ${cargo.nome}`)


      .setDescription(lista)


      .setColor(role.color || "#2b2d31")


      .setFooter({

        text:
        `♻️ Atualizado Automaticamente | Última Atualização: ${horario}`

      })


      .setTimestamp();







    const dadosMensagem = {


      content:
      `# ${role} - [${membrosCargo.length}] membros`,



      allowedMentions: {

        roles: [role.id]

      },


      embeds: [embed]


    };







    // EDITA A MENSAGEM EXISTENTE

    if (mensagensSalvas[cargo.id]) {


      try {


        const mensagem = await canal.messages.fetch(
          mensagensSalvas[cargo.id]
        );



        await mensagem.edit(dadosMensagem);



        continue;



      } catch {


        delete mensagensSalvas[cargo.id];


      }


    }








    // CRIA APENAS SE NÃO EXISTIR

    const novaMensagem = await canal.send(dadosMensagem);



    mensagensSalvas[cargo.id] = novaMensagem.id;



  }







  salvarMensagens(mensagensSalvas);



  console.log("📁 IDs salvos:", mensagensSalvas);

  console.log("♻️ Hierarquia sincronizada!");

}
