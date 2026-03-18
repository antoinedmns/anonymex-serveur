import { Router } from "express";
import { useRest } from "../../useRest";
import { getIncident } from "./getIncident";
import { getIncidents } from "./getIncidents";

const incidentsRouter = Router({ mergeParams: true });

// GET /sessions/:session/incidents/:id/
incidentsRouter.get<{ session: string, id: string }>("/:id", (req, res) =>
    useRest(() => getIncident(req.params.session, req.params.id), req, res));

// GET /sessions/:session/incidents/
incidentsRouter.get<{ session: string }>("/", (req, res) =>
    useRest(() => getIncidents(req.params.session), req, res));

export { incidentsRouter };