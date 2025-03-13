import jwt from 'jsonwebtoken'
import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export const verificarToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];;
    if(!token) return res.status(401).json({error: 'Token requerido'});
    try {
        const datos: any = jwt.verify(token, process.env.JWT_SECRET!)
        req.datos = datos;
        next();
    } catch (err) {
        logger.error(`🔴 JWT - Token no valido - ${err}`);
        return res.status(401).json({ error: "Token no valido"});
    }
};