/* eslint-disable @typescript-eslint/no-unused-vars */
import { MediaService } from "../../services/MediaService";

/**
 * Will draw the header with the university and faculty logos on the given PDF document, centered.
 * @param doc 
 * @param height 
 * @param width 
 */
export async function genererEnteteLogos(doc: PDFKit.PDFDocument, height: number, width: number): Promise<void> {

    /*const logoUniversite = await MediaService.getCachedMedia("imports", "logo_universite.png", false);
    const logoFaculte = await MediaService.getCachedMedia("imports", "logo_faculte.png", false);

    if (logoUniversite && logoUniversite[0]) {
        doc.image(logoUniversite[0], width / 2 - 150 - 10, height / 2 - 50, { width: 150 });
    }*/

}