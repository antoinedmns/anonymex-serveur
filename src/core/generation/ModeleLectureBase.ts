/** Element du layout (zone de lecture) */
export interface LayoutPosition {
    x: number;
    y: number;
    largeur: number;
    hauteur: number;
}

/**
 * Modèle d'un document de lecture, contenant des zones de lecture.
 */
export abstract class ModeleLectureBase {

    abstract getNom(): string;
    abstract getFormat(): 'A4' | 'A5';

    /**
     * Positions des éléments de lecture dans le layout. En points PDF.
     * @return Dictionnaire des positions, par identifiant/nom
     */
    abstract getZonesLecture(): Record<string, LayoutPosition | LayoutPosition[]>;

}