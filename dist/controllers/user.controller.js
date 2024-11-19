"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.show = exports.index = exports.create = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const user_model_1 = require("../models/user.model");
// Crear un usuario
const create = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await (0, user_model_1.insertUser)(username, email, password);
        logger_1.default.info("🟢 Usuario creado" + user.email);
        res.status(201).json('Usuario creado: ' + user);
    }
    catch (err) {
        logger_1.default.error(`🔴 CONTROLADOR - Error al crear usuario - ${err}`);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};
exports.create = create;
// Leer todos los usuarios
const index = async (req, res) => {
    try {
        const users = await (0, user_model_1.getUsers)();
        logger_1.default.info("🟢 Get de todos los usuarios");
        res.status(200).json(users);
    }
    catch (err) {
        logger_1.default.error(`🔴 CONTROLADOR - Error al obtener usuarios - ${err}`);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};
exports.index = index;
// Leer un usuario por ID
const show = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await (0, user_model_1.getUserById)(userId);
        if (!user)
            return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json(user);
    }
    catch (err) {
        return res.status(500).json({ error: 'Error al obtener usuario' });
    }
};
exports.show = show;
// Eliminar un usuario
const destroy = async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.params.id);
        //if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        //logger.info("🟢 Usuario" + user + "eliminado");
        res.json({ message: 'Usuario eliminado' });
    }
    catch (err) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
exports.destroy = destroy;
