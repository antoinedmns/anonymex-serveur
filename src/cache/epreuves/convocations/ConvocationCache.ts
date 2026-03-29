import { ResultSetHeader } from "mysql2";
import { DatabaseCacheBase } from "../../base/DatabaseCacheBase";
import { Convocation, ConvocationData } from "./Convocation";

export class ConvocationCache extends DatabaseCacheBase<string /*codeAnonymat*/, Convocation, ConvocationData> {

    nomTable = "convocation";
    colonnesClePrimaire: string[] = ["id_session", "code_epreuve", "code_anonymat"];

    /** Cache des convocations supplémentaires */
    convocationsSupplementaires = new Map<string, Convocation>();

    /** Map des salles, avec le nb. de convocations dans chaque salle */
    effectifsSalle = new Map<string, number>();

    /** Liste de toutes les salles concernées */
    salles = new Set<string>();

    /**
     * Instancier un cache pour les convocations d'une épreuve donnée.
     * @param idSession
     * @param idEpreuve
     */
    constructor(idSession: number, idEpreuve: string) {
        super([idSession, idEpreuve]);
    }

    /**
     * Processer une convocation, pour la trier et la classer
     * @param convoc 
     */
    private processConvoc(convoc: Convocation): void {
        if (convoc.codeAnonymat[0] === "Z") {
            // Convo supplémentaire : la mettre dans la liste dédiée et ne pas la renvoyer dans le cache principal
            this.convocationsSupplementaires.set(convoc.codeAnonymat, convoc);

            // Si aucun étudiant associé, alors ce n'est PAS une convo normale, on suppr du cache
            if (convoc.numeroEtudiant === null) this.delete(convoc.codeAnonymat);
        }

        if (convoc.numeroEtudiant !== null) {
            // Convo normale : compter le nombre de convocations par salle
            const nbConvocsSalle = this.effectifsSalle.get(convoc.codeSalle) ?? 0;
            this.effectifsSalle.set(convoc.codeSalle, nbConvocsSalle + 1);
            this.salles.add(convoc.codeSalle);
        }
    }

    override async getAll(clause?: string, force?: boolean): Promise<Convocation[]> {
        const convocs = await super.getAll(clause, force);

        for (const convoc of convocs) {
            this.processConvoc(convoc);
        }

        return this.values();
    }

    override clear(): void {
        super.clear();
        this.convocationsSupplementaires.clear();
        this.effectifsSalle.clear();
        this.salles.clear();
    }

    override set(id: string, value: Convocation): void {
        super.set(id, value);
        this.processConvoc(value);
    }

    override delete(id: string): Promise<ResultSetHeader> {
        const convoc = this.get(id);
        if (convoc) {
            // Si la convocation supprimée est une convocation normale, décrémenter le nombre de convocations dans la salle
            if (convoc.numeroEtudiant !== null) {
                const nbConvocsSalle = this.effectifsSalle.get(convoc.codeSalle) ?? 0;
                if (nbConvocsSalle > 0) this.effectifsSalle.set(convoc.codeSalle, nbConvocsSalle - 1);
            }

            // Si la convocation supprimée est une convocation supplémentaire, la retirer de la liste dédiée
            if (convoc.codeAnonymat[0] === "Z") {
                this.convocationsSupplementaires.delete(convoc.codeAnonymat);
            }

            // Retirer la salle de la liste si elle n'a plus de convocations
            if (this.effectifsSalle.get(convoc.codeSalle) === 0) {
                this.salles.delete(convoc.codeSalle);
            }
        }

        return super.delete(id);
    }

    override async insert(donnees: Partial<ConvocationData>, element?: Convocation): Promise<ResultSetHeader> {
        const result = await super.insert(donnees, element);

        if (element) {
            this.processConvoc(element);
        }

        return result;
    }

    override async update(id: string, donnees: Partial<ConvocationData>): Promise<ResultSetHeader> {
        const result = await super.update(id, donnees);

        const convoc = this.get(id);
        if (convoc) {
            // Mettre à jour les propriétés de la convocation en cache
            Object.assign(convoc, donnees);
            this.processConvoc(convoc);
        }

        return result;
    }

    fromDatabase(data: ConvocationData): Convocation {
        return new Convocation(data);
    }

    getComposanteCache(element: Convocation): string {
        return element.codeAnonymat;
    }

}