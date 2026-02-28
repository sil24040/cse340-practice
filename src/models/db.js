import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const NODE_ENV = process.env.NODE_ENV || 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load SSL certificate
export const caCert = fs.readFileSync(
  path.join(process.cwd(), 'bin', 'byuicse-psql-cert.pem'),
  'utf8'
);

// Create connection pool
const pool = new pg.Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    ca: caCert,
    rejectUnauthorized: true,
    checkServerIdentity: () => undefined
  }
});

const ENABLE_SQL_LOGGING = process.env.ENABLE_SQL_LOGGING === 'true';

const db = {
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = `${Date.now() - start}ms`;

      if (ENABLE_SQL_LOGGING) {
        console.log('Executed query:', { text, duration, rows: res.rowCount });
      }

      return res;
    } catch (error) {
      if (ENABLE_SQL_LOGGING) {
        console.error('Error in query:', { text, error: error.message });
      }
      throw error;
    }
  }
};

export default db;
