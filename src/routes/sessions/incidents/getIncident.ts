import { APIIncident } from "../../../contracts/incidents";
import { ErreurRequeteInvalide } from "../../erreursApi";
import { sessionCache } from "../../../cache/sessions/SessionCache";

export async function getIncident(sessionId: string, incidentId: string): Promise<APIIncident> {
    const idSession = parseInt(sessionId ?? '');
    const idIncident = parseInt(incidentId ?? '');

    if (isNaN(idSession) || sessionId === undefined)
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");

    if (isNaN(idIncident) || incidentId === undefined)
        throw new ErreurRequeteInvalide("L'ID d'incident n'est pas valide.");

    const session = await sessionCache.getOrFetch(idSession);

    if (session === undefined) {
        throw new ErreurRequeteInvalide("La session passée n'existe pas.");
    }

    //TODO: A continuer pas sur de tout...

    return ({
        idIncident: 4,
        idSession: 1,
        codeEpreuve: "HAI405I",
        titre: "Numéro d'anonymat inconnu",
        details: "Lorem ipsum...",
        resolu: Math.floor(Math.random()) < 0.5,
        codeAnonymat: "AFGH",
        noteQuart: 60,
    });
}