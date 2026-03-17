import { Router } from "express";
import { useFullRest, useRest } from "../../../useRest";
import { postUploadDepot } from "./postUploadDepot";
import { getDepotProgression } from "./getDepotProgression";

const depotRouter = Router({ mergeParams: true });

// POST /sessions/:session/epreuves/:code/depot/
depotRouter.post<{ session: string, code: string }>
    ("/", (req, res) =>
        useRest(() => postUploadDepot(req.params.session, req.params.code, req.body.fichiers), req, res));

// GET /sessions/:session/epreuves/:code/depot/:depot/progress (Server-Sent Events)
depotRouter.get<{ session: string, code: string, depot: string }>
    ("/:depot/progress", (req, res) =>
        useFullRest(() => getDepotProgression(req, res), req, res));

export { depotRouter };