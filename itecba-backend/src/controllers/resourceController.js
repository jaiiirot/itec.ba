import Resource from "../models/Resource.js";

// GET: Aprobados (Público)
export const getApprovedResources = async (req, res) => {
  try {
    const resources = await Resource.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener recursos" });
  }
};

// GET: Pendientes (Solo Admins)
export const getPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ isApproved: false }).sort({
      createdAt: 1,
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pendientes" });
  }
};

// POST: Subir recurso
export const createResource = async (req, res) => {
  try {
    // Si es admin se aprueba automáticamente, si es alumno va a pendientes
    const isApproved = req.user.role === "admin";
    const newResource = new Resource({
      ...req.body,
      submittedBy: req.user.uid,
      isApproved,
    });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el recurso" });
  }
};

// PATCH: Aprobar recurso (Solo Admins)
export const approveResource = async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ error: "Error al aprobar" });
  }
};

// DELETE: Rechazar recurso (Solo Admins)
export const deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Recurso eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al rechazar" });
  }
};
