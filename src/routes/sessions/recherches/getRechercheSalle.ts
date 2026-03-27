import { sessionCache } from "../../../cache/sessions/SessionCache";
import { APIEpreuve } from "../../../contracts/epreuves";
import { Database } from "../../../core/services/database/Database";
import { ErreurRequeteInvalide, ErreurServeur } from "../../erreursApi";

export async function getRechercheSalle(sessionId: string, codeSalle: string): Promise<APIEpreuve[]> {

    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de la session est invalide");
    }

    const resultats = await Database.query<{ codeEpreuve: string }>("SELECT DISTINCT e.code_epreuve as codeEpreuve FROM epreuve e JOIN convocation c ON e.id_session = c.id_session AND e.code_epreuve = c.code_epreuve WHERE c.id_session = ? AND code_salle = ?;", [idSession, codeSalle]);

    const codesEpreuves = resultats.map(resultat => resultat.codeEpreuve);

    const session = await sessionCache.getOrFetch(idSession);

    if (!session) {
        throw new ErreurServeur(`La session d'id : ${idSession} n'existe pas.`);
    }

    const toutesLesEpreuves = await session.epreuves.getAll();

    const epreuves = toutesLesEpreuves
        .filter(epreuve => codesEpreuves.includes(epreuve.codeEpreuve))
        .map(epreuve => epreuve.toJSON())

    return epreuves;
}