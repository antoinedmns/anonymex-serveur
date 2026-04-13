import PDFDocument from 'pdfkit';
import { Epreuve } from '../../../cache/epreuves/Epreuve';
import dayjs from 'dayjs';
import { CODES_SUPPLEMENTAIRES_PAR_PLANCHE } from './renduPlancheCodesSupplementaires';

/**
 * Génère une feuille de séparation pour une salle d'un examen.
 * Crée une page.
 */
export async function renduFeuilleSalle(doc: typeof PDFDocument, epreuve: Epreuve, nbConvocs: number, nbSupplementaires: number, codeSalle: string): Promise<void> {

    doc.addPage();
    doc.fillColor('#222');

    // Triangle dans le coin supérieur droit
    const triangleSize = 40;
    doc.moveTo(doc.page.width - triangleSize, 0)
        .lineTo(doc.page.width, 0)
        .lineTo(doc.page.width, triangleSize)
        .fill('#222');

    const dateEpreuve = dayjs.unix(epreuve.dateEpreuve).locale('fr');
    const heureFin = dayjs.unix(epreuve.dateEpreuve + epreuve.duree * 60).format('HH:mm');

    // Page d'identification de la salle
    doc.fontSize(21).text(`${epreuve.codeEpreuve} : ${epreuve.nom}`, 20, 80, { align: 'center', width: doc.page.width - 40, height: 24, ellipsis: true });
    doc.fontSize(16).text(dateEpreuve.format('D MMMM YYYY [de] HH:mm') + ' à ' + heureFin, 20, 115, { align: 'center', width: doc.page.width - 40 });

    // Ligne
    doc.moveTo(20, 200).lineTo(doc.page.width - 20, 200).stroke();

    // Nom de la salle
    doc.font('Helvetica-Bold').fontSize(80).text(codeSalle, 20, doc.page.height / 2 - 20, { align: 'center', width: doc.page.width - 40 });

    // ligne + nb Pages (nb. de convocs )
    doc.moveTo(20, doc.page.height - 200).lineTo(doc.page.width - 20, doc.page.height - 200).stroke();
    const nbPages = nbConvocs + (nbSupplementaires > 0 ? nbSupplementaires + Math.ceil(nbSupplementaires / CODES_SUPPLEMENTAIRES_PAR_PLANCHE) : 0);
    doc.font('Helvetica-Bold').fontSize(18).text(`${nbConvocs} étudiant${nbConvocs > 1 ? 's' : ''}`, 20, doc.page.height - 150, { align: 'center', width: doc.page.width - 40 });
    doc.font('Helvetica').fontSize(16).text(`${nbSupplementaires} convocation${nbSupplementaires > 1 ? 's' : ''} supplémentaire${nbSupplementaires > 1 ? 's' : ''}`, 20, doc.page.height - 125, { align: 'center', width: doc.page.width - 40 });

    doc.font('Helvetica').fontSize(16).text(`${nbPages} page${nbPages > 1 ? 's' : ''}`, 20, doc.page.height - 80, { align: 'center', width: doc.page.width - 40 });

}