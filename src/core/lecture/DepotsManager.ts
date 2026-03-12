import { Fichier } from "../../routes/useFile";
import { CallbackLecture, lireBordereaux } from "./lireBordereaux";

interface Depot {
    codeEpreuve: string;
    fichiers: Fichier[];
    /** Fonction apelée lors de la lecture du dépot, transférant les informations de lecture. */
    callback: CallbackLecture;
}

/**
 * Gère et coordonne les dépôts (documents à lire).
 */
export class DepotsManager {
    /** La file d'attente des dépôts. */
    private static depotQueue: Depot[] = [];

    /**
     * Commence la lecture d'un dépôt, ou l'ajoute en file d'attente si une lecture est déjà en cours.
     * @param depot 
     * @returns 
     */
    public static processDepot(depot: Depot): void {
        if (this.depotQueue.length === 0) {
            this.lectureDepot(depot);
        } else {
            this.depotQueue.push(depot);
        }
    }

    /**
     * Lit un dépôt, et une fois terminé, passe au dépôt suivant dans la file d'attente.
     * @param depot 
     */
    private static async lectureDepot(depot: Depot): Promise<void> {
        try {
            await lireBordereaux(depot.fichiers, depot.callback);
        } catch (error) {
            depot.callback('error', -1, error instanceof Error ? { message: error.message } : { message: 'Inconnu' });
        }
    }
}