import { getAllFaculty, getFacultyBySlug } from '../../models/faculty/faculty.js';

export async function facultyListPage(req, res, next) {
  try {
    const sortBy = req.query.sort || 'name';
    const faculty = await getAllFaculty(sortBy);

    res.render('faculty/list', {
      title: 'Faculty Directory',
      faculty,
      currentSort: sortBy
    });
  } catch (error) {
    next(error);
  }
}

export async function facultyDetailPage(req, res, next) {
  try {
    const slug = req.params.slugId;
    const facultyMember = await getFacultyBySlug(slug);

    if (Object.keys(facultyMember).length === 0) {
      const err = new Error(`Faculty member ${slug} not found`);
      err.status = 404;
      return next(err);
    }

    res.render('faculty/detail', {
      title: facultyMember.name,
      faculty: facultyMember
    });
  } catch (error) {
    next(error);
  }
}
