import { ElementEnCache } from "./ElementEnCacheBase";

type ChampType =
    | "int16"
    | "uint16"
    | "uint64"
    | "string";

interface Champ<T extends ElementEnCache> {
    nom: keyof T, // clé/prop de l'instance à sérialiser
    type: ChampType,
}

type Schema<T extends ElementEnCache> = Champ<T>[];

/**
 * Sérialise et désérialise les éléments en cache pour les sauvegardes au format binaire (`.anonymex`).
 * @template T Type de l'élément en cache à sérialiser/désérialiser
 */
export class Serialiseur<T extends ElementEnCache> {
    private schema: Schema<T>;

    /**
     * @param schema Schéma de sérialisation de l'élément en cache
     */
    constructor(schema: Schema<T>) {
        this.schema = schema;
    }

    /**
     * Sérialiser une instance de l'élément en cache en format binaire.
     * @param instance Instance de l'élément en cache à sérialiser
     * @returns Buffer contenant les données sérialisées
     */
    public serialize(instance: T): Buffer {
        const bufferArray: Buffer[] = [];

        for (const champ of this.schema) {
            // pour chaque champ
            const valeur = instance[champ.nom];
            let champBuffer: Buffer;

            switch (champ.type) {
                case "int16": {
                    champBuffer = Buffer.allocUnsafe(2);
                    champBuffer.writeInt16BE(valeur as unknown as number);
                    break;
                }
                case "uint16": {
                    champBuffer = Buffer.allocUnsafe(2);
                    champBuffer.writeUInt16BE(valeur as unknown as number);
                    break;
                }
                case "uint64": {
                    champBuffer = Buffer.allocUnsafe(8);
                    // caster en bigint pour éviter approx. ou débordement
                    const bigVal = BigInt(valeur as unknown as number);
                    champBuffer.writeBigUInt64BE(bigVal);
                    break;
                }
                case "string": {
                    // écrire la longueur de la str (sur 2 octets) + la str en utf-8
                    const strVal = valeur as unknown as string;
                    const strBuffer = Buffer.from(strVal, 'utf-8');
                    const lengthBuffer = Buffer.allocUnsafe(2);
                    lengthBuffer.writeUInt16BE(strBuffer.length);
                    champBuffer = Buffer.concat([lengthBuffer, strBuffer]);
                    break;
                }
                default:
                    throw new Error(`Type de champ inconnu pour la sérialisation : ${(champ.type)}`);
            }

            bufferArray.push(champBuffer);
        }

        return Buffer.concat(bufferArray);
    }

    /**
     * Désérialiser un buffer en un schema d'instance de l'élément en cache.
     * @param buffer Buffer contenant les données sérialisées
     * @returns SCHEMA de l'instance désérialisée
     */
    public deserialize(buffer: Buffer): { [K in keyof T]: T[K] } {
        const instance: Partial<T> = {};
        let offset = 0;

        for (const champ of this.schema) {
            let valeur: T[keyof T];

            switch (champ.type) {
                case "int16":
                    valeur = buffer.readInt16BE(offset) as unknown as T[keyof T];
                    offset += 2;
                    break;
                case "uint16":
                    valeur = buffer.readUInt16BE(offset) as unknown as T[keyof T];
                    offset += 2;
                    break;
                case "uint64":
                    valeur = buffer.readBigUInt64BE(offset) as unknown as T[keyof T];
                    offset += 8;
                    break;
                case "string": {
                    const length = buffer.readUInt16BE(offset);
                    offset += 2;
                    valeur = buffer.toString('utf-8', offset, offset + length) as unknown as T[keyof T];
                    offset += length;
                    break;
                }
                default:
                    throw new Error(`Type de champ inconnu pour la désérialisation : ${(champ.type)}`);
            }

            instance[champ.nom] = valeur;
        }

        return instance as { [K in keyof T]: T[K] };
    }
}