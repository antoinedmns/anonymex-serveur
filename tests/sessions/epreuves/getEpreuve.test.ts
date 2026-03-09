import { getEpreuve } from "../../../src/routes/sessions/epreuves/getEpreuve";
import { sessionCache } from "../../../src/cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../../src/routes/erreursApi";
import { Epreuve } from "../../../src/cache/epreuves/Epreuve";

jest.mock("../../../src/cache/sessions/SessionCache", () => ({
    sessionCache: {
        getOrFetch: jest.fn(),
    },
}));

describe('getEpreuve', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si l'ID de session n'est pas valide (undefined, non-nombre, vide).", async () => {
            await expect(getEpreuve(undefined!, 'HAI604I')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getEpreuve(undefined!, 'HAI604I')).rejects.toThrow("L'ID de session n'est pas valide.");

            await expect(getEpreuve('abc', 'HAI604I')).rejects.toThrow("L'ID de session n'est pas valide.");
            await expect(getEpreuve('', 'HAI604I')).rejects.toThrow("L'ID de session n'est pas valide.");
        });

        it("doit lever une ErreurRequeteInvalide si la session n'existe pas.", async () => {
            (sessionCache.getOrFetch as jest.Mock).mockResolvedValue(undefined);

            await expect(getEpreuve('1', 'HAI604I')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getEpreuve('1', 'HAI604I')).rejects.toThrow("La session demandée n'existe pas.");
            
            expect(sessionCache.getOrFetch).toHaveBeenCalledWith(1);
        });

        it("doit lever une ErreurRequeteInvalide si l'épreuve n'existe pas dans la session.", async () => {
            const mockSession = {
                epreuves: {
                    getOrFetch: jest.fn().mockResolvedValue(undefined)
                }
            };
            (sessionCache.getOrFetch as jest.Mock).mockResolvedValue(mockSession);

            await expect(getEpreuve('1', 'INCONNUE')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getEpreuve('1', 'INCONNUE')).rejects.toThrow("L'épreuve demandée n'existe pas.");
            
            expect(mockSession.epreuves.getOrFetch).toHaveBeenCalledWith('INCONNUE');
        });
    });

    describe('Cas de succès', () => {
        it("doit retourner l'épreuve au format JSON si elle est trouvée", async () => {
            const epreuveBrute = new Epreuve({
                id_session: 1,
                code_epreuve: "HAI604I",
                nom: "Programmation Multi-tâches",
                statut: 0,
                date_epreuve: 1,
                duree: 120,
                nb_presents: 90
            });

            const mockSession = {
                epreuves: {
                    getOrFetch: jest.fn().mockResolvedValue(epreuveBrute)
                }
            };

            (sessionCache.getOrFetch as jest.Mock).mockResolvedValue(mockSession);

            await expect(getEpreuve('1', 'HAI604I')).resolves.toEqual({
                session: 1,
                code: "HAI604I",
                nom: "Programmation Multi-tâches",
                statut: 0,
                date: 1 * 60,
                duree: 120,
                copies: 0,
                incidents: 0,
                salles: []
            });

            expect(sessionCache.getOrFetch).toHaveBeenCalledWith(1);
            expect(mockSession.epreuves.getOrFetch).toHaveBeenCalledWith('HAI604I');
        });
    });
});