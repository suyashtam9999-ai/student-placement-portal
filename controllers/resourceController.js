const Resource = require("../models/Resource");
const User = require("../models/User");

// @route GET /api/resources?category=Aptitude
const getResources = async (req, res) => {
  try {
    const where = {};
    if (req.query.category) where.category = req.query.category;
    const resources = await Resource.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/resources (admin only)
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/resources/:id (admin only)
const deleteResource = async (req, res) => {
  try {
    await Resource.destroy({ where: { id: req.params.id } });
    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/resources/:id/complete (toggle for logged-in student)
const toggleResourceComplete = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const already = await user.hasResource(resource);
    let completed;
    if (already) {
      await user.removeResource(resource);
      completed = false;
    } else {
      await user.addResource(resource);
      completed = true;
    }
    res.json({ completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResources, createResource, deleteResource, toggleResourceComplete };
