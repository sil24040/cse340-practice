import db from './db.js';

export async function findUserByEmail(email) {
  const result = await db.query(
    `SELECT id,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            password_hash AS "passwordHash",
            created_at AS "createdAt"
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

export async function createUser(firstName, lastName, email, passwordHash) {
  const result = await db.query(
    `INSERT INTO users (first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, first_name AS "firstName", last_name AS "lastName", email`,
    [firstName, lastName, email, passwordHash]
  );
  return result.rows[0];
}
