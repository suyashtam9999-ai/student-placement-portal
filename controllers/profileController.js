const User = require("../models/User");
const Resource = require("../models/Resource");
const TestResult = require("../models/TestResult");

// @route GET /api/profile/me
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    const completed = await user.getResources({ attributes: ["id"] });
    res.json({
      ...user.toSafeJSON(),
      completedResources: completed.map((r) => r.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/profile/me
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fields = [
      "name",
      "branch",
      "graduationYear",
      "phone",
      "resumeLink",
      "githubLink",
      "linkedinLink",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    // Array fields stored as comma-separated text
    if (req.body.skills !== undefined) user.skills = (req.body.skills || []).join(",");
    if (req.body.targetCompanies !== undefined) user.targetCompanies = (req.body.targetCompanies || []).join(",");

    await user.save();
    res.json(user.toSafeJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/profile/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalResources = await Resource.count();
    const user = await User.findByPk(userId);
    const completed = await user.getResources({ attributes: ["id"] });
    const completedCount = completed.length;
    const resourceProgress = totalResources === 0 ? 0 : Math.round((completedCount / totalResources) * 100);

    const results = await TestResult.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
    const totalTests = results.length;
    const avgScore =
      totalTests === 0 ? 0 : Math.round(results.reduce((sum, r) => sum + r.scorePercent, 0) / totalTests);

    const readinessScore = Math.round(resourceProgress * 0.4 + avgScore * 0.6);

    res.json({
      resourceProgress,
      completedResources: completedCount,
      totalResources,
      totalTests,
      avgScore,
      readinessScore,
      recentResults: results.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getDashboardStats };
