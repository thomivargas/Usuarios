import { NextFunction, Response } from "express";
import { rolUsuario } from "../models/categoria.model";


export const verificarAdmin = async (req: any, res: Response, next: NextFunction) => {
    const datos = req.datos;
    const rol = await rolUsuario(datos.email);
    if (!rol) return res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
    next();
};