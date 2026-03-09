import { getRole } from "../../src/routes/roles/getRole";
import { roleCache } from "../../src/cache/utilisateurs/roles/RoleCache";
import { ErreurRequeteInvalide } from "../../src/routes/erreursApi";
import { APIRole } from "../../src/contracts/roles";

jest.mock("../../src/cache/utilisateurs/roles/RoleCache", () => ({
    roleCache: {
        getOrFetch: jest.fn(),
    },
}));

describe('getRole', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });


    // Tests des erreurs de getRole.
    it("doit lever une ErreurRequeteInvalide si le roleId n'est pas défini.", async () => {
        await expect(getRole(undefined!)).rejects.toThrow(ErreurRequeteInvalide);
        await expect(getRole(undefined!)).rejects.toThrow("L'ID de rôle n'est pas valide.");
    });

    it("doit lever une ErreurRequeteInvalide si le roleId n'est pas un nombre.", async () => {
        await expect(getRole('abc')).rejects.toThrow(ErreurRequeteInvalide);
        await expect(getRole('abc')).rejects.toThrow("L'ID de rôle n'est pas valide.");
    });

    it("doit lever une ErreurRequeteInvalide si le roleId est une chaine vide.", async () => {
        await expect(getRole('')).rejects.toThrow(ErreurRequeteInvalide);
        await expect(getRole('')).rejects.toThrow("L'ID de rôle n'est pas valide.");
    });

    it("doit lever une ErreurRequeteInvalide si le roleId n'existe pas.", async () => {
        (roleCache.getOrFetch as jest.Mock).mockResolvedValue(undefined);

        await expect(getRole('999')).rejects.toThrow(ErreurRequeteInvalide);
        await expect(getRole('999')).rejects.toThrow("Le rôle demandé n'existe pas.");

        expect(roleCache.getOrFetch).toHaveBeenCalledWith(999);
    });

    // Tests des succès de getRole.

    it("doit retourner le role au format JSON si il est trouvé.", async () => {
        const mockRoleData = {
            id: 1,
            nom: "Administrateur",
            permissions: 10
        };
        const mockRoleBrut = {
            toJSON: jest.fn().mockReturnValue(mockRoleData)
        };

        (roleCache.getOrFetch as jest.Mock).mockResolvedValue(mockRoleBrut);

        const resultat = await getRole('1');

        expect(roleCache.getOrFetch).toHaveBeenCalledWith(1);
        expect(mockRoleBrut.toJSON).toHaveBeenCalled();
        expect(resultat).toEqual(mockRoleData);
    });
})