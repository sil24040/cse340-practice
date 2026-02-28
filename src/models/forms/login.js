import bcrypt from 'bcrypt';
import db from '../db.js';

/**
 * Look up a user by email for login.
 * Returns: { id, firstName, lastName, email, passwordHash } or null
 */
const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT 
        id,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        password_hash AS "passwordHash",
        created_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export { findUserByEmail, verifyPassword };
