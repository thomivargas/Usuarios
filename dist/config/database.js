"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
// Configura la conexión con PostgreSQL
exports.pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'mydb',
    password: 'password',
    port: 5432,
});
