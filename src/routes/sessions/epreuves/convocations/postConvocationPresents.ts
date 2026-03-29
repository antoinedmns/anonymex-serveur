import { sessionCache } from "../../../../cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../../erreursApi";
import { Database } from "../../../../core/services/database/Database";
import { APIBoolResponse } from "../../../../contracts/common";

export async function postConvocationPresents(sessionId: string, epreuveCode: string, presents: unknown | undefined): Promise<APIBoolResponse> {

    const idSession = parseInt(sessionId ?? '');

    const nbPresents = parseInt(presents?.toString() ?? '');

    if (isNaN(idSession) || sessionId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de la session est invalide.");
    }

    if (!epreuveCode) {
        throw new ErreurRequeteInvalide("Le code de l'epreuve est invalide.");
    }

    if (isNaN(nbPresents) || nbPresents < 0) {
        throw new ErreurRequeteInvalide("Le nombre de presents est invalide.");
    }

    const session = await sessionCache.getOrFetch(idSession);
    if (!session) {
        throw new ErreurRequeteInvalide("La session demandé n'existe pas.");
    }

    const resultats = await Database.query<{ compteur: number }>("SELECT COUNT(*) as compteur FROM convocation c WHERE c.code_epreuve = ? AND c.id_session = ? AND c.note_quart IS NOT NULL;", [idSession, epreuveCode]);

    const nbScans = resultats[0]?.compteur ?? 0;

    if (nbScans === nbPresents) {
        // TODO: Changer le status
    }

    const epreuve = await session.epreuves.update(epreuveCode, { nb_presents: nbPresents });

    return { success: epreuve.affectedRows > 0 };
}

/*
export async function postConvocationPresents(sessionId: string, epreuveCode: string, presentsParSalle: Record<string, number>): Promise<APIBoolResponse> {

    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de la session est invalide.");
    }

    if (!epreuveCode) {
        throw new ErreurRequeteInvalide("Le code de l'epreuve est invalide.");
    }

    if (!presentsParSalle || !Array.isArray(presentsParSalle)) {
        throw new ErreurRequeteInvalide("Le body doit être de la forme { salle: nbPresents }.");
    }

    const session = await sessionCache.getOrFetch(idSession);
    if (!session) {
        throw new ErreurRequeteInvalide("La session demandé n'existe pas.");
    }

    const epreuve = await session.epreuves.getOrFetch(epreuveCode);
    if (!epreuve) {
        throw new ErreurRequeteInvalide("L'épreuve demandé n'existe pas.");
    }

    const resultatsSalles = await Database.query<{ codeSalle: string }>("SELECT DISTINCT code_salle as codeSalle FROM convocation WHERE id_session = ? AND code_epreuve = ?;", [idSession, epreuveCode]);

    const sallesConvocations = resultatsSalles.map(salle => salle.codeSalle);

    let totalPresents = 0;

    for (const salle of sallesConvocations) {
        const nbPresents = presentsParSalle[salle];

        if (nbPresents === undefined || nbPresents === null) {
            throw new ErreurRequeteInvalide(`La salle ${salle} manque à la liste de présence des salles.`);
        }

        if (isNaN(nbPresents) || nbPresents < 0) {
            throw new ErreurRequeteInvalide(`Le nombre de présents pour la salle ${salle} est invalide.`);
        }

        totalPresents += nbPresents;
    }

    const resultatsScans = await Database.query<{ compteurScans: number }>("SELECT COUNT(*) as compteurScans FROM convocation WHERE code_epreuve = ? AND id_session = ? AND note_quart IS NOT NULL;", [epreuveCode, idSession]);

    const nbScans = resultatsScans[0]?.compteurScans ?? 0;

    if (nbScans === totalPresents) {
        // TODO: Changer le status (ex: epreuve.setStatus('TERMINE'))
    }

    const updateResult = await session.epreuves.update(epreuveCode, { nb_presents: totalPresents });

    return { success: updateResult.affectedRows > 0 };
}
*/