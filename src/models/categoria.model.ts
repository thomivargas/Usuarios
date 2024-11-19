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
    throw new Error('Error al insertar categoria');
  }
};

// Obtener todas las categorias
export const getCategorias = async () => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    return result.rows;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener usuarios - ${err}`)
  }
};

export const putUser = async (id: string, userData: { email?: string; username?: string; password?: string }) => {
  try {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No se proporcionaron datos para actualizar.');
    }

    // Agregamos el ID al final de los valores
    values.push(id);

    const query = `
      UPDATE usuarios
      SET ${fields.join(', ')}
      WHERE id_usuarios = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener usuarios - ${err}`);
  }
}

export const deleteUser = async (id: string) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id_usuarios = $1 RETURNING *', [id]);
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al eliminar usuario - ${err}`);
  }
};