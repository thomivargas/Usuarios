import { Request, Response } from 'express';
import logger from '../utils/logger';

export const create = async (req: Request, res: Response) => {
  try {
    res.status(200).json('users');
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al crear categoria - ${err}`);
    res.status(500).json({ error: 'Error al crear categoria' });
  }
};

// Leer todos los usuarios
export const index = async (req: Request, res: Response) => {
  try {
    //const users = await getUsers();
    res.status(200).json('users');
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al obtener categorias - ${err}`);
    res.status(500).json({ error: 'Error al obtener categorias' });
  }
};