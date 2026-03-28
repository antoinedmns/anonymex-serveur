import { ErreurRequeteInvalide } from "../../../erreursApi";
import { sessionCache } from "../../../../cache/sessions/SessionCache";

export async function getSuggestions(sessionId: string, codeEpreuve: string, incidentId: string): Promise<string[]> {
    const idSession = parseInt(sessionId ?? '');
    const idIncident = parseInt(incidentId ?? '');

    if (isNaN(idSession) || sessionId === undefined)
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");

    if (isNaN(idIncident) || incidentId === undefined)
        throw new ErreurRequeteInvalide("L'ID d'incident n'est pas valide.");

    const session = await sessionCache.getOrFetch(idSession);
    if (session === undefined) throw new ErreurRequeteInvalide("La session passée n'existe pas.");

    const epreuve = session.epreuves.get(codeEpreuve);
    if (epreuve === undefined) throw new ErreurRequeteInvalide("L'épreuve demandée n'existe pas.");

    const incident = await epreuve.incidents.getOrFetch(idIncident);
    if (incident == undefined) throw new ErreurRequeteInvalide("L'incident demandé n'existe pas.");

    // Aucun code anonymat partiel dans l'incident..
    if (incident.codeAnonymat === null) return [];

    // ..sinon, renvoyer les suggestions
    return await epreuve.incidents.suggererCodesAnonymat(incident.codeAnonymat);
}