import { APIRole } from "../../contracts/roles";
import { roleCache } from "../../cache/utilisateurs/roles/RoleCache";
import { ErreurRequeteInvalide } from "../erreursApi";

export async function getRole(roleId: string): Promise<APIRole> {
    const idRole = parseInt(roleId ?? '');

    if (isNaN(idRole) || roleId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de rôle n'est pas valide.");
    }

    const roleBrut = await roleCache.getOrFetch(idRole);

    if (roleBrut === undefined) {
        throw new ErreurRequeteInvalide("Le rôle demandé n'existe pas.");
    }

    return roleBrut.toJSON();
}