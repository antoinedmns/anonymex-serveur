import { Router } from "express";
import { useRest } from "../../../useRest";
import { postUploadDepot } from "./postUploadDepot";

const depotRouter = Router({ mergeParams: true });

// POST /sessions/:session/epreuves/:code/depot/:depot/upload
depotRouter.post<{ session: string, code: string, depot: string }>("/:depot/progression", (req, res) =>
    useRest(() => postUploadDepot(req.params.session, req.params.code, req.body.fichiers), req, res));

export { depotRouter };