export default {
  name: "guildMemberUpdate",

  async execute(oldMember, newMember) {
    console.log(`${newMember.user.tag} teve os cargos atualizados.`);
  }
};
