import { ResultSetHeader } from "mysql2";
import { MediaService } from "../../../core/services/MediaService";
import { logWarn } from "../../../utils/logger";
import { DatabaseCacheBase } from "../../base/DatabaseCacheBase";
import { Incident, IncidentData } from "./Incident";

export class IncidentCache extends DatabaseCacheBase<number /*id*/, Incident, IncidentData> {

    nomTable = "incident";
    colonnesClePrimaire: string[] = ["id_session", "code_epreuve", "id_incident"];

    /**
     * Instancier un cache pour les incidents d'une épreuve donnée.
     * @param idSession
     * @param codeEpreuve
     */
    constructor(idSession: number, codeEpreuve: string) {
        super([idSession, codeEpreuve]);
    }

    /**
     * Supprime un incident de la BDD, du cache, et supprime le scan associé à l'incident corrigé.
     * @param incidentId L'ID de l'incident à supprimer.
     */
    override async delete(incidentId: number): Promise<ResultSetHeader> {
        const result = await super.delete(incidentId);

        // Supprimer le scan de l'incident corrigé
        if (result.affectedRows > 0) {
            await MediaService.supprimerMedia('incidents/', `${incidentId}.webp`).catch(() => {
                logWarn("postIncident", `Impossible de supprimer le scan de l'incident ${incidentId}. Le fichier n'existe peut-être plus.`);
            });
        }

        return result;
    }

    fromDatabase(data: IncidentData): Incident {
        return new Incident(data);
    }

    getComposanteCache(element: Incident): number {
        return element.idIncident;
    }

}