import { utilisateurCache } from "../../cache/utilisateurs/UtilisateurCache";
import { ErreurRequeteInvalide } from "../erreursApi";

export async function deleteUtilisateur(id: string): Promise<{ success: boolean }> {
    const idUtilisateur = parseInt(id);

    if (isNaN(idUtilisateur)) {
        throw new ErreurRequeteInvalide("Identifiant utilisateur invalide.");
    }

    const res = await utilisateurCache.delete(idUtilisateur)

    return {
        success: res.affectedRows > 0
    }
}
