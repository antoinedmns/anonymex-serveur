import { ErreurRequeteInvalide } from "../erreursApi";
import { roleCache } from "../../cache/utilisateurs/roles/RoleCache";

export async function deleteRole(roleId: string): Promise<{ success: boolean }> {
    const idRole = parseInt(roleId ?? '');

    if (isNaN(idRole) || roleId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de rôle n'est pas valide.");
    }

    const suppressionRole = await roleCache.delete(idRole);

    return {
        success: suppressionRole.affectedRows > 0
    }
}