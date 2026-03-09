import { APIListSessions, APISession } from "../../contracts/sessions";
import { sessionCache } from "../../cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../erreursApi";

export async function getSessions(): Promise<APIListSessions> {
    const sessionsBrutes = await sessionCache.getAll();

    if (sessionsBrutes === undefined) {
        throw new ErreurRequeteInvalide("La liste des sessions n'a pas pu être renvoyée.")
    }

    const sessionsFormatees: APISession[] = [];
    let anneeSessionMax = -Infinity;
    let anneeSessionMin = Infinity;

    for (const session of sessionsBrutes) {
        sessionsFormatees.push(session.toJSON());

        if (session.annee > anneeSessionMax) anneeSessionMax = session.annee;
        if (session.annee < anneeSessionMin) anneeSessionMin = session.annee;
    }

    return {
        anneeMax: anneeSessionMax,
        anneeMin: anneeSessionMin,
        sessions: sessionsFormatees
    };
}