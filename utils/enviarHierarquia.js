import { EmbedBuilder } from "discord.js";
import fs from "fs";
import config from "../config.js";

const arquivoMensagens = "./utils/mensagensHierarquia.json";


function salvarMensagens(dados) {
  fs.writeFileSync(
    arquivoMensagens,
    JSON.stringify(dados, null, 2)
  );
}


function pegarMensagens() {

  if (!fs.existsSync(arquivoMensagens)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(arquivoMensagens)
  );

}



export async function enviarHierarquia(client) {

  const canal = await client.channels.fetch(config.canalId);

  const mensagensSalvas = pegarMensagens();


  const membros = await canal.guild.members.fetch();


  const listaCargos = {};

  config.cargos.forEach(cargo => {
    listaCargos[cargo.id] = [];
  });



  // Deixa somente o cargo mais alto
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
        `♻️ Atualizado Automaticamente | Última Atualização: ${new Date().toLocaleString("pt-BR")}`
      });



    // EDITA A MENSAGEM EXISTENTE
    if (mensagensSalvas[cargo.id]) {

      try {

        const msg = await canal.messages.fetch(
          mensagensSalvas[cargo.id]
        );


        await msg.edit({

          content: `# ${role} - [${membrosCargo.length}] membros`,

          allowedMentions:{
            roles:[role.id]
          },

          embeds:[embed]

        });


        continue;


      } catch {

        // se a mensagem não existir mais, remove o ID salvo
        delete mensagensSalvas[cargo.id];

        salvarMensagens(mensagensSalvas);

      }

    }



    // CRIA SOMENTE SE NÃO EXISTIR
    const msg = await canal.send({

      content:`# ${role} - [${membrosCargo.length}] membros`,

      allowedMentions:{
        roles:[role.id]
      },

      embeds:[embed]

    });


    mensagensSalvas[cargo.id] = msg.id;

console.log("💾 Salvando mensagem:", cargo.nome, msg.id);

salvarMensagens(mensagensSalvas);
