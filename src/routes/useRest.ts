import { Request, Response } from "express";
import { ZodError } from "zod";
import { ErreurAccesRefuse, ErreurNonAuthentifie, ErreurRequeteInvalide, ErreurServeur } from "./erreursApi";
import { ErreurBase } from "../core/ErreurBase";

/**
 * Permet d'utiliser une fonction REST standardisée. Avec authentification et gestion des erreurs.
 * @param fn La fonction à exécuter. Ce qu'elle renvoit sera envoyé en JSON.
 * @param req 
 * @param res 
 */
export function useRest(fn: () => Promise<unknown>, req: Request, res: Response) {
    // plus tard(TODO) : authentification
    fn()
        .then((data) => res.json(data))
        .catch((error) => {
            handleRestError(error, res);
        });
}

/**
 * Utiliser une fonction REST complète, ne déléguant pas la gestion des réponses ni l'authentification.
 * @param fn La fonction à exécuter.
 * @param req 
 * @param res 
 */
export function useFullRest(fn: () => Promise<unknown>, req: Request, res: Response) {
    fn().catch((error) => {
        handleRestError(error, res);
    });
}

/**
 * Gérer les erreurs des requêtes REST.
 * @param error L'erreur à gérer.
 * @param res La réponse Express.
 */
export function handleRestError(error: unknown, res: Response) {
    // Erreur de validation Zod
    if (error instanceof ZodError) {
        res.status(400).send("Requête invalide ou mal formée");
    } else if (error instanceof ErreurRequeteInvalide) {
        res.status(400).send(error.message ?? "Requête invalide ou mal formée");
    } else if (error instanceof ErreurNonAuthentifie) {
        res.status(401).send("Non authentifié");
    } else if (error instanceof ErreurAccesRefuse) {
        res.status(403).send(error.message ?? "Accès refusé");
    } else if (error instanceof ErreurServeur) {
        res.status(500).send(error.message ?? "Erreur serveur inconnue.");
    } else if (error instanceof ErreurBase) {
        res.status(500).send((error.name ?? "Erreur inconnue") + " : " + error.message);
    } else {
        console.error(error);
        res.status(500).send("Erreur serveur inconnue.");
    }
}