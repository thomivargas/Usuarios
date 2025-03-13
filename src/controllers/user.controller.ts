import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import logger from "../utils/logger";
import { enviarCambiarPassword, enviarEmailValidacion } from "../services/email.services";
import { deleteUser, buscarUsuarioPorEmail, getUsers, registrarUsuario, validarToken, guardarToken, verificarRefreshTokenEnBD, guardarTokenRestablecer, actualizarPassword } from '../models/user.model';

// Register
export const register = async (req: Request, res: Response) => {
  const { name, last_name, email, password } = req.body;
  try { 
    const user = await buscarUsuarioPorEmail(email);
    if (user) return res.status(409).json({ok: false, mensaje: 'Email ya registrado'});

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // JsonWebToken
    const token = jwt.sign({ 
      email: email 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' } 
    );  
    if (!token) return res.status(500).json({ok: false, mensaje: 'Token no generado'});    
    //validar Email
    const newUser = await registrarUsuario({name, last_name, email, password: hashedPassword})
    await enviarEmailValidacion(email, token);
    return res.status(201).json({
      ok: true, 
      id: newUser.id_usuarios,
      email: newUser.email, 
      token
    });
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al crear usuario - ${err}`);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const validacion = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ ok: false, mensaje: "Token inválido" });
    }

    // Busca el usuario por el Email
    const user = await buscarUsuarioPorEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    // Validar email solo si coincide el correo
    if (user.email !== decoded.email) {
      return res.status(401).json({ ok: false, mensaje: "Token no coincide con el usuario" });
    }

    await validarToken(decoded.email);
    return res.status(200).redirect('http://localhost:5173/auth/login');
  } catch (err) {
    logger.error("🔴 CONTROLADOR - Error al validar email:", err);
    res.status(401).json({ ok: false, mensaje: "Token inválido o expirado." });
  }
};

export const enviarEmail = async (req: Request, res: Response) => {
  const { email, token } = req.body;
  try {
    console.log(email, token)
    //validar Email
    await enviarEmailValidacion(email, token);
    return res.status(200).json({ok: true}); 
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al enviar nuevo Email - ${err}`);
    return res.status(500).json({ ok: false, mensaje: `Error al enviar nuevo Email - ${err}` });
  }
}

export const reset = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await buscarUsuarioPorEmail(email);
    if (!user) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }
    const name_completo = `${user.name} ${user.last_name}`;
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '30m' });
    await guardarTokenRestablecer(token, user.id_usuarios);

    const enlace = `http://localhost:5173/auth/newpass/${token}/?action=password_reset`;
    await enviarCambiarPassword(email, name_completo, enlace);

    res.status(200).json({ ok: true, mensaje: "Email de restablecimiento enviado" });
  } catch (err) {
    logger.error(`🔴 Error al solicitar restablecer contraseña: ${err}`);
    res.status(500).json({ ok: false, mensaje: "Error al solicitar restablecer contraseña" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ ok: false, mensaje: "Token inválido o expirado" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    await actualizarPassword(decoded.email, hashedPassword);

    res.status(200).json({ ok: true, mensaje: "Contraseña actualizada correctamente" });
  } catch (err) {
    logger.error(`🔴 Error al restablecer contraseña: ${err}`);
    res.status(401).json({ ok: false, mensaje: "Error al restablecer contraseña" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await buscarUsuarioPorEmail(email); 
    if (!user) { 
      logger.error(`Usuario no encontrado: ${user}`);
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    }
      // Comparar la contraseña ingresada con el hash almacenado
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) { 
      return res.status(401).json({ ok: false, mensaje: 'Contraseña incorrecta' })
    };
    if(user.email_validacion == false) {
      return res.status(401).json({ok: false, mensaje: 'cuenta no verificada'})
    }
    // Generar Access Token
    const accessToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' } // 7 dias
    );
    
    // Generar Refresh Token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '90d' }
    );

    await guardarToken(refreshToken, user.id_usuarios);
    res.status(200).json({ ok: true, mensaje: 'Inicio de sesión exitoso', accessToken, refreshToken });
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al logear usuario - ${err}`);
    return res.status(500).json({ ok: false, mensaje: `Error al logear usuario - ${err}` });
  } 
};

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token es requerido' });
  try {
    // Verificar el Refresh Token
    const {email}: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    // Verificar si el token sigue siendo válido en la base de datos
    const isValid = await verificarRefreshTokenEnBD(token);
    if (!isValid) return res.status(403).json({ error: 'Token inválido o expirado' });
    // Generar un nuevo Access Token
    const newAccessToken = jwt.sign(
      { email: email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// Perfil
export const Perfil = async (req: any, res: Response) => {

  try {
    const perfil = {
      datos: {
        email: req.datos,
      },
      ordenes: []
    };

    res.status(200).json(perfil);
  } catch (error) {
    logger.error(`🔴 CONTROLADOR - Error al obtener perfil - ${error}`);
    return res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Leer todos los usuarios
export const index = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al obtener usuarios - ${err}`);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Eliminar un usuario
export const destroy = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await deleteUser(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.status(200).json({mensaje: 'Usuario eliminado!'});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al editar usuario - ${err}`);
    return res.status(500).json({ error: 'Error al obtener usuario' });
  }
};