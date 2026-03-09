import { APIEpreuve } from "../../../contracts/epreuves";
import { sessionCache } from "../../../cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../erreursApi";

export async function getEpreuve(sessionId: string, epreuveCode: string): Promise<APIEpreuve> {
    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");
    }

    const session = await sessionCache.getOrFetch(idSession);

    if (session === undefined) {
        throw new ErreurRequeteInvalide("La session demandée n'existe pas.");
    }

    const epreuve = await session.epreuves.getOrFetch(epreuveCode);

    if (epreuve === undefined) {
        throw new ErreurRequeteInvalide("L'épreuve demandée n'existe pas.");
    }

    return epreuve.toJSON();
}
