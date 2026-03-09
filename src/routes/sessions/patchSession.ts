import { sessionCache } from "../../cache/sessions/SessionCache";
import { APIUpdateSession, UpdateSessionSchema } from "../../contracts/sessions";
import { ErreurRequeteInvalide } from "../erreursApi";

export async function patchSession(id: string, data: Record<string, unknown>): Promise<APIUpdateSession> {
    const idSession = parseInt(id ?? '');

    if (isNaN(idSession) || id === undefined)
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");

    const session = await sessionCache.getOrFetch(idSession);
    if (!session) throw new ErreurRequeteInvalide("La session passée n'existe pas.");

    const dataParsees = UpdateSessionSchema.parse(data);
    await sessionCache.update(idSession, dataParsees);
    sessionCache.get(idSession)?.fromData(dataParsees); // Mettre à jour le cache avec les nouvelles données

    return dataParsees;
}