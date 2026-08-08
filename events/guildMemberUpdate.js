import { atualizarHierarquia } from "../utils/atualizarHierarquia.js";

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

        console.log(
            `👤 ${newMember.user.tag} teve os cargos atualizados.`
        );

        if (
            adicionados.size === 0 &&
            removidos.size === 0
        ) {
            return;
        }

        adicionados.forEach(cargo => {

            console.log(
                `➕ Cargo adicionado: ${cargo.name}`
            );

        });

        removidos.forEach(cargo => {

            console.log(
                `➖ Cargo removido: ${cargo.name}`
            );

        });

        try {

            await atualizarHierarquia(
                newMember.client
            );

            console.log(
                "♻️ Hierarquia atualizada após alteração de cargo!"
            );

        } catch (erro) {

            console.error(
                "❌ Erro atualizando hierarquia pelo evento:",
                erro
            );

        }

    }

};
