import { pool } from '../config/database'
import logger from '../utils/logger';

interface Producto {
    nombre: string,
    descripcion: Text,
    precio: number,
    id_categoria: number
}

// Crear Categoria
export const crearProductos = async (producto: Producto) => {
  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre) VALUES ($1, $2, $3, $4) RETURNING *',
      [producto.nombre, producto.descripcion, producto.precio, producto.id_categoria]
    );
    logger.info(`🟢 Producto creado correctamente ${JSON.stringify({ id: result.rows[0].id, nombre: result.rows[0].nombre })}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`🔴 MODAL - Error al insertar producto - ${err}`)
    throw new Error('Error al insertar producto');
  }
};

// Obtener todas las categorias
export const getCategorias = async () => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    return result.rows;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener productos - ${err}`)
  }
};