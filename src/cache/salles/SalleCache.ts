import { DatabaseCacheBase } from "../base/DatabaseCacheBase";
import { Salle, SalleData } from "./Salle";

export class SalleCache extends DatabaseCacheBase<string /*codeSalle*/, Salle, SalleData> {

    nomTable = "salle";
    colonnesClePrimaire: string[] = ["code_salle"];

    fromDatabase(data: SalleData): Salle {
        return new Salle(data);
    }

    getComposanteCache(element: Salle): string {
        return element.codeSalle;
    }

}

export const salleCache = new SalleCache();