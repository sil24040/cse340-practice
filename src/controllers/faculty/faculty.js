import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

export const facultyListPage = async (req, res, next) => {
  try {
    const sortBy = req.query.sort || 'name';
    const faculty = await getSortedFaculty(sortBy); // MUST await

    res.render('faculty/list', {
      title: 'Faculty Directory',
      faculty: Array.isArray(faculty) ? faculty : [],
      sortBy
    });
  } catch (err) {
    next(err);
  }
};

export const facultyDetailPage = async (req, res, next) => {
  try {
    const facultySlug = req.params.slugId;
    const facultyMember = await getFacultyBySlug(facultySlug); // MUST await

    if (!facultyMember || Object.keys(facultyMember).length === 0) {
      const err = new Error(`Faculty member ${facultySlug} not found`);
      err.status = 404;
      return next(err);
    }

    res.render('faculty/detail', {
      title: facultyMember.name,
      facultyMember
    });
  } catch (err) {
    next(err);
  }
};