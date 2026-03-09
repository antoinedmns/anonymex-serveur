import { EtapeLecture } from "./EtapesDeTraitementDicts";

/**
 * Contient les statistiques d'exécution des pipelines de traitement, dont temps d'exécution.
 */
export class StatistiquesDebug {

    private static tempsExecLectureStats = new Map<EtapeLecture, TempsExecStats>();

    /**
     * Ajoute une mesure de temps d'exécution pour une étape de lecture donnée.
     * @param etapeLecture L'étape de lecture
     * @param tempsMs Le temps d'exécution en millisecondes
     */
    public static ajouterTempsExecution(etapeLecture: EtapeLecture, tempsMs: number): void {
        const stats = this.tempsExecLectureStats.get(etapeLecture);
        if (stats === undefined) {
            this.tempsExecLectureStats.set(etapeLecture, new TempsExecStats());
        } else {
            stats.ajouterExecution(tempsMs);
        }
    }

}

class TempsExecStats {
    private tempsTotalMs = 0;
    private nombreExecutions = 0;
    private plusLongueMs = 0;

    ajouterExecution(tempsMs: number): void {
        this.tempsTotalMs += tempsMs;
        this.nombreExecutions += 1;
        if (tempsMs > this.plusLongueMs) {
            this.plusLongueMs = tempsMs;
        }
    }

    obtenirTempsMoyenMs(): number {
        if (this.nombreExecutions === 0) return 0;
        return this.tempsTotalMs / this.nombreExecutions;
    }

    obtenirPlusLongueMs(): number {
        return this.plusLongueMs;
    }

    reset(): void {
        this.tempsTotalMs = 0;
        this.nombreExecutions = 0;
        this.plusLongueMs = 0;
    }
}