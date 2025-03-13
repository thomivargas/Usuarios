import { pool } from '../config/database'
import logger from '../utils/logger';

interface Usuario {
  name: string,
  last_name: string,
  email: string,
  password: string
}

// Registrar usuario
export const registrarUsuario = async (usuario: Usuario) => {
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario.name, usuario.last_name, usuario.email, usuario.password]
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
export const validarToken = async (email: any) => {
  try {
    const result = await pool.query('UPDATE usuarios SET email_validacion = $1 WHERE email = $2', [true, email])
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error(`🔴 MODAL - Error al validar token en bd - ${error}`);
    throw new Error('Error al validar token en bd');
  }
};

// Guardar Token en la BD
export const guardarToken = async (token: string, id: number) => {
  try {
    const result = await pool.query('INSERT INTO tokens (id_usuarios, token_usuarios) VALUES ($1, $2) RETURNING *', [id, token])
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error(`🔴 MODAL - Error al guardar token en bd - ${error}`);
    throw new Error(`Error al guardar token en bd - ${error}`);
  }
};

export const guardarTokenRestablecer = async (token:string, id: number) => {
  try {
    const result = await pool.query('UPDATE tokens SET token_restablecer_usuarios = $1 WHERE id_usuarios = $2', [token, id])
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error(`🔴 MODAL - Error al guardar token en bd - ${error}`);
    throw new Error(`Error al guardar token en bd - ${error}`);
  }
}

export const verificarRefreshTokenEnBD = async (token: string) => {
  try {
    const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [token])
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error(`🔴 MODAL - Error al verificar token en bd - ${error}`);
    throw new Error(`Error al verificar token en bd - ${error}`);
  }
};

export const actualizarPassword = async (email: string, password: string) => {
  try {
    const result = await pool.query('UPDATE usuarios SET password = $2 WHERE email = $1', [email, password])
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error(`🔴 MODAL - Error al actualizar password - ${error}`);
    throw new Error(`Error al actualizar password - ${error}`);
  }
}

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    return result.rows;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al obtener usuarios - ${err}`)
  }
};

export const deleteUser = async (id: string) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id_usuarios = $1 RETURNING *', [id]);
    return result.rows.length ? result.rows[0] : null;
  } catch (err) {
    logger.error(`🔴 MODAL - Error al eliminar usuario - ${err}`);
  }
};