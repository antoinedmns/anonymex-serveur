import { Router } from "express";
import { useRest } from "../useRest";
import { getRole } from "./getRole";
import { getRoles } from "./getRoles";
import { deleteRole } from "./deleteRole";
import { postRole } from "./postRole";


const rolesRouteur = Router();

// GET /roles/:id/
rolesRouteur.get("/:id", (req, res) => useRest(() => getRole(req.params.id), req, res));
// GET /roles/
rolesRouteur.get("/", (req, res) => useRest(getRoles, req, res));
// DELETE /roles/:id/
rolesRouteur.delete("/:id", (req, res) => useRest(() => deleteRole(req.params.id), req, res));
// POST /roles/
rolesRouteur.post("/", (req, res) => useRest(() => postRole(req.body), req, res));

export { rolesRouteur as rolesRouteur };