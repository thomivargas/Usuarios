"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = exports.insertUser = exports.createTable = void 0;
const database_1 = require("../config/database");
const logger_1 = __importDefault(require("../utils/logger"));
const createTable = async () => {
    try {
        await database_1.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(100)
      );
    `);
        logger_1.default.info(`🟢 Tabla "users" creada o ya existe`);
    }
    catch (err) {
        logger_1.default.error(`🔴 Error al crear la tabla - ${err}`);
    }
};
exports.createTable = createTable;
// Insertar usuario
const insertUser = async (name, email, password) => {
    try {
        const result = await database_1.pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
        logger_1.default.info(`🟢 Usuario creado correctamente ${result.rows[0].id}`);
        return result.rows[0];
    }
    catch (err) {
        logger_1.default.error(`🔴 MODAL - Error al insertar usuario - ${err}`);
    }
};
exports.insertUser = insertUser;
// Obtener todos los usuarios
const getUsers = async () => {
    try {
        const result = await database_1.pool.query('SELECT * FROM users');
        return result.rows;
    }
    catch (err) {
        logger_1.default.error(`🔴 MODAL - Error al obtener usuarios - ${err}`);
    }
};
exports.getUsers = getUsers;
// Obtener un solo usuario
const getUserById = async (id) => {
    try {
        const result = await database_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
    }
    catch (err) {
        logger_1.default.error(`🔴 MODAL - Error al obtener usuarios - ${err}`);
    }
};
exports.getUserById = getUserById;
