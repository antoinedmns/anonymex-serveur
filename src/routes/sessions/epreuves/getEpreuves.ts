import { APIEpreuve, APIListEpreuves } from "../../../contracts/epreuves";
import { sessionCache } from "../../../cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../erreursApi";

export async function getEpreuves(sessionId: string): Promise<APIListEpreuves> {
    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");
    }

    const session = await sessionCache.getOrFetch(idSession);

    if (session === undefined) {
        throw new ErreurRequeteInvalide("La session demandée n'existe pas.");
    }

    const epreuvesBrutes = await session.epreuves.getAll();

    if (epreuvesBrutes === undefined) {
        throw new ErreurRequeteInvalide("Impossible de récupérer les épreuves de la session demandée.");
    }

    const now = Date.now();
    const epreuvesAvenir: APIEpreuve[] = [];
    const epreuvesPassees: APIEpreuve[] = [];

    for (const epreuve of epreuvesBrutes) {
        const epreuveFormatee = epreuve.toJSON();

        if (epreuve.dateEpreuve >= now) {
            epreuvesAvenir.push(epreuveFormatee);
        } else {
            epreuvesPassees.push(epreuveFormatee);
        }
    }

    return {
        epreuvesAvenir,
        epreuvesPassees
    };
}