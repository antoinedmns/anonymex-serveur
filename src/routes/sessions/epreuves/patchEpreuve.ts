import { APIUpdateEpreuve, UpdateEpreuveSchema } from "../../../contracts/epreuves";
import { sessionCache } from "../../../cache/sessions/SessionCache";

export async function patchEpreuve(sessionId: string, epreuveCode: string, data: Record<string, unknown>): Promise<APIUpdateEpreuve> {
    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined) {
        throw new Error("L'ID de session n'est pas valide.");
    }

    const session = await sessionCache.getOrFetch(idSession);
    if (!session) throw new Error("La session passée n'existe pas.");

    const epreuve = await session.epreuves.getOrFetch(epreuveCode);
    if (!epreuve) throw new Error("L'épreuve passée n'existe pas.");

    const dataParsees = UpdateEpreuveSchema.parse(data);

    if (dataParsees.nom !== undefined) epreuve.nom = dataParsees.nom;
    if (dataParsees.duree !== undefined) epreuve.duree = dataParsees.duree;
    if (dataParsees.date_epreuve !== undefined) epreuve.dateEpreuve = dataParsees.date_epreuve;

    await session.epreuves.update(epreuveCode, dataParsees);

    return dataParsees;
}