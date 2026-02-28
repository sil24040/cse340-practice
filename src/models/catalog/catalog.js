import db from '../db.js';

export async function getSectionsByCourseSlug(slug, sortBy = 'time') {
  const result = await db.query(
    `SELECT s.course_code AS "courseCode",
            c.name AS "courseName",
            f.name AS "professor",
            f.slug AS "professorSlug",
            s.time,
            s.room
     FROM sections s
     JOIN courses c ON c.course_code = s.course_code
     JOIN faculty f ON f.id = s.faculty_id
     WHERE c.slug = $1`,
    [slug]
  );

  let sections = result.rows;

  switch (sortBy) {
    case 'professor':
      sections.sort((a, b) => a.professor.localeCompare(b.professor));
      break;
    case 'room':
      sections.sort((a, b) => a.room.localeCompare(b.room));
      break;
    case 'time':
    default:
      break;
  }

  return sections;
}
