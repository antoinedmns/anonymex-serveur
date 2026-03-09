import { getRoles } from "../../src/routes/roles/getRoles";
import { roleCache } from "../../src/cache/utilisateurs/roles/RoleCache";
import { ErreurRequeteInvalide } from "../../src/routes/erreursApi";
import { Role } from "../../src/cache/utilisateurs/roles/Role";

jest.mock("../../src/cache/utilisateurs/roles/RoleCache", () => ({
    roleCache: {
        getAll: jest.fn(),
    },
}));

describe('getRoles', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si la récupération des rôles échoue.", async () => {
            (roleCache.getAll as jest.Mock).mockResolvedValue(undefined);

            await expect(getRoles()).rejects.toThrow(ErreurRequeteInvalide);
            await expect(getRoles()).rejects.toThrow("La liste des rôles n'a pas pu être renvoyées.");
        });
    });

    describe('Cas de succès', () => {
        it("doit retourner une liste vide si aucun rôle n'est en cache.", async () => {
            (roleCache.getAll as jest.Mock).mockResolvedValue([]);

            await expect(getRoles()).resolves.toEqual({ roles: [] });
            expect(roleCache.getAll).toHaveBeenCalled();
        });

        it('doit retourner la liste des rôles au format JSON', async () => {
            (roleCache.getAll as jest.Mock).mockResolvedValue([
                new Role({ id_role: 1, nom: "Administrateur", permissions: 10 }),
                new Role({ id_role: 2, nom: "Correcteur", permissions: 8 })
            ]);

            await expect(getRoles()).resolves.toEqual({
                roles: [
                    { idRole: 1, nom: "Administrateur", permissions: 10 },
                    { idRole: 2, nom: "Correcteur", permissions: 8 }
                ]
            });
            expect(roleCache.getAll).toHaveBeenCalled();
        });
    });
});