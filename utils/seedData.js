// Run with: npm run seed
const dotenv = require("dotenv");
dotenv.config();

const { sequelize, connectDB } = require("../config/db");
const Resource = require("../models/Resource");
const Question = require("../models/Question");
// Load these too so associations are registered before sync
require("../models/User");
require("../models/TestResult");
require("../models/CompletedResource");

const resources = [
  { title: "Aptitude Study Notes (PDF)", category: "Aptitude", difficulty: "Beginner", description: "Time-Speed-Distance, Time & Work, Percentages, Interest, Ratios — full reference notes.", link: "/materials/aptitude-notes.pdf" },
  { title: "Aptitude Practice Tips", category: "Aptitude", difficulty: "Intermediate", description: "Shortcuts and speed-calculation tricks for the aptitude round.", link: "/materials/aptitude-notes.pdf" },
  { title: "Coding & DSA Notes (PDF)", category: "Coding", difficulty: "Beginner", description: "Time complexity, arrays/strings patterns, stacks/queues, trees/graphs, DP — full reference notes.", link: "/materials/coding-notes.pdf" },
  { title: "Dynamic Programming Basics", category: "Coding", difficulty: "Advanced", description: "Memoization, tabulation and classic DP problems.", link: "/materials/coding-notes.pdf" },
  { title: "Core CS Notes (PDF)", category: "Core CS", difficulty: "Beginner", description: "OOP, DBMS normalization, Operating Systems, Computer Networks — full reference notes.", link: "/materials/core-cs-notes.pdf" },
  { title: "DBMS - Normalization", category: "Core CS", difficulty: "Intermediate", description: "1NF to BCNF with examples.", link: "/materials/core-cs-notes.pdf" },
  { title: "HR Interview Notes (PDF)", category: "HR", difficulty: "Beginner", description: "Tell Me About Yourself, STAR technique, common questions, salary negotiation — full reference notes.", link: "/materials/hr-notes.pdf" },
  { title: "Group Discussion & Communication Notes (PDF)", category: "Communication", difficulty: "Beginner", description: "GD etiquette, active listening, body language, professional email writing — full reference notes.", link: "/materials/communication-notes.pdf" },
];

const questions = [
  // Aptitude (5)
  { category: "Aptitude", questionText: "A train 150m long crosses a pole in 15 seconds. What is its speed?", options: ["10 m/s", "15 m/s", "36 km/hr", "Both A and C"], correctOptionIndex: 3 },
  { category: "Aptitude", questionText: "If the ratio of two numbers is 3:4 and their sum is 63, find the smaller number.", options: ["24", "27", "30", "36"], correctOptionIndex: 1 },
  { category: "Aptitude", questionText: "A sum of money doubles itself in 8 years at simple interest. In how many years will it triple?", options: ["12 years", "14 years", "16 years", "20 years"], correctOptionIndex: 2 },
  { category: "Aptitude", questionText: "Two pipes A and B can fill a tank in 12 and 18 minutes respectively. If both are opened together, how long to fill the tank?", options: ["6.4 min", "7.2 min", "8.1 min", "9 min"], correctOptionIndex: 1 },
  { category: "Aptitude", questionText: "The average of 5 consecutive odd numbers is 61. What is the largest number?", options: ["61", "63", "65", "67"], correctOptionIndex: 2 },

  // Coding (5)
  { category: "Coding", questionText: "What is the time complexity of binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctOptionIndex: 1 },
  { category: "Coding", questionText: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Linked List", "Graph"], correctOptionIndex: 1 },
  { category: "Coding", questionText: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], correctOptionIndex: 2 },
  { category: "Coding", questionText: "Which traversal of a Binary Search Tree gives elements in sorted order?", options: ["Preorder", "Postorder", "Inorder", "Level order"], correctOptionIndex: 2 },
  { category: "Coding", questionText: "In a hash table, what technique handles collisions by storing multiple elements at the same index using a linked list?", options: ["Open addressing", "Chaining", "Linear probing", "Rehashing"], correctOptionIndex: 1 },

  // Core CS (5)
  { category: "Core CS", questionText: "Which normal form removes transitive dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], correctOptionIndex: 2 },
  { category: "Core CS", questionText: "In OOP, hiding internal details of an object is called?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], correctOptionIndex: 2 },
  { category: "Core CS", questionText: "Which page replacement algorithm suffers from Belady's Anomaly?", options: ["LRU", "FIFO", "Optimal", "LFU"], correctOptionIndex: 1 },
  { category: "Core CS", questionText: "In the TCP/IP model, which layer is responsible for routing packets between networks?", options: ["Application", "Transport", "Internet", "Link"], correctOptionIndex: 2 },
  { category: "Core CS", questionText: "A deadlock can be prevented by violating which of the four necessary conditions most commonly in practice?", options: ["Mutual exclusion", "Hold and wait", "No preemption", "Circular wait"], correctOptionIndex: 1 },

  // HR (5)
  { category: "HR", questionText: "In an interview, the STAR technique is used to answer which type of question?", options: ["Technical", "Behavioral", "Case study", "Puzzle"], correctOptionIndex: 1 },
  { category: "HR", questionText: "What does the 'R' in the STAR technique stand for?", options: ["Reason", "Result", "Review", "Response"], correctOptionIndex: 1 },
  { category: "HR", questionText: "When asked 'What is your biggest weakness?', the best approach is to:", options: ["Say you have no weaknesses", "Mention an irrelevant personal flaw", "Share a genuine weakness with steps taken to improve", "Deflect the question entirely"], correctOptionIndex: 2 },
  { category: "HR", questionText: "In salary negotiation, it is generally best to:", options: ["State a number first, always low", "Let the employer bring it up and research market rates beforehand", "Refuse to discuss salary at all", "Accept the first offer immediately"], correctOptionIndex: 1 },
  { category: "HR", questionText: "Which of these best demonstrates leadership in a past-experience interview answer?", options: ["Describing what your manager did", "Focusing only on team failures", "Explaining a specific action you personally took and its outcome", "Listing your job title and duration"], correctOptionIndex: 2 },

  // Communication (5)
  { category: "Communication", questionText: "Which of these is an example of active listening?", options: ["Interrupting frequently", "Paraphrasing the speaker", "Checking your phone", "Planning your reply while they talk"], correctOptionIndex: 1 },
  { category: "Communication", questionText: "In a Group Discussion, which behavior is viewed most negatively by evaluators?", options: ["Making eye contact", "Summarizing others' points", "Interrupting and talking over others", "Asking clarifying questions"], correctOptionIndex: 2 },
  { category: "Communication", questionText: "What is the primary goal of non-verbal communication awareness in an interview?", options: ["To memorize a script", "To align body language with your spoken message", "To avoid speaking altogether", "To appear intimidating"], correctOptionIndex: 1 },
  { category: "Communication", questionText: "Which is the most effective way to start a formal email to a recruiter?", options: ["Hey there!", "To Whom It May Concern, (with a clear subject line and purpose)", "No greeting, just the message", "Using all lowercase for a casual tone"], correctOptionIndex: 1 },
  { category: "Communication", questionText: "When explaining a technical project to a non-technical interviewer, you should:", options: ["Use as much jargon as possible", "Simplify using analogies and avoid unnecessary jargon", "Skip the explanation entirely", "Only show code"], correctOptionIndex: 1 },
];

const seed = async () => {
  try {
    await connectDB();

    // Temporarily disable FK checks so we can clear tables regardless of order
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await Resource.destroy({ where: {}, truncate: true });
    await Question.destroy({ where: {}, truncate: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    await Resource.bulkCreate(resources);
    await Question.bulkCreate(questions);
    console.log("Sample resources and questions inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
