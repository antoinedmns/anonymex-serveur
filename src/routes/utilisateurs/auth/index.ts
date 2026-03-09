import { Router } from "express";
import { postLogin } from "./postLogin";
import { useFullRest, useRest } from "../../useRest";
import { getInfo } from "./getInfo";
import { getInvitation } from "./getInvitation";
import { postCreerUtilisateur } from "./postCreerUtilisateur";

const authRouteur = Router();

// POST /utilisateurs/auth/login
authRouteur.post("/login", (req, res) => useFullRest(() => postLogin(req, res), req, res));
// GET /utilisateurs/auth/info
authRouteur.get("/info", (req, res) => useRest(getInfo, req, res));
// POST /utilisateurs/auth/invitation
authRouteur.post("/invitation", (req, res) => useRest(() => getInvitation(req.body), req, res));
// POST /utilisateurs/auth/creer
authRouteur.post("/creer", (req, res) => useFullRest(() => postCreerUtilisateur(req, res), req, res));

export { authRouteur as authRouteur };