import { getAllCourses, getCourseBySlug } from '../../models/catalog/courses.js';
import { getSectionsByCourseSlug } from '../../models/catalog/catalog.js';

export async function catalogPage(req, res, next) {
  try {
    const courses = await getAllCourses();
    res.render('catalog/list', {
      title: 'Course Catalog',
      courses
    });
  } catch (error) {
    next(error);
  }
}

export async function courseDetailPage(req, res, next) {
  try {
    const courseSlug = req.params.slugId;
    const sortBy = req.query.sort || 'time';

    const course = await getCourseBySlug(courseSlug);
    if (Object.keys(course).length === 0) {
      const err = new Error(`Course ${courseSlug} not found`);
      err.status = 404;
      return next(err);
    }

    const sections = await getSectionsByCourseSlug(courseSlug, sortBy);

    res.render('catalog/detail', {
      title: `${course.courseCode} - ${course.name}`,
      course: { ...course, sections },
      currentSort: sortBy
    });
  } catch (error) {
    next(error);
  }
}
