import { sessionCache } from "../../../../cache/sessions/SessionCache";
import { APIBoolResponse } from "../../../../contracts/common";
import { ErreurRequeteInvalide } from "../../../erreursApi";

export async function deleteIncident(sessionId: string, codeEpreuve: string, incidentId: string): Promise<APIBoolResponse> {
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

    const epreuve = await session.epreuves.getOrFetch(codeEpreuve);
    if (epreuve === undefined) {
        throw new ErreurRequeteInvalide("L'épreuve demandée n'existe pas.");
    }

    const incident = await epreuve.incidents.getOrFetch(idIncident);

    if (incident == undefined) {
        throw new ErreurRequeteInvalide("L'incident demandé n'existe pas.");
    }

    try {
        await epreuve.incidents.delete(idIncident);
        return { success: true };
    } catch {
        return { success: false };
    }

}