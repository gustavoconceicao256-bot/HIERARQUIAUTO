import { enviarHierarquia } from "../utils/enviarHierarquia.js";

export default {
  name: "guildMemberUpdate",

  async execute(oldMember, newMember) {

    const cargosAntigos = oldMember.roles.cache;
    const cargosNovos = newMember.roles.cache;

    const adicionados = cargosNovos.filter(
      cargo => !cargosAntigos.has(cargo.id)
    );

    const removidos = cargosAntigos.filter(
      cargo => !cargosNovos.has(cargo.id)
    );

    console.log(`👤 ${newMember.user.tag} teve os cargos atualizados.`);

    if (adicionados.size > 0 || removidos.size > 0) {

      adicionados.forEach(cargo => {
        console.log(`➕ Cargo adicionado: ${cargo.name}`);
      });

      removidos.forEach(cargo => {
        console.log(`➖ Cargo removido: ${cargo.name}`);
      });

      await enviarHierarquia(newMember.client);
    }
  }
};
