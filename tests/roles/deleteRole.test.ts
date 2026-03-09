import { deleteRole } from "../../src/routes/roles/deleteRole";
import { roleCache } from "../../src/cache/utilisateurs/roles/RoleCache";
import { ErreurRequeteInvalide } from "../../src/routes/erreursApi";

jest.mock("../../src/cache/utilisateurs/roles/RoleCache", () => ({
    roleCache: {
        delete: jest.fn(),
    },
}));

describe('deleteRole', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si le roleId n'est pas valide (undefined, non-nombre, vide).", async () => {
            await expect(deleteRole(undefined!)).rejects.toThrow(ErreurRequeteInvalide);
            await expect(deleteRole(undefined!)).rejects.toThrow("L'ID de rôle n'est pas valide.");

            await expect(deleteRole('abc')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(deleteRole('abc')).rejects.toThrow("L'ID de rôle n'est pas valide.");

            await expect(deleteRole('')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(deleteRole('')).rejects.toThrow("L'ID de rôle n'est pas valide.");
        });
    });

    describe('Cas de succès', () => {
        it("doit retourner success: true si une ligne a été affectée.", async () => {
            (roleCache.delete as jest.Mock).mockResolvedValue({ affectedRows: 1 });

            await expect(deleteRole('1')).resolves.toEqual({ success: true });
            expect(roleCache.delete).toHaveBeenCalledWith(1);
        });

        it("doit retourner success: false si aucune ligne n'a été affectée.", async () => {
            (roleCache.delete as jest.Mock).mockResolvedValue({ affectedRows: 0 });

            await expect(deleteRole('999')).resolves.toEqual({ success: false });
            expect(roleCache.delete).toHaveBeenCalledWith(999);
        });
    });
});