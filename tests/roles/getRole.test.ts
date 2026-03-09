import { getRole } from "../../src/routes/roles/getRole";
import { roleCache } from "../../src/cache/utilisateurs/roles/RoleCache";
import { ErreurRequeteInvalide } from "../../src/routes/erreursApi";
import { Role } from "../../src/cache/utilisateurs/roles/Role";

jest.mock("../../src/cache/utilisateurs/roles/RoleCache", () => ({
    roleCache: {
        getOrFetch: jest.fn(),
    },
}));

describe('getRole', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si le roleId n'est pas valide (undefined, non-nombre, vide).", async () => {
            await expect(getRole(undefined!)).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getRole(undefined!)).rejects.toThrow("L'ID de rôle n'est pas valide.");

            await expect(getRole('abc')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getRole('abc')).rejects.toThrow("L'ID de rôle n'est pas valide.");

            await expect(getRole('')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getRole('')).rejects.toThrow("L'ID de rôle n'est pas valide.");
        });

        it("doit lever une ErreurRequeteInvalide si le roleId n'existe pas.", async () => {
            (roleCache.getOrFetch as jest.Mock).mockResolvedValue(undefined);

            await expect(getRole('999')).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getRole('999')).rejects.toThrow("Le rôle demandé n'existe pas.");
            expect(roleCache.getOrFetch).toHaveBeenCalledWith(999);
        });
    });

    describe('Cas de succès', () => {
        it('doit retourner le rôle au format JSON si trouvé', async () => {
            (roleCache.getOrFetch as jest.Mock).mockResolvedValue(new Role({
                id_role: 1,
                nom: "Administrateur",
                permissions: 10
            }));

            await expect(getRole('1')).resolves.toEqual({
                idRole: 1,
                nom: "Administrateur",
                permissions: 10
            });
            expect(roleCache.getOrFetch).toHaveBeenCalledWith(1);
        });
    });
});