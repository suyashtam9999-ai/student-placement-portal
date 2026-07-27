const { Op, fn } = require("sequelize");
const Question = require("../models/Question");
const TestResult = require("../models/TestResult");

// @route GET /api/tests/questions?category=Aptitude&limit=10
// Returns questions WITHOUT the correct answer exposed
const getQuestions = async (req, res) => {
  try {
    const where = {};
    if (req.query.category) where.category = req.query.category;
    const limit = parseInt(req.query.limit) || 10;

    const questions = await Question.findAll({
      where,
      order: fn("RAND"),
      limit,
      attributes: { exclude: ["correctOptionIndex"] },
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/tests/submit
// body: { category, timeTakenSeconds, answers: [{ questionId, selectedIndex }] }
const submitTest = async (req, res) => {
  try {
    const { category, answers, timeTakenSeconds } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.findAll({ where: { id: { [Op.in]: questionIds } } });

    let correctAnswers = 0;
    const reviewList = answers.map((a) => {
      const q = questions.find((q) => q.id === Number(a.questionId));
      const isCorrect = q && q.correctOptionIndex === a.selectedIndex;
      if (isCorrect) correctAnswers++;
      return {
        questionId: a.questionId,
        questionText: q ? q.questionText : "",
        selectedIndex: a.selectedIndex,
        correctIndex: q ? q.correctOptionIndex : null,
        isCorrect,
      };
    });

    const scorePercent = Math.round((correctAnswers / answers.length) * 100);

    const result = await TestResult.create({
      userId: req.user.id,
      category,
      totalQuestions: answers.length,
      correctAnswers,
      scorePercent,
      timeTakenSeconds: timeTakenSeconds || 0,
    });

    res.status(201).json({ result, review: reviewList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/tests/history
const getHistory = async (req, res) => {
  try {
    const results = await TestResult.findAll({ where: { userId: req.user.id }, order: [["createdAt", "DESC"]] });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestions, submitTest, getHistory };
