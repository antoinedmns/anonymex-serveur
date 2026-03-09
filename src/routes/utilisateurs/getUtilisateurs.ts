import { APIListUtilisateur, APIUtilisateur } from "../../contracts/utilisateurs";
import { utilisateurCache } from "../../cache/utilisateurs/UtilisateurCache";
import { ErreurRequeteInvalide } from "../erreursApi";

export async function getUtilisateurs(): Promise<APIListUtilisateur> {
    const utiliseursBrut = await utilisateurCache.getAll();

    if (utiliseursBrut === undefined) {
        throw new ErreurRequeteInvalide("La liste des utilisateurs n'a pas pu être renvoyées.")
    }

    const utilisateursFormates: APIUtilisateur[] = [];

    for (const utilisateur of utiliseursBrut) {
        utilisateursFormates.push(utilisateur.toJSON());
    }

    return {
        utilisateurs: utilisateursFormates
    }
};