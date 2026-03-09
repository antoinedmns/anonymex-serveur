import { postSession } from "../../src/routes/sessions/postSession";
import { sessionCache } from "../../src/cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../src/routes/erreursApi";
import { Session } from "../../src/cache/sessions/Session";
import { SessionsStatut } from "../../src/contracts/sessions";
import { ZodError } from "zod";

jest.mock("../../src/cache/sessions/SessionCache", () => ({
    sessionCache: {
        insert: jest.fn(),
        set: jest.fn(),
    },
}));

describe('postSession', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une erreur de validation (ZodError) si les données sont invalides.", async () => {
            await expect(postSession({})).rejects.toThrow(ZodError);
            expect(sessionCache.insert).not.toHaveBeenCalled();
        });

        it("doit lever une ErreurRequeteInvalide si l'année est inférieure à l'année courante.", async () => {
            const anneePassee = new Date().getFullYear() - 1;
            const donnees = { nom: "Session Pair 1", annee: anneePassee };

            await expect(postSession(donnees)).rejects.toThrow(ErreurRequeteInvalide);
            await expect(postSession(donnees)).rejects.toThrow(`Erreur l'année ne peut pas être inférieure à ${anneePassee + 1}.`);
            
            expect(sessionCache.insert).not.toHaveBeenCalled();
        });
    });

    describe('Cas de succès', () => {
        it("doit insérer la session, la mettre en cache et retourner le format JSON", async () => {
            const anneeCourante = new Date().getFullYear();
            const donneesInput = { nom: "Session Pair 1", annee: anneeCourante };
            
            (sessionCache.insert as jest.Mock).mockResolvedValue({ insertId: 10, affectedRows: 1 });

            await expect(postSession(donneesInput)).resolves.toEqual({
                id: 10,
                nom: "Session Pair 1",
                annee: anneeCourante,
                statut: SessionsStatut.ACTIVE
            });

            expect(sessionCache.insert).toHaveBeenCalledWith({
                nom: "Session Pair 1",
                annee: anneeCourante,
                statut: SessionsStatut.ACTIVE
            });

            expect(sessionCache.set).toHaveBeenCalledWith(10, expect.any(Session));
        });
    });
});