import PDFDocument from "pdfkit";
import { Epreuve } from "../../../cache/epreuves/Epreuve";
import dayjs from "dayjs";
import { Convocation } from "../../../cache/epreuves/convocations/Convocation";

export const CODES_SUPPLEMENTAIRES_PAR_PLANCHE = 20;

interface ColonneTableau { titre: string, largeurPourcent: number }

const COLONNES_TABLEAU = [
    { titre: 'Code', largeurPourcent: 16 },
    { titre: 'Nom', largeurPourcent: 28 },
    { titre: 'Prénom', largeurPourcent: 28 },
    { titre: 'N° étudiant', largeurPourcent: 28 },
] as [ColonneTableau, ColonneTableau, ColonneTableau, ColonneTableau];


export function renduPlancheCodesSupplementaires(doc: typeof PDFDocument, epreuve: Epreuve, salle: string, convocsSupplementaires: Convocation[]): void {

    // Nb. de pages nécessaires
    const totalPages = Math.ceil(convocsSupplementaires.length / CODES_SUPPLEMENTAIRES_PAR_PLANCHE);

    // On divise les convocs en groupe de CODES_SUPPLEMENTAIRES_PAR_PLANCHE
    for (let i = 0; i < convocsSupplementaires.length; i += CODES_SUPPLEMENTAIRES_PAR_PLANCHE) {
        const codesPage = convocsSupplementaires.slice(i, i + CODES_SUPPLEMENTAIRES_PAR_PLANCHE);
        renduPlanche(doc, salle, epreuve, codesPage);

        // Numéroter la page
        const pageNum = Math.floor(i / CODES_SUPPLEMENTAIRES_PAR_PLANCHE) + 1;
        doc.font('Helvetica').fontSize(12).text(`Page ${pageNum} / ${totalPages}`, 20, doc.page.height - 40, { align: 'center', width: doc.page.width - 40 });
    }

}

function renduPlanche(doc: typeof PDFDocument, salle: string, epreuve: Epreuve, convocs: Convocation[]): void {
    doc.addPage();

    const marges = { gauche: 30, droite: 30 };

    // ENTÊTE DOCUMENT
    const titresY = 50;

    {

        // Titre (centré)
        doc.font('Helvetica-Bold');
        const titreTexte = "CODES SUPPLÉMENTAIRES";
        const titreLargeur = doc.widthOfString(titreTexte, { lineBreak: false });
        doc.text(titreTexte, (doc.page.width - titreLargeur) / 2, titresY - 3, { baseline: 'middle' });

        // Infos épreuve (centré, sous le titre)
        doc.font('Helvetica');
        doc.fontSize(13);
        const nomEpreuve = epreuve.nom[0] !== undefined ? epreuve.nom[0].toUpperCase() + epreuve.nom.slice(1).toLowerCase() : 'Épreuve';
        const infosTexte = `${epreuve.codeEpreuve} - ${nomEpreuve}`;
        const infosLargeur = doc.widthOfString(infosTexte, { lineBreak: false });
        doc.text(infosTexte, (doc.page.width - infosLargeur) / 2, titresY + 19, { baseline: 'middle' });

        // Date, heure, salle
        const dateDayjs = dayjs(epreuve.dateEpreuve * 1000);
        const dateLisible = dateDayjs.format('DD/MM/YYYY');
        const heureLisible = dateDayjs.format('HH') + 'h' + dateDayjs.format('mm');
        const dateTexte = `${dateLisible} - ${heureLisible} - ${salle}`;
        const dateLargeur = doc.widthOfString(dateTexte, { lineBreak: false });
        doc.text(dateTexte, (doc.page.width - dateLargeur) / 2, titresY + 38, { baseline: 'middle' });

    }

    // Constantes tableau
    const margeInterneCellulePt = 6;
    const largeurTableau = doc.page.width - marges.gauche - marges.droite;
    const hauteurEnteteTableau = 25;
    const hauteurLigneTableau = 32;
    const yTableau = 120;

    // ENTÊTE DE TABLEAU
    {
        let xCourant = marges.gauche;

        doc.font('Helvetica-Bold').fontSize(hauteurEnteteTableau * 0.5);
        const yTexte = yTableau + (hauteurEnteteTableau - doc.currentLineHeight()) / 2 + 1.3;

        // Fond
        doc.rect(marges.gauche, yTableau, largeurTableau, hauteurEnteteTableau).fill('#e9e9e9').fillColor('#000000');

        // Ligne du haut
        doc.moveTo(marges.gauche, yTableau)
            .lineTo(marges.gauche + largeurTableau, yTableau)
            .strokeColor('#000000').lineWidth(0.5).stroke();

        // Rendu des titres de colonnes
        for (const [i, col] of COLONNES_TABLEAU.entries()) {
            const tailleColonne = (col.largeurPourcent / 100) * largeurTableau;
            doc.text(col.titre, xCourant + margeInterneCellulePt, yTexte, {
                width: tailleColonne - 2 * margeInterneCellulePt,
                align: i >= 4 ? 'center' : 'left',
                lineBreak: false,
                ellipsis: true
            });
            xCourant += tailleColonne;
        }

    }

    // LIGNES DU TABLEAU (= convocations supplémentaires)
    {
        for (let i = 0; i < convocs.length; i++) {

            const y = yTableau + hauteurEnteteTableau + i * hauteurLigneTableau;

            // Fill une ligne sur deux
            if (i % 2 === 1) {
                doc.rect(marges.gauche, y, largeurTableau, hauteurLigneTableau).fill('#F5F5F5').fillColor('#000000');
            }

            // Rendu LIGNE horizontale (dessous)
            doc.moveTo(marges.gauche, y)
                .lineTo(marges.gauche + largeurTableau, y)
                .strokeColor('#000000').lineWidth(0.5).stroke();

            // Code anonymat
            doc.font('Helvetica-Bold').fontSize(hauteurLigneTableau * 0.4);
            const yTexte = y + (hauteurLigneTableau - doc.currentLineHeight()) / 2 + 1.3;
            doc.text(convocs[i]?.codeAnonymat ?? 'ERREUR', marges.gauche + margeInterneCellulePt, yTexte, {
                lineBreak: false
            });

        }
    }

    // CONTOURS TABLEAU
    {
        let xCourant = marges.gauche;
        for (let i = 0; i <= COLONNES_TABLEAU.length; i++) {
            const col = COLONNES_TABLEAU[i];
            const colLargeur = col ? (col.largeurPourcent / 100) * largeurTableau : 0; // 0 pour la dernière ligne verticale, égale à la largeur totale + 0%

            const xPos = xCourant;
            const yFin = yTableau + hauteurEnteteTableau + convocs.length * hauteurLigneTableau;

            doc.moveTo(xPos, yTableau)
                .lineTo(xPos, yFin)
                .strokeColor('#000000')
                .lineWidth(0.5)
                .stroke();

            xCourant += colLargeur;
        }
    }

    // LIGNE FINALE
    const yFin = yTableau + hauteurEnteteTableau + convocs.length * hauteurLigneTableau;
    doc.moveTo(marges.gauche, yFin)
        .lineTo(marges.gauche + largeurTableau, yFin)
        .strokeColor('#000000')
        .lineWidth(0.5)
        .stroke();

}