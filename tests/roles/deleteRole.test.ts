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


    // Tests des erreurs de deleteRole.

    it("doit lever une ErreurRequeteInvalide si le roleId n'est pas défini.", async () => {
        await expect(deleteRole(undefined!)).rejects.toThrow(ErreurRequeteInvalide);
        await expect(deleteRole(undefined!)).rejects.toThrow("L'ID de rôle n'est pas valide.");
    });

    it("doit lever une ErreurRequeteInvalide si le roleId n'est pas un nombre.", async () => {
        await expect(deleteRole('abc')).rejects.toThrow(ErreurRequeteInvalide);
        await expect(deleteRole('abc')).rejects.toThrow("L'ID de rôle n'est pas valide.");
    });

    it("doit lever une ErreurRequeteInvalide si le roleId est une chaine vide.", async () => {
        await expect(deleteRole('')).rejects.toThrow(ErreurRequeteInvalide);
        await expect(deleteRole('')).rejects.toThrow("L'ID de rôle n'est pas valide.");
    });

    // Tests des succès de deleteRole.

    it("doit retourner success: true si une ligne a été affectée.", async () => {
        (roleCache.delete as jest.Mock).mockResolvedValue({ affectedRows : 1 });

        const resultat = await deleteRole('1');

        expect(roleCache.delete).toHaveBeenCalledWith(1);
        expect(resultat).toEqual({ success: true});
    });

        it("doit retourner success: false si aucune ligne n'a été affectée.", async () => {
        (roleCache.delete as jest.Mock).mockResolvedValue({ affectedRows : 0 });

        const resultat = await deleteRole('999');

        expect(roleCache.delete).toHaveBeenCalledWith(999);
        expect(resultat).toEqual({ success: false});
    });
})