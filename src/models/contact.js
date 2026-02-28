import db from './db.js';

export async function insertContact(subject, message) {
  await db.query(
    `INSERT INTO contact_form (subject, message)
     VALUES ($1, $2)`,
    [subject, message]
  );
}
