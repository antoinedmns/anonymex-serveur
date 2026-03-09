import { RoleSchema } from "../../contracts/roles";
import { roleCache } from "../../cache/utilisateurs/roles/RoleCache";

export async function postRole(data: Record<string, unknown>): Promise<{ success: boolean }> {
    const nouveauRole = RoleSchema.parse(data);

    const insertionrole = await roleCache.insert({
        nom: nouveauRole.nom,
        permissions: nouveauRole.permissions
    })

    return { success: insertionrole.affectedRows > 0 }
}