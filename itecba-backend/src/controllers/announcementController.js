import Announcement from "../models/Announcement.js";

// GET: Traer anuncios activos
export const getActiveAnnouncements = async (req, res, next) => {
  try {
    const now = new Date();
    // Trae los anuncios cuya fecha de expiración sea mayor a AHORA
    const announcements = await Announcement.find({
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    next(error); // Pasa el error al capturador global que armamos
  }
};

// POST: Crear anuncio
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, hoursActive } = req.body;

    // 1. Validamos que lleguen los datos desde React
    if (!title || !message) {
      return res.status(400).json({ error: "El título y el mensaje son obligatorios." });
    }

    // 2. Nos aseguramos de que hoursActive sea un número (si falla, ponemos 24hs por defecto)
    const horas = Number(hoursActive) || 24;

    // 3. FÓRMULA INFALIBLE: Fecha actual en milisegundos + (horas convertidas a milisegundos)
    const expiresAt = new Date(Date.now() + horas * 60 * 60 * 1000);

    // 4. Guardamos en MongoDB
    const newAnnouncement = new Announcement({ title, message, expiresAt });
    await newAnnouncement.save();

    res.status(201).json(newAnnouncement);
  } catch (error) {
    next(error); // Si algo explota, lo mandamos a la consola roja
  }
};

// DELETE: Borrar anuncio
export const deleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Aviso eliminado" });
  } catch (error) {
    next(error);
  }
};