import { deleteRole } from "../src/routes/roles/deleteRole";
import { getRole } from "../src/routes/roles/getRole";
import { getRoles } from "../src/routes/roles/getRoles";
import { postRole } from "../src/routes/roles/postRole";
import { roleCache } from "../src/cache/utilisateurs/roles/RoleCache";
import { Role } from "../src/cache/utilisateurs/roles/Role";
import { ErreurRequeteInvalide } from "../src/routes/erreursApi";
import { ZodError } from "zod";

jest.mock("../src/cache/utilisateurs/roles/RoleCache", () => ({
    roleCache: {
        delete: jest.fn(),
        getOrFetch: jest.fn(),
        getAll: jest.fn(),
        insert: jest.fn(),

    },
}));

// --- deleteRole ---

describe('deleteRole', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si le roleId n'est pas valide (undefined, non-nombre, vide).", async () => {

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

// --- getRole ---

describe('getRole', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Cas d\'erreurs', () => {
        it("doit lever une ErreurRequeteInvalide si le roleId n'est pas valide (undefined, non-nombre, vide).", async () => {

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

// -- getRoles --

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

// -- postRole --

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