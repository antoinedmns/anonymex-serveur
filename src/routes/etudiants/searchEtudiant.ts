import { APIEtudiant } from "../../contracts/etudiants";
import { Database } from "../../core/services/database/Database";
import { ErreurRequeteInvalide } from "../erreursApi";

export async function searchEtudiant(query: string)