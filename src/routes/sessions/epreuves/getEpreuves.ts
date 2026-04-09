import { APIEpreuve, APIListEpreuves, EpreuveStatut } from "../../../contracts/epreuves";
import { sessionCache } from "../../../cache/sessions/SessionCache";
import { ErreurRequeteInvalide } from "../../erreursApi";
import { Epreuve } from "../../../cache/epreuves/Epreuve";
import { Database } from "../../../core/services/database/Database";
import { logInfo, styles } from "../../../utils/logger";

export async function getEpreuves(sessionId: string): Promise<APIListEpreuves> {
    const idSession = parseInt(sessionId ?? '');

    if (isNaN(idSession) || sessionId === undefined) {
        throw new ErreurRequeteInvalide("L'ID de session n'est pas valide.");
    }

    const session = await sessionCache.getOrFetch(idSession);

    if (session === undefined) {
        throw new ErreurRequeteInvalide("La session demandée n'existe pas.");
    }

    const epreuvesBrutes = await session.epreuves.getAll();

    if (epreuvesBrutes === undefined) {
        throw new ErreurRequeteInvalide("Impossible de récupérer les épreuves de la session demandée.");
    }

    const now = Date.now();
    const epreuvesAvenir: APIEpreuve[] = [];
    const epreuvesPassees: APIEpreuve[] = [];

    // Liste des épreuves dont le statut à été mis à jour,
    // Afin de refléter les changements dans la base de données
    const epereuvesChangees: Epreuve[] = [];

    for (const epreuve of epreuvesBrutes) {
        const epreuveFormatee = epreuve.toJSON();

        if (epreuve.dateEpreuve >= now) {
            epreuvesAvenir.push(epreuveFormatee);
        } else {
            // l'épreuve est passée, mettre à jour le statut si besoin
            if (epreuve.statut === EpreuveStatut.MATERIEL_IMPRIME || epreuve.statut === EpreuveStatut.MATERIEL_NON_IMPRIME) {
                await epreuve.changerStatut(EpreuveStatut.SAISIE_PRESENCE);
                epreuveFormatee.statut = EpreuveStatut.SAISIE_PRESENCE;
                epereuvesChangees.push(epreuve);
            }

            epreuvesPassees.push(epreuveFormatee);
        }
    }

    // Sauvegarder les changements de statut dans la base de données
    if (epereuvesChangees.length > 0) {
        const transaction = await Database.creerTransaction();
        try {
            // Update chaque épreuve
            // TODO: requete en batch (optimisation)?
            for (const epreuve of epereuvesChangees) {
                await transaction.query('UPDATE epreuve SET statut = ? WHERE id_session = ? AND code_epreuve = ?', [epreuve.statut, epreuve.idSession, epreuve.codeEpreuve]);
            }
            await transaction.commit();
        } catch (error) {
            // Erreur lors de la mise à jour, rollback et throw
            await transaction.rollback();
            throw error;
        }

        logInfo('Epreuves', 'Status mis à jour pour ' + styles.fg.cyan + epereuvesChangees.length + styles.fg.white + ' épreuves passées.');
    }

    epreuvesAvenir.sort()

    return {
        epreuvesAvenir: epreuvesAvenir.sort((a, b) => a.date - b.date),
        epreuvesPassees: epreuvesPassees.sort((a, b) => b.date - a.date)
    };
}