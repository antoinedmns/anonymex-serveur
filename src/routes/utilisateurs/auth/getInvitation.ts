import { utilisateurCache } from "../../../cache/utilisateurs/UtilisateurCache";
import { APIBoolResponse } from "../../../contracts/common";
import { GetInvitationSchema } from "../../../contracts/utilisateurs";

export async function getInvitation(data: Record<string, unknown>): Promise<APIBoolResponse> {
    const infosInvitation = GetInvitationSchema.parse(data);

    // jeton d'invitation permettant de créer le tout premier compte administrateur
    // uniquement possible lorsque la base de données est vide
    if (infosInvitation.jetonInvitation === "setup") {
        return { success: await utilisateurCache.isAucunUtilisateurEnregistre() };
    }

    return { success: true };
}