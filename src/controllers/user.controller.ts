import { Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { deleteUser, buscarUsuarioPorEmail, getUsers, registrarUsuario, putUser, validarToken } from '../models/user.model';
import logger from "../utils/logger";
import { enviarEmailValidacion } from "../services/email.services";

// Register
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
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
    { expiresIn: '1h' } 
    );  
    if (!token) return res.status(500).json({ok: false, mensaje: 'Token no generado'});    
    //validar Email
    const emailFuncion = await enviarEmailValidacion(email, token);
    console.log(emailFuncion)
    const newUser = await registrarUsuario({username, email, password: hashedPassword})
    res.status(201).json({ok: true, mensaje: 'Usuario registrado. Revisa tu email para validar la cuenta.', userId: newUser.id});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al crear usuario - ${err}`);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const validacion = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (!payload) return res.status(401).json({ ok: false, mensaje: "Token inválido" });
    await validarToken();
    res.status(200).json({ ok: true, mensaje: "Email validado correctamente." });
  } catch (err) {
    console.error("Error al validar email:", err);
    res.status(401).json({ ok: false, mensaje: "Token inválido o expirado." });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await buscarUsuarioPorEmail(email); 
    if (!user) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    // Comparar la contraseña ingresada con el hash almacenado
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ ok: false, mensaje: 'Contraseña incorrecta' });
    if(user.email_validacion == false) return res.status(401).json({error: 'cuenta no verificada'})
    // JsonWebToken
    const token = jwt.sign({ 
      userId: user.id, 
      email: user.email 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' } 
    );

    res.status(200).json({ ok: true, mensaje: 'Inicio de sesión exitoso', token });
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al obtener usuario por ID - ${err}`);
    return res.status(500).json({ error: 'Error al obtener usuario' });
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

// Editar un usuario
export const update = async (req:Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { email, username, password } = req.body;
    const user = await putUser(userId, { email, username, password });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.status(200).json({user});
  } catch (err) {
    logger.error(`🔴 CONTROLADOR - Error al editar usuario - ${err}`);
    return res.status(500).json({ error: 'Error al obtener usuario' });
  }
}

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