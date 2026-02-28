import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupDatabase() {
  try {
    const seedPath = path.join(__dirname, 'sql', 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');

    // Check if faculty table has data
    try {
      await db.query('SELECT 1 FROM faculty LIMIT 1');
    } catch {
      console.log('Seeding database...');
      await db.query(seedSQL);

      // Run practice.sql
      const practicePath = path.join(__dirname, 'sql', 'practice.sql');
      if (fs.existsSync(practicePath)) {
        const practiceSQL = fs.readFileSync(practicePath, 'utf8');
        await db.query(practiceSQL);
        console.log('Practice database tables initialized');
      }

      console.log('Database seeded successfully');
    }
  } catch (error) {
    console.error('Error during database setup:', error);
    throw error;
  }
}

export async function testConnection() {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
