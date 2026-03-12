import Announcement from "../models/Announcement.js";

export const getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    // Trae los anuncios cuya fecha de expiración sea mayor a AHORA
    const announcements = await Announcement.find({
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener avisos" });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, hoursActive } = req.body;

    // Calculamos la fecha de expiración en el backend
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + Number(hoursActive));

    const newAnnouncement = new Announcement({ title, message, expiresAt });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: "Error al crear aviso" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Aviso eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar aviso" });
  }
};
