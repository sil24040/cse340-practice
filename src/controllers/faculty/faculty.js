import { getFacultyById, getSortedFaculty } from '../../models/faculty/faculty.js';

const facultyListPage = (req, res) => {
  const sortBy = req.query.sort || 'name';
  const { facultyArray, safeSort } = getSortedFaculty(sortBy);

  res.render('faculty/list', {
    title: 'Faculty Directory',
    faculty: facultyArray,
    currentSort: safeSort
  });
};

const facultyDetailPage = (req, res, next) => {
  const facultyId = req.params.facultyId;
  const person = getFacultyById(facultyId);

  if (!person) {
    const err = new Error(`Faculty member ${facultyId} not found`);
    err.status = 404;
    return next(err);
  }

  res.render('faculty/detail', {
    title: person.name,
    facultyId,
    person
  });
};

export { facultyListPage, facultyDetailPage };
