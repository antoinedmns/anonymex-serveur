import { APIUpdateConvocation, UpdateConvocationSchema } from "../../../../contracts/convocations";
import { sessionCache } from "../../../../cache/sessions/SessionCache";
import { ErreurRequeteInvalide, ErreurServeur } from "../../../erreursApi";

export async function patchConvocation(sessionId: string, epreuveCode: string, codeAnonymat: string, data: Record<string, unknown>): Promise<APIUpdateConvocation> {

    const idSession = parseInt(sessionId ?? '');

    if (codeAnonymat.startsWith('Z')) {
        throw new ErreurServeur("Vous ne pouvez pas modifier ce code anonymat.");
    }

    if (isNaN(idSession) || sessionId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de la session est invalide.");
    }

    if (!epreuveCode) {
        throw new ErreurRequeteInvalide("Le code de l'epreuve est invalide.");
    }

    const session = await sessionCache.getOrFetch(idSession);
    if (!session) {
        throw new ErreurRequeteInvalide("La session demandé n'existe pas.");
    }

    const epreuve = await session.epreuves.getOrFetch(epreuveCode);
    if (!epreuve) {
        throw new ErreurRequeteInvalide("L'épreuve demandé n'existe pas.");
    }

    const dataParsees = UpdateConvocationSchema.parse(data);

    const convocation = await epreuve.convocations.getOrFetch(codeAnonymat);

    if (!convocation) {
        throw new ErreurRequeteInvalide("La convocation demandé n'existe pas.");
    }

    if (dataParsees.note_quart !== undefined) convocation.noteQuart = dataParsees.note_quart;
    if (dataParsees.rang !== undefined) convocation.rang = dataParsees.rang;
    if (dataParsees.code_salle !== undefined) convocation.codeSalle = dataParsees.code_salle;

    await epreuve.convocations.update(codeAnonymat, dataParsees);

    // Reconstruire le cache des convocations de l'épreuve pour refléter les mises à jour
    epreuve.convocations.reconstruireCache();

    return dataParsees;
}