import { deleteSession } from "../../src/routes/sessions/deleteSession";
import { sessionCache } from "../../src/cache/sessions/SessionCache";

jest.mock("../../src/cache/sessions/SessionCache", () => ({
    sessionCache: {
        delete: jest.fn(),
    },
}));

describe('deleteSession', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit retourner success: false si l'ID de session n'est pas valide (NaN).", async () => {
            
            (sessionCache.delete as jest.Mock).mockResolvedValue({ affectedRows: 0 });

            await expect(deleteSession('abc')).resolves.toEqual({ success: false });
            await expect(deleteSession('')).resolves.toEqual({ success: false });
        });
    });

    describe('Cas de succès', () => {
        it("doit retourner success: true si une ligne a été affectée.", async () => {
            (sessionCache.delete as jest.Mock).mockResolvedValue({ affectedRows: 1 });

            await expect(deleteSession('1')).resolves.toEqual({ success: true });
            expect(sessionCache.delete).toHaveBeenCalledWith(1);
        });

        it("doit retourner success: false si aucune ligne n'a été affectée.", async () => {
            (sessionCache.delete as jest.Mock).mockResolvedValue({ affectedRows: 0 });

            await expect(deleteSession('999')).resolves.toEqual({ success: false });
            expect(sessionCache.delete).toHaveBeenCalledWith(999);
        });
    });
});