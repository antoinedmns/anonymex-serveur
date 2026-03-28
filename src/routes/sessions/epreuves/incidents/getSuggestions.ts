import { ErreurRequeteInvalide } from "../../../erreursApi";
import { sessionCache } from "../../../../cache/sessions/SessionCache";

export async function getSuggestions(sessionId: string, codeEpreuve: string, codePartiel: string): Promise<string[]> {
    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined)
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");

    const session = await sessionCache.getOrFetch(idSession);
    if (session === undefined) throw new ErreurRequeteInvalide("La session passée n'existe pas.");

    const epreuve = await session.epreuves.getOrFetch(codeEpreuve);
    if (epreuve === undefined) throw new ErreurRequeteInvalide("L'épreuve demandée n'existe pas.");

    // ..sinon, renvoyer les suggestions
    return await epreuve.incidents.suggererCodesAnonymat(codePartiel);
}