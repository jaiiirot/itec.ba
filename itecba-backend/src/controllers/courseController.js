import Course from "../models/Course.js";
import ytpl from "ytpl"; // <-- IMPORTANTE AÑADIR ESTO ARRIBA

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cursos" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Curso no encontrado" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el curso" });
  }
};

export const addCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el curso" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Curso eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el curso" });
  }
};

// NUEVO: POST - Extraer videos de una playlist de YouTube
export const fetchPlaylistData = async (req, res, next) => {
  try {
    const { playlistUrl } = req.body;

    if (!playlistUrl) {
      return res.status(400).json({ error: "Falta la URL de la playlist." });
    }

    // Usamos ytpl para hacer scraping de la playlist (límite de 50 videos)
    const playlist = await ytpl(playlistUrl, { limit: 50 });

    // Mapeamos los datos para que tengan el formato exacto de tu base de datos
    const videos = playlist.items.map((item) => ({
      youtubeId: item.id,
      title: item.title,
      duration: item.duration || "0:00",
    }));

    // Devolvemos el título de la playlist y sus videos
    res.json({
      title: playlist.title,
      videos: videos,
    });
  } catch (error) {
    console.error("Error extrayendo playlist:", error);
    res.status(500).json({
      error:
        "Error al extraer la playlist. Verifica que el link sea correcto y la playlist sea PÚBLICA.",
    });
  }
};
