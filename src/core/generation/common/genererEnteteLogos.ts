import { ImagesImportsCache } from "../../../cache/ImagesImportsCache";

/**
 * Will draw the header with the university and faculty logos on the given PDF document, centered.
 * @param doc 
 * @param height 
 * @param width 
 */
export async function genererEnteteLogos(doc: PDFKit.PDFDocument): Promise<void> {

    const { universite, faculte } = await ImagesImportsCache.getLogos();
    const margeHaut = 30;

    const noLogo = (x: number, y: number, nom: string) => {
        doc.fillColor("#DDD").rect(x, y, 200, 60).fill();
        doc.fillColor("#000").fontSize(13).text(`Aucun visuel pour ${nom}\nimporté via les paramètres (accueil)`, x + 5, y + 5);
    };

    const univTaille = universite ? universite.width : 200;
    const facTaille = faculte ? faculte.width : 200;
    const totalTaille = univTaille + facTaille + 10; // 10pt d'espace entre les deux

    if (universite) {
        const x = (doc.page.width - totalTaille) / 2;
        doc.image(universite.buffer, x, margeHaut, { width: universite.width, height: universite.height });
    } else {
        noLogo((doc.page.width - totalTaille) / 2, margeHaut, "l'université");
    }

    if (faculte) {
        const x = (doc.page.width - totalTaille) / 2 + univTaille + 10; // 10pt d'espace entre les deux
        doc.image(faculte.buffer, x, margeHaut, { width: faculte.width, height: faculte.height });
    } else {
        noLogo((doc.page.width - totalTaille) / 2 + univTaille + 10, margeHaut, "la faculté");
    }

}