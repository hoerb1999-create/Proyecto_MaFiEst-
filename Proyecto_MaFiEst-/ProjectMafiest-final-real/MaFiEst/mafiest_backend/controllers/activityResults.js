const ActivityResult = require("../models/ActivityResult");

const activityResultController = {
  async getActivityResults(req, res) {
    try {
      const results = await ActivityResult.findAll();
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener resultados de actividades" });
    }
  },

  async getActivityResultById(req, res) {
    try {
      const result = await ActivityResult.findByPk(req.params.id);
      if (!result) return res.status(404).json({ error: "Resultado no encontrado" });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el resultado" });
    }
  },

  async createActivityResult(req, res) {
    try {
      if (req.user.role !== "docente") {
        return res.status(403).json({ error: "Solo docentes pueden registrar resultados" });
      }

      const result = await ActivityResult.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el resultado" });
    }
  },

  async updateActivityResult(req, res) {
    try {
      if (req.user.role !== "docente") {
        return res.status(403).json({ error: "Solo docentes pueden actualizar resultados" });
      }

      const result = await ActivityResult.findByPk(req.params.id);
      if (!result) return res.status(404).json({ error: "Resultado no encontrado" });

      await result.update(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el resultado" });
    }
  },

  async deleteActivityResult(req, res) {
    try {
      if (req.user.role !== "docente") {
        return res.status(403).json({ error: "Solo docentes pueden eliminar resultados" });
      }

      const result = await ActivityResult.findByPk(req.params.id);
      if (!result) return res.status(404).json({ error: "Resultado no encontrado" });

      await result.destroy();
      res.json({ message: "Resultado eliminado" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el resultado" });
    }
  },
};

module.exports = activityResultController;
