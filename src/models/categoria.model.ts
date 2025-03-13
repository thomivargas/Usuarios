import { pool } from '../config/database'
import logger from '../utils/logger';

// Crear Categoria
export const crearCategoria = async (nombre: string) => {
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    logger.info(`🟢 Categoria creada correctamente ${JSON.stringify({ id: result.rows[0].id, nombre: result.rows[0].nombre })}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`🔴 MODAL - Error al insertar categoria - ${err}`)
    throw new Error(`Error al insertar categoria - ${err}`);
  }
};

// Saber si el usuario es administrador
export const rolUsuario = async (email: string) => {
  try {
    const result = await pool.query('SELECT rol_admin FROM usuarios WHERE email = $1', [email]);
    return result.rows[0].rol_admin;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener rol de usuario - ${err}`)
    throw new Error(`Error al obtener rol de usuario - ${err}`);
  }
};

// Obtener todas las categorias
export const getCategorias = async () => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    return result.rows;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener categorias - ${err}`)
    throw new Error(`Error al obtener categorias - ${err}`);
  }
};

// Editar una categoria
export const editarCategoria = async (id:string, nombre: string) => {
  try {
    const result = await pool.query('UPDATE categorias SET nombre = $2 WHERE id_categoria = $1', [id, nombre]);
    return result.rows;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al editar categoria - ${err}`)
    throw new Error(`Error al editar categoria - ${err}`);
  }
};

// Eliminar Categoria
export const deleteCategoria = async (id: string) => {
  try {
    const result = await pool.query('DELETE FROM categorias WHERE id_categoria = $1 RETURNING *', [id]);
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al eliminar categoria - ${err}`);
    throw new Error(`Error al eliminar categoria - ${err}`);
  }
};