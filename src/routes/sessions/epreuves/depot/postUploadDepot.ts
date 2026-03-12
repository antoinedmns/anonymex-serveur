import { sessionCache } from "../../../../cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../../erreursApi";
import { Fichier } from "../../../useFile";

export async function postUploadDepot(id: string, codeEpreuve: string, fichiers: Fichier[] | unknown): Promise<void> {
    const idSession = parseInt(id ?? '');

    if (isNaN(idSession) || id === undefined)
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");

    const session = await sessionCache.getOrFetch(idSession);
    if (!session)
        throw new ErreurRequeteInvalide("La session n'existe pas.");

    const epreuve = await session.epreuves.getOrFetch(codeEpreuve);
    if (!epreuve)
        throw new ErreurRequeteInvalide("L'épreuve n'existe pas.");

    // Vérifier si le fichier à bien été reçu
    if (!fichiers || !Array.isArray(fichiers))
        throw new ErreurRequeteInvalide("Aucun fichier n'a été reçu.");

}