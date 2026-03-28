import PDFDocument from 'pdfkit';
import { logInfo } from '../../../utils/logger';
import { Response } from 'express';
import { genererEnteteLogos } from '../common/genererEnteteLogos';

export async function genererBordereau(res: Response): Promise<boolean> {

    logInfo('genererBordereau', 'Génération d\'un bordereau..');
    //const debutMs = Date.now();

    const doc = new PDFDocument({
        size: 'A4',
        autoFirstPage: false,
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    doc.pipe(res);

    await genererPageBordereau(doc);

    doc.end();

    return true;
}

async function genererPageBordereau(doc: typeof PDFDocument): Promise<void> {
    doc.addPage();
    await genererEnteteLogos(doc);
}