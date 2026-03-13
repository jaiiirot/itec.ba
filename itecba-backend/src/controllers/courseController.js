import Course from "../models/Course.js";

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      const err = new Error("Curso no encontrado");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, videos } = req.body;

    // 🔴 VALIDACIÓN: Un curso sin título o sin videos no sirve
    if (!title || !videos || videos.length === 0) {
      const err = new Error(
        "El curso debe tener un título y al menos un video",
      );
      err.statusCode = 400;
      throw err;
    }

    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedCourse) {
      const err = new Error("Curso no encontrado para actualizar");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Curso eliminado" });
  } catch (error) {
    next(error);
  }
};
