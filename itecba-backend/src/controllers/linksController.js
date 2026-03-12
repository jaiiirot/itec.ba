import Link from "../models/Link.js";

// GET: Traer todos los links (Público)
export const getLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ order: 1 }); // Ordenados por el campo 'order'
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener links" });
  }
};

// POST: Crear link (Solo Admin)
export const createLink = async (req, res) => {
  try {
    const newLink = new Link(req.body);
    await newLink.save();
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: "Error al crear link" });
  }
};

// PUT: Actualizar link (Solo Admin)
export const updateLink = async (req, res) => {
  try {
    const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar link" });
  }
};

// DELETE: Borrar link (Solo Admin)
export const deleteLink = async (req, res) => {
  try {
    await Link.findByIdAndDelete(req.params.id);
    res.json({ message: "Link eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar link" });
  }
};
