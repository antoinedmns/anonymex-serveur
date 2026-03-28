import { Response } from "express";
import { genererBordereau } from "../../core/generation/bordereau/genererBordereau";

export async function getBordereau(res: Response): Promise<void> {
    // Générer le bordereau
    await genererBordereau(res);
}