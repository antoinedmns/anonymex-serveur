import { APIListRoles, APIRole } from "../../contracts/roles";
import { ErreurRequeteInvalide } from "../erreursApi";
import { roleCache } from "../../cache/utilisateurs/roles/RoleCache";

export async function getRoles(): Promise<APIListRoles> {
    const rolesBruts = await roleCache.getAll();

    if (rolesBruts === undefined) {
        throw new ErreurRequeteInvalide("La liste des rôles n'a pas pu être renvoyées.")
    }

    const rolesFormatees: APIRole[] = [];
    for (const role of rolesBruts) {
        rolesFormatees.push(role.toJSON());
    }

    return { roles: rolesFormatees };
}