requireAuth();

const CATEGORIES = ["Aptitude", "Coding", "Core CS", "HR", "Communication"];
const QUESTIONS_PER_TEST = 5;
const TEST_DURATION_SECONDS = 10 * 60; // 10 minutes

let questions = [];
let answers = {}; // questionId -> selectedIndex
let currentIndex = 0;
let timeLeft = TEST_DURATION_SECONDS;
let timerInterval = null;
let startTimestamp = null;
let activeCategory = null;

function renderSetupCards() {
  const container = document.getElementById("test-cards");
  container.innerHTML = CATEGORIES.map(
    (cat) => `
    <div class="ticket">
      <div class="ticket-main">
        <div class="ticket-title">${cat} Mock Test</div>
        <div class="ticket-meta">${QUESTIONS_PER_TEST} questions · 10 minutes · Instant scoring</div>
        <button class="btn btn-primary" data-cat="${cat}">Start Test</button>
      </div>
      <div class="ticket-stub">
        <div class="stub-label">ADMIT</div>
        <div class="stub-value">${cat.slice(0, 3).toUpperCase()}</div>
      </div>
    </div>
  `
  ).join("");

  container.querySelectorAll("button[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => startTest(btn.dataset.cat));
  });
}

async function startTest(category) {
  try {
    activeCategory = category;
    questions = await apiRequest(`/tests/questions?category=${encodeURIComponent(category)}&limit=${QUESTIONS_PER_TEST}`);
    if (questions.length === 0) {
      alert("No questions available for this category yet.");
      return;
    }
    answers = {};
    currentIndex = 0;
    timeLeft = TEST_DURATION_SECONDS;
    startTimestamp = Date.now();

    document.getElementById("setup-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.add("hidden");
    document.getElementById("test-screen").classList.remove("hidden");
    document.getElementById("test-heading").textContent = `${category} Mock Test`;

    renderQuestion();
    startTimer();
  } catch (err) {
    alert(err.message);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");
  document.getElementById("timer").textContent = `${m}:${s}`;
}

function renderQuestion() {
  const q = questions[currentIndex];
  const container = document.getElementById("question-container");

  container.innerHTML = `
    <div class="question-box">
      <div class="question-num">QUESTION ${currentIndex + 1} OF ${questions.length}</div>
      <h3>${q.questionText}</h3>
      <div id="options-list">
        ${q.options
          .map(
            (opt, idx) => `
          <div class="option-row ${answers[q.id] === idx ? "selected" : ""}" data-idx="${idx}">
            ${String.fromCharCode(65 + idx)}. ${opt}
          </div>
        `
          )
          .join("")}
      </div>
    </div>
    <div class="flex-between">
      <button class="btn btn-outline" id="prev-btn" ${currentIndex === 0 ? "disabled" : ""}>← Previous</button>
      <button class="btn btn-primary" id="next-btn" ${currentIndex === questions.length - 1 ? "disabled" : ""}>Next →</button>
    </div>
  `;

  container.querySelectorAll(".option-row").forEach((row) => {
    row.addEventListener("click", () => {
      answers[q.id] = parseInt(row.dataset.idx);
      renderQuestion();
    });
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentIndex > 0) { currentIndex--; renderQuestion(); }
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentIndex < questions.length - 1) { currentIndex++; renderQuestion(); }
  });

  document.getElementById("progress-label").textContent =
    `${Object.keys(answers).length} of ${questions.length} answered`;
}

async function submitTest() {
  clearInterval(timerInterval);

  const answerList = Object.entries(answers).map(([questionId, selectedIndex]) => ({
    questionId,
    selectedIndex,
  }));

  // include unanswered questions as -1 so they count as incorrect
  questions.forEach((q) => {
    if (!(q.id in answers)) {
      answerList.push({ questionId: q.id, selectedIndex: -1 });
    }
  });

  const timeTakenSeconds = Math.round((Date.now() - startTimestamp) / 1000);

  try {
    const { result, review } = await apiRequest("/tests/submit", "POST", {
      category: activeCategory,
      answers: answerList,
      timeTakenSeconds,
    });
    showResult(result, review);
  } catch (err) {
    alert(err.message);
  }
}

function showResult(result, review) {
  document.getElementById("test-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  document.getElementById("result-score").textContent = `${result.scorePercent}%`;
  document.getElementById("result-correct").textContent = `${result.correctAnswers}/${result.totalQuestions}`;
  document.getElementById("result-time").textContent = `${result.timeTakenSeconds}s`;

  const reviewContainer = document.getElementById("review-container");
  reviewContainer.innerHTML = review
    .map((r, i) => {
      const status = r.isCorrect ? "correct" : "incorrect";
      const yourAnswer = r.selectedIndex === -1 ? "Not answered" : String.fromCharCode(65 + r.selectedIndex);
      return `
      <div class="resource-item">
        <div>
          <div class="r-title">${i + 1}. ${r.questionText}</div>
          <div class="r-desc option-row ${status}" style="display:inline-block; margin-top:6px;">
            Your answer: ${yourAnswer} ${r.isCorrect ? "✓" : `· Correct: ${String.fromCharCode(65 + r.correctIndex)}`}
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

document.getElementById("submit-test-btn").addEventListener("click", () => {
  if (confirm("Submit the test now?")) submitTest();
});

document.getElementById("retake-btn").addEventListener("click", () => {
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("setup-screen").classList.remove("hidden");
});

renderSetupCards();
