import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  } from '../services/courseService.js';
  
  //Gets all the courses

  const getCourses = async (req, res) => {
    try {
      const { search } = req.query;
      const courses = await getAllCourses(search);
      res.json({ courses });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // add Courses
  
  const addCourse = async (req, res) => {
    try {
      const { courseName, courseDescription, instructor } = req.body;
  
      if (!courseName || !courseDescription || !instructor) {
        return res.status(400).json({ message: 'Please provide all course details' });
      }
  
      const course = await createCourse({
        courseName,
        courseDescription,
        instructor,
        studentId: req.student._id,
      });
  
      res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  const editCourse = async (req, res) => {
    try {
      const course = await updateCourse(req.params.id, req.body, req.student._id);
      res.json({ message: 'Course updated successfully', course });
    } catch (error) {
      const status = error.message.includes('Not authorized') ? 403
        : error.message === 'Course not found' ? 404
        : 500;
      res.status(status).json({ message: error.message });
    }
  };
  
  
  const removeCourse = async (req, res) => {
    try {
      await deleteCourse(req.params.id, req.student._id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      const status = error.message.includes('Not authorized') ? 403
        : error.message === 'Course not found' ? 404
        : 500;
      res.status(status).json({ message: error.message });
    }
  };
  
  export { getCourses, addCourse, editCourse, removeCourse };