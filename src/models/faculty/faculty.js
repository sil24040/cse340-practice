import db from '../db.js';

export async function getAllFaculty(sortBy = 'name') {
  const result = await db.query(
    `SELECT id,
            first_name AS "firstName",
            last_name AS "lastName",
            name,
            slug,
            department,
            title,
            office,
            phone,
            email
     FROM faculty`
  );

  let faculty = result.rows;

  switch (sortBy) {
    case 'department':
      faculty.sort((a, b) => a.department.localeCompare(b.department));
      break;
    case 'name':
    default:
      faculty.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return faculty;
}

export async function getFacultyBySlug(slug) {
  const result = await db.query(
    `SELECT id,
            first_name AS "firstName",
            last_name AS "lastName",
            name,
            slug,
            department,
            title,
            office,
            phone,
            email
     FROM faculty
     WHERE slug = $1`,
    [slug]
  );
  return result.rows[0] || {};
}
