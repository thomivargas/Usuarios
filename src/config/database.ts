import pkg from 'pg';
import 'dotenv/config';
import logger from '../utils/logger';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

// Configura la conexión con PostgreSQL
export const pool = new Pool({
    allowExitOnIdle: true,
    connectionString
});

(async () => {
    try {
        await pool.query('SELECT NOW()');
        logger.info('🟢 Conexion con la base de datos')
    } catch (error) {
        logger.error(`🔴 DATABASE - Error al conectarse con la base de datos - ${error}`)
    }
})()
