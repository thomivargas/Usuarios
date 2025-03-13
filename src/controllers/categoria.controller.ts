import { Request, Response } from 'express';
import logger from '../utils/logger';
import { crearCategoria, deleteCategoria, editarCategoria, getCategorias } from '../models/categoria.model';

export const create = async (req: Request, res: Response) => {
  const { nombre } = req.body;
  try {
    if(!nombre) return res.status(404).json({error: 'No existe el campo nombre'})
    const categoria = await crearCategoria(nombre);
    res.status(200).json({ok: true, mensaje: 'categoria creada', categoria});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al crear categoria - ${err}`);
    res.status(500).json({ ok: true, error: `Error al crear categoria - ${err}` });
  }
};

// Leer todos los usuarios
export const index = async (req: Request, res: Response) => {
  try {
    const categorias = await getCategorias();
    res.status(200).json({categorias});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al obtener categorias - ${err}`);
    res.status(500).json({ error: `Error al obtener categorias - ${err}` });
  }
};

// Editar una categoria
export const update = async (req:Request, res: Response) => {
  const id = req.params.id;
  const { nombre } = req.body;
  try {
    await editarCategoria(id, nombre);
    return res.status(200).json({ok:true});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al editar categoria - ${err}`);
    return res.status(500).json({ error: `Error al editar categoria - ${err}` });
  }
}

// Eliminar Categoria 
export const destroy = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await deleteCategoria(id);
    return res.status(200).json({ok: true});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al eliminar categoria - ${err}`);
    return res.status(500).json({ error: 'Error al eliminar categoria' });
  }
};