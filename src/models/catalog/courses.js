import db from '../db.js';

export async function getAllCourses() {
  const result = await db.query(
    `SELECT course_code AS "courseCode",
            name,
            credit_hours AS "creditHours",
            department,
            slug
     FROM courses
     ORDER BY course_code`
  );
  return result.rows;
}

export async function getCourseBySlug(slug) {
  const result = await db.query(
    `SELECT course_code AS "courseCode",
            name,
            credit_hours AS "creditHours",
            department,
            slug
     FROM courses
     WHERE slug = $1`,
    [slug]
  );
  return result.rows[0] || {};
}
