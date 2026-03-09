import { APIListIncidents } from "../../../contracts/incidents";

export async function getIncidents(): Promise<APIListIncidents> {

    return ({
        incidents: [
            {
                idIncident: 0,
                titre: "Numéro d'anonymat inconnu",
                details: "Lorem ipsum...",
                resolu: Math.floor(Math.random()) < 0.5
            },
            {
                idIncident: 1,
                titre: "Numéro d'anonymat inconnu",
                details: "Lorem ipsum...",
                resolu: Math.floor(Math.random()) < 0.5
            },
            {
                idIncident: 2,
                titre: "Scan illisible",
                details: "Lorem ipsum...",
                resolu: Math.floor(Math.random()) < 0.5
            },
            {
                idIncident: 3,
                titre: "Scan illisible",
                details: "Lorem ipsum...",
                resolu: Math.floor(Math.random()) < 0.5
            },
        ]
    });
}