import jwt from 'jsonwebtoken'
import logger from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

export const verificarToken = (req: any, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if(!token) return res.status(401).json({error: 'Token no enviado'});
    token = token.split(' ')[1];
    try {
        const datos: any = jwt.verify(token, process.env.JWT_SECRET!)
        req.datos = datos;
        next();
    } catch (err) {
        logger.error(`🔴 JWT - Token no valido - ${err}`);
        return res.status(401).json({ error: "Token no valido"});
    }
};