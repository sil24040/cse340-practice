import db from './db.js';

export async function insertContact(subject, message) {
  const sql = `
    INSERT INTO contact (subject, message)
    VALUES ($1, $2)
    RETURNING id;
  `;

  const result = await db.query(sql, [subject, message]);
  return result.rows[0];
}
