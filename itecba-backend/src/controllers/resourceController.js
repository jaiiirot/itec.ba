import Resource from "../models/Resource.js";

export const getApprovedResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  } // 🔴 Enviamos el error al Manejador Global
};

export const getPendingResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const { title, link, materia, carrera } = req.body;

    // 🔴 VALIDACIÓN: Bloqueamos peticiones vacías
    if (!title || !link || !materia || !carrera) {
      const err = new Error(
        "Faltan campos obligatorios (title, link, materia, carrera)",
      );
      err.statusCode = 400; // Bad Request
      throw err;
    }

    const newResource = new Resource(req.body);
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    next(error);
  }
};

export const approveResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    );
    if (!resource) {
      const err = new Error("Aporte no encontrado");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json(resource);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      const err = new Error("Aporte no encontrado");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ message: "Aporte eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};
