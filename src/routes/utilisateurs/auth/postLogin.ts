import { Request, Response } from "express";
import { LoginUtilisateurSchema } from "../../../contracts/utilisateurs";
import { utilisateurCache } from "../../../cache/utilisateurs/UtilisateurCache";
import { Database } from "../../../core/services/database/Database";
import { compare } from "bcrypt";
import { Utilisateur, UtilisateurData } from "../../../cache/utilisateurs/Utilisateur";
import { logError } from "../../../utils/logger";

export async function postLogin(req: Request, res: Response): Promise<void> {
    const infosLogin = LoginUtilisateurSchema.parse(req.body);

    const utilisateurEmail = await Database.query<UtilisateurData>("SELECT * FROM utilisateur WHERE email = ? LIMIT 1", [infosLogin.email]);
    if (utilisateurEmail.length === 0 || utilisateurEmail[0] === undefined) {
        res.json({ success: false });
        return;
    }

    const utilisateurBrut = utilisateurEmail[0];
    const estCorrect = await new Promise<boolean>((resolve) => {
        // Compare le mot de passe avec le hash stocké
        // si valide, résoudre la promesse avec true
        compare(infosLogin.motDePasse, utilisateurBrut.mot_de_passe.toString(), (err, result) => {
            if (err) {
                logError("Login", "Erreur lors de la comparaison des mots de passe pour l'utilisateur.");
                console.error(err);
                resolve(false);
            } else {
                resolve(result);
            }
        });
    });

    if (!estCorrect) {
        res.json({ success: false });
        return;
    }

    // Instancier l'utilisateur et le stocker en cache
    const utilisateur = new Utilisateur(utilisateurBrut);
    utilisateurCache.set(utilisateurBrut.id_utilisateur, utilisateur);

    setJetonAuthentificationCookie(res, "moufettes245");

    res.json({ success: true });

}

export function setJetonAuthentificationCookie(res: Response, jeton: string): void {
    // Définir le cookie d'authentification
    res.cookie("jeton_auth", jeton, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 16 * 60 * 60 * 1000 // 16 heures
    });
}