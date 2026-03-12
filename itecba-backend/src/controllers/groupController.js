import Group from "../models/Group.js";

// GET: Traer todos los grupos APROBADOS (Público)
export const getApprovedGroups = async (req, res) => {
  try {
    const groups = await Group.find({ isApproved: true }).sort({
      createdAt: -1,
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener grupos" });
  }
};

// GET: Traer grupos PENDIENTES (Solo Admins)
export const getPendingGroups = async (req, res) => {
  try {
    const groups = await Group.find({ isApproved: false }).sort({
      createdAt: 1,
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener grupos pendientes" });
  }
};

// POST: Proponer un nuevo grupo
export const createGroup = async (req, res) => {
  try {
    // Si el usuario tiene rol 'admin', se aprueba instantáneamente
    const isApproved = req.user.role === "admin";

    const newGroup = new Group({
      ...req.body,
      submittedBy: req.user.uid,
      isApproved,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el grupo" });
  }
};

// PATCH: Aprobar un grupo pendiente (Solo Admins)
export const approveGroup = async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: "Error al aprobar el grupo" });
  }
};

// DELETE: Rechazar/Eliminar un grupo (Solo Admins)
export const deleteGroup = async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: "Grupo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el grupo" });
  }
};
