import db from '../db.js';

export async function insertContact(subject, message) {
  const result = await db.query(
    `INSERT INTO contact_forms (subject, message)
     VALUES ($1, $2)
     RETURNING id, subject, message, submitted`,
    [subject, message]
  );

  return result.rows[0];
}

export async function getAllContactForms() {
  const result = await db.query(
    `SELECT id, subject, message, submitted
     FROM contact_forms
     ORDER BY submitted DESC`
  );

  return result.rows;
}
