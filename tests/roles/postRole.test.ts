import { postRole } from "../../src/routes/roles/postRole";
import { roleCache } from "../../src/cache/utilisateurs/roles/RoleCache";
import { ZodError } from "zod";

jest.mock("../../src/cache/utilisateurs/roles/RoleCache", () => ({
    roleCache: {
        insert: jest.fn(),
    },
}));

describe('postRole', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une erreur de validation (ZodError) si les données sont invalides.", async () => {
            await expect(postRole({})).rejects.toThrow(ZodError);

            await expect(postRole({ idRole: 1, nom: 123, permissions: "6" })).rejects.toThrow(ZodError);
            
            expect(roleCache.insert).not.toHaveBeenCalled();
        });
    });

    describe('Cas de succès', () => {
        it("doit retourner success: true si l'insertion a réussi.", async () => {
            (roleCache.insert as jest.Mock).mockResolvedValue({ affectedRows: 1 });

            const donnees = { idRole: 1, nom: "Administrateur", permissions: 10 };

            await expect(postRole(donnees)).resolves.toEqual({ success: true });
            
            expect(roleCache.insert).toHaveBeenCalledWith({
                nom: "Administrateur",
                permissions: 10
            });
        });

        it("doit retourner success: false si l'insertion n'a affecté aucune ligne.", async () => {
            (roleCache.insert as jest.Mock).mockResolvedValue({ affectedRows: 0 });

            const donnees = { idRole: 2, nom: "Scanneur", permissions: 4 };

            await expect(postRole(donnees)).resolves.toEqual({ success: false });
            
            expect(roleCache.insert).toHaveBeenCalledWith({
                nom: "Scanneur",
                permissions: 4
            });
        });
    });
});