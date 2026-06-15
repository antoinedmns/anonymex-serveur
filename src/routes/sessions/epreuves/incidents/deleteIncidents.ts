import { sessionCache } from "../../../../cache/sessions/SessionCache";
import { APIBoolResponse } from "../../../../contracts/common";
import { MediaService } from "../../../../core/services/MediaService";
import { logWarn } from "../../../../utils/logger";
import { ErreurRequeteInvalide } from "../../../erreursApi";

export async function deleteIncidents(sessionId: string, codeEpreuve: string): Promise<APIBoolResponse> {
    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined)
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");

    const session = await sessionCache.getOrFetch(idSession);

    if (session === undefined) {
        throw new ErreurRequeteInvalide("La session passée n'existe pas.");
    }

    const epreuve = await session.epreuves.getOrFetch(codeEpreuve);
    if (epreuve === undefined) {
        throw new ErreurRequeteInvalide("L'épreuve demandée n'existe pas.");
    }

    const incidents = await epreuve.incidents.getAll();

    try {
        for (const incident of incidents) {
            const idIncident = incident.idIncident;
            await epreuve.incidents.delete(idIncident);
            await MediaService.supprimerMedia(MediaService.getIncidentDir(session.id), `${idIncident}.webp`).catch(() => {
                logWarn("deleteIncidents", `Impossible de supprimer le scan de l'incident ${idIncident}. Le fichier n'existe peut-être plus.`);
            });
        }

        return { success: true };
    } catch {
        return { success: false };
    }
}
