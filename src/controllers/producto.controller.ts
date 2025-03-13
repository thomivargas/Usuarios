import { Request, Response } from 'express';
import logger from '../utils/logger';
import * as Productos from '../models/producto.model';
import { subirImagen } from '../utils/cloudinary'; // Importa la función de Cloudinary
import fs from 'fs-extra'; // Para eliminar la imagen temporal después de subirla

export const create = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, categoria, cantidad, tipo_movimiento } = req.body;
  try {
    // Validar campos requeridos
    if (!nombre || !descripcion || !precio) {
      return res.status(404).json({ error: 'Falta completar un campo requerido' });
    }

    // Subir imagen a Cloudinary
    let imagen_url = '';
    if (req.file) { // Si se envía un archivo
      const filePath = req.file.path; // Ruta temporal del archivo
      imagen_url = await subirImagen(filePath); // Sube la imagen y obtiene la URL
      await fs.unlink(filePath); // Elimina el archivo local temporal
    }  

    // Crear Producto
    const producto = await Productos.crear({nombre, descripcion, precio, imagen_url});

    // Agregar categoria al producto
    await Productos.tipo(nombre, categoria);

    // Agregar stock al producto
    await Productos.stock(nombre, cantidad, tipo_movimiento);

    res.status(200).json({ok: true, producto});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al crear producto - ${err}`);
    res.status(500).json({ ok: false, error: `Error al crear producto - ${err}` });
  }
};

// Leer todos los productos
export const index = async (req: Request, res: Response) => {
  try {
    const productos = await Productos.index();
    res.status(200).json({productos});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al obtener productos - ${err}`);
    res.status(500).json({ ok: false, error: `Error al obtener productos - ${err}` });
  }
};

// Obtener un solo Producto
export const leerByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const producto = await Productos.getProductoByID(id);
    res.status(200).json({producto});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al obtener productos - ${err}`);
    res.status(500).json({ ok: false, error: `Error al obtener productos - ${err}` });
  }
};

export const update = async (req: Request, res: Response) => {
  const campos = req.body;
  const { id } = req.params;
  try {

    // Validar que haya al menos un campo a actualizar
    if (Object.keys(campos).length === 0) {
      return res
        .status(400)
        .json({ ok: false, error: "Debe proporcionar al menos un campo para actualizar" });
    }
    const productoActualizado = await Productos.editarProducto(id, campos);

    // Validar si el producto fue encontrado
    if (!productoActualizado) return res.status(404).json({ ok: false, error: "Producto no encontrado" });
    
    return res.status(200).json({ok:true, productoActualizado});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al editar producto - ${err}`);
    res.status(500).json({ ok: false, error: `Error al editar producto - ${err}` });
  }
};

export const destroy = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Productos.deleteProducto(id);
    return res.status(200).json({ok: true});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al eliminar producto - ${err}`);
    res.status(500).json({ ok: false, error: `Error al eliminar producto - ${err}` });
  }
};