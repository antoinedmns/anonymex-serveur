import sharp from "sharp";
import { MediaService } from "../core/services/MediaService";

interface ImageImporte {
    buffer: Buffer;
    width: number;
    height: number;
}

/**
 * Cache contenant des images importées (e.g: logo université), transformées 
 * et modifiées pour être utilisées facilement (dans les PDFs notamment).
 */
export class ImagesImportsCache {
    private static cache = new Map<string, ImageImporte | null>();

    /** Réduit une image à une taille maximale (sans la déformer) */
    private static reduireTransfn(a: sharp.Sharp, maxw: number, maxh: number): sharp.Sharp {
        return a.resize({ width: maxw, height: maxh, fit: "inside", withoutEnlargement: true });
    }

    /** Transforme en noir et blanc */
    private static noirEtBlancTransfn(a: sharp.Sharp, couleurNoir = "#000000"): sharp.Sharp {
        return a
            .grayscale()
            .toColourspace("b-w")
            .tint(couleurNoir);
    }

    /**
     * Renvoit les logos de l'université et de la faculté.
     */
    public static async getLogos(force = false) {
        const universite = await this.getImageImporte("logo_universite",
            a => this.noirEtBlancTransfn(this.reduireTransfn(a, 140 * 1.7, 60 * 1.7)), force);
        const faculte = await this.getImageImporte("logo_faculte",
            a => this.noirEtBlancTransfn(this.reduireTransfn(a, 140 * 1.7, 60 * 1.7)), force);

        return { universite, faculte };
    }

    private static async getImageImporte(nom: string, transfn?: (s: sharp.Sharp) => sharp.Sharp, force = false): Promise<ImageImporte | null> {
        let image = this.cache.get(nom);
        if (!image || force) {
            const buffers = await MediaService.lireMedia("imports", nom, transfn).catch(() => null);

            if (buffers === null || buffers[0] === undefined) {
                this.cache.set(nom, null);
                return null;
            }

            const buffer = buffers[0];
            const { width, height } = await sharp(buffer).metadata();

            image = { buffer, width, height };
            this.cache.set(nom, image);

        }
        return image;
    }
}