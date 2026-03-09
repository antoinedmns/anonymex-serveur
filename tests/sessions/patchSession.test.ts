import { patchSession } from "../../src/routes/sessions/patchSession";
import { sessionCache } from "../../src/cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../src/routes/erreursApi";
import { ZodError } from "zod";

jest.mock("../../src/cache/sessions/SessionCache", () => ({
    sessionCache: {
        getOrFetch: jest.fn(),
        update: jest.fn(),
        get: jest.fn(),
    },
}));

describe('patchSession', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si l'ID de session n'est pas valide (undefined, non-nombre, vide).", async () => {
            await expect(patchSession(undefined!, {})).rejects.toThrow(ErreurRequeteInvalide);
            await expect(patchSession(undefined!, {})).rejects.toThrow("L'ID de session n'est pas valide.");

            await expect(patchSession('abc', {})).rejects.toThrow("L'ID de session n'est pas valide.");
            await expect(patchSession('', {})).rejects.toThrow("L'ID de session n'est pas valide.");
        });

        it("doit lever une ErreurRequeteInvalide si la session n'existe pas.", async () => {
            (sessionCache.getOrFetch as jest.Mock).mockResolvedValue(undefined);

            await expect(patchSession('1', { nom: "Session Pair 1" })).rejects.toThrow(ErreurRequeteInvalide);
            await expect(patchSession('1', { nom: "Session Pair 1" })).rejects.toThrow("La session passée n'existe pas.");
        });

        it("doit lever une erreur de validation (ZodError) si les données sont invalides.", async () => {
            (sessionCache.getOrFetch as jest.Mock).mockResolvedValue({ id: 1 });
            
            await expect(patchSession('1', { annee: "2026" })).rejects.toThrow(ZodError);
        });
    });

    describe('Cas de succès', () => {
        it("doit mettre à jour le cache et retourner les données parsées si tout est valide", async () => {
            const mockSession = { fromData: jest.fn() };
            const donneesUpdate = { nom: "Session Pair 2", annee: 2026 };

            (sessionCache.getOrFetch as jest.Mock).mockResolvedValue(mockSession);
            (sessionCache.get as jest.Mock).mockReturnValue(mockSession);
            (sessionCache.update as jest.Mock).mockResolvedValue({ affectedRows: 1 });

            await expect(patchSession('1', donneesUpdate)).resolves.toEqual(donneesUpdate);

            expect(sessionCache.update).toHaveBeenCalledWith(1, donneesUpdate);
            expect(mockSession.fromData).toHaveBeenCalledWith(donneesUpdate);
        });
    });
});