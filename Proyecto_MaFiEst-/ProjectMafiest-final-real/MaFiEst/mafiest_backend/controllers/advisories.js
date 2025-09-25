const Advisory = require("../models/Advisory");

const advisoryController = {
  async createAdvisory(req, res) {
    try {
      const { userId, message } = req.body;
      const advisory = await Advisory.create({ userId, message });
      res.status(201).json(advisory);
    } catch (error) {
      res.status(500).json({ error: "Error al crear la asesoría" });
    }
  },

  async getAdvisories(req, res) {
    try {
      const advisories = await Advisory.findAll();
      res.status(200).json(advisories);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las asesorías" });
    }
  },

  async getAdvisoryById(req, res) {
    try {
      const advisory = await Advisory.findByPk(req.params.id);
      if (!advisory) {
        return res.status(404).json({ error: "Asesoría no encontrada" });
      }
      res.status(200).json(advisory);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la asesoría" });
    }
  },

  async updateAdvisory(req, res) {
    try {
      const { message } = req.body;
      const advisory = await Advisory.findByPk(req.params.id);
      if (!advisory) {
        return res.status(404).json({ error: "Asesoría no encontrada" });
      }
      advisory.message = message;
      await advisory.save();
      res.status(200).json(advisory);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la asesoría" });
    }
  },

  async deleteAdvisory(req, res) {
    try {
      const advisory = await Advisory.findByPk(req.params.id);
      if (!advisory) {
        return res.status(404).json({ error: "Asesoría no encontrada" });
      }
      await advisory.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la asesoría" });
    }
  },
};

module.exports = advisoryController;
