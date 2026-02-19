import { getAllCourses, getCourseBySlug } from '../../models/catalog/courses.js';
import { getSectionsByCourseSlug } from '../../models/catalog/catalog.js';

export const catalogPage = async (req, res, next) => {
  try {
    const courses = await getAllCourses(); // MUST await

    // Defensive: make sure we pass an array to the view
    const courseList = Array.isArray(courses) ? courses : [];

    res.render('catalog/list', {
      title: 'Course Catalog',
      courses: courseList
    });
  } catch (err) {
    next(err);
  }
};

export const courseDetailPage = async (req, res, next) => {
  try {
    const courseSlug = req.params.slugId;
    const sortBy = req.query.sort || 'time';

    const course = await getCourseBySlug(courseSlug); // MUST await
    const sections = await getSectionsByCourseSlug(courseSlug, sortBy); // MUST await

    if (!course || Object.keys(course).length === 0) {
      const err = new Error(`Course ${courseSlug} not found`);
      err.status = 404;
      return next(err);
    }

    res.render('catalog/detail', {
      title: `${course.courseCode} - ${course.name}`,
      course,
      sections: Array.isArray(sections) ? sections : [],
      sortBy
    });
  } catch (err) {
    next(err);
  }
};