import config from "../config.js";
import { criarEmbedsHierarquia } from "../embeds/hierarquiaEmbed.js";

export async function enviarHierarquia(client) {

  const guild = client.guilds.cache.get(config.guildId);

  if (!guild) {
    console.log("Servidor não encontrado.");
    return;
  }

  const canal = guild.channels.cache.get(config.canalId);

  if (!canal) {
    console.log("Canal da hierarquia não encontrado.");
    return;
  }

  const embeds = criarEmbedsHierarquia(guild);

  const primeiraParte = embeds.slice(0, 10);
  const segundaParte = embeds.slice(10);

  await canal.send({
    embeds: primeiraParte
  });

  if (segundaParte.length > 0) {
    await canal.send({
      embeds: segundaParte
    });
  }

  console.log("✅ Hierarquia enviada!");
}
