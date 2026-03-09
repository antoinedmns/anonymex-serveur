import { sessionCache } from "../../cache/sessions/SessionCache";

/**
 * Supprime une session.
 * @route `DELETE /sessions/:id/`
 */
export async function deleteSession(sessionId: string): Promise<{ success: boolean }> {
    const idSession = parseInt(sessionId ?? '');
    const suppressionSession = await sessionCache.delete(idSession);

    return {
        success: suppressionSession.affectedRows > 0
    }
}