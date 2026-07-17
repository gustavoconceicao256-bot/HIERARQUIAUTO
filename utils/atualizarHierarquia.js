import { criarEmbedsHierarquia } from "../embeds/hierarquiaEmbed.js";
import config from "../config.js";


export async function atualizarHierarquia(client) {

  const canal = await client.channels.fetch(config.canalId);


  const embeds = criarEmbedsHierarquia(canal.guild);



  // Pega mensagens antigas do bot no canal
  const mensagens = await canal.messages.fetch({ limit: 100 });


  const mensagensBot = mensagens.filter(
    msg => msg.author.id === client.user.id
  );



  let indice = 0;



  for (const embed of embeds) {


    const mensagemExistente = mensagensBot.at(indice);



    // Se já existe, apenas edita
    if (mensagemExistente) {


      await mensagemExistente.edit({

        embeds: [embed]

      });



    } else {


      // Se não existe, cria
      await canal.send({

        embeds: [embed]

      });


    }


    indice++;


  }



  // Apaga mensagens extras antigas para não acumular
  const extras = mensagensBot.filter(
    (_, index) => index >= embeds.length
  );


  for (const msg of extras.values()) {

    await msg.delete();

  }



  console.log("♻️ Hierarquia sincronizada!");

}
