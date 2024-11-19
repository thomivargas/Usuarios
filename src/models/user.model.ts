import { pool } from '../config/database'
import logger from '../utils/logger';

interface Usuario {
  username: string,
  email: string,
  password: string
}

// Registrar usuario
export const registrarUsuario = async (usuario: Usuario) => {
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [usuario.username, usuario.email, usuario.password]
    );
    logger.info(`🟢 Usuario creado correctamente ${JSON.stringify({ id: result.rows[0].id, email: result.rows[0].email })}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`🔴 MODAL - Error al insertar usuario - ${err}`)
    throw new Error('Error al insertar el usuario');
  }
};

// Encontrar email para saber si un usuario ya tiene ese email
export const buscarUsuarioPorEmail = async (email: string) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al comparar email de usuario - ${err}`);
    throw new Error('Error al encontrar email');
  }
};

// Validar Token
export const validarToken = async () => {
  try {
    const result = await pool.query('UPDATE usuarios SET email_validacion = $1', [true])
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error(`🔴 MODAL - Error al validar token en bd - ${error}`);
    throw new Error('Error al validar token en bd');
  }
};

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
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