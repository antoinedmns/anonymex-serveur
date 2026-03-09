import { getSessions } from "../../src/routes/sessions/getSessions";
import { sessionCache } from "../../src/cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../src/routes/erreursApi";
import { Session } from "../../src/cache/sessions/Session";

jest.mock("../../src/cache/sessions/SessionCache", () => ({
    sessionCache: {
        getAll: jest.fn(),
    },
}));

describe('getSessions', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si la récupération des sessions échoue.", async () => {
            (sessionCache.getAll as jest.Mock).mockResolvedValue(undefined);

            await expect(getSessions()).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getSessions()).rejects.toThrow("La liste des sessions n'a pas pu être renvoyée.");
        });
    });

    describe('Cas de succès', () => {
        it("doit retourner des valeurs par défaut si aucune session n'est en cache.", async () => {
            (sessionCache.getAll as jest.Mock).mockResolvedValue([]);

            await expect(getSessions()).resolves.toEqual({
                anneeMax: -Infinity,
                anneeMin: Infinity,
                sessions: []
            });
            expect(sessionCache.getAll).toHaveBeenCalled();
        });

        it('doit retourner la liste des sessions avec les années min et max calculées', async () => {
            const sessionsBrutes = [
                new Session({ id_session: 1, annee: 2025, nom: "Session Pair 1", statut: 0 }),
                new Session({ id_session: 2, annee: 2025, nom: "Session Impair 1", statut: 1 }),
                new Session({ id_session: 3, annee: 2026, nom: "Session Pair 2", statut: 2 })
            ];

            (sessionCache.getAll as jest.Mock).mockResolvedValue(sessionsBrutes);

            await expect(getSessions()).resolves.toEqual({
                anneeMax: 2026,
                anneeMin: 2025,
                sessions: [
                    { id: 1, annee: 2025, nom: "Session Pair 1", statut: 0 },
                    { id: 2, annee: 2025, nom: "Session Impair 1", statut: 1 },
                    { id: 3, annee: 2026, nom: "Session Pair 2", statut: 2 }
                ]
            });
            expect(sessionCache.getAll).toHaveBeenCalled();
        });
    });
});