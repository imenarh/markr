import { injectCSS, $ } from '../../utils.js';
import * as RubricPanel from '../../components/RubricPanel/RubricPanel.js';
import * as ResultCard from '../../components/ResultCard/ResultCard.js';
import * as Sidebar from '../../components/Sidebar/Sidebar.js';
injectCSS('/views/ThreadView/ThreadView.css');

// Placeholder feedback — replaced when AI grading is wired up
const FEEDBACK = {
  "Argument Quality": "Central argument is present and clear. The supporting reasoning could be more specific — particularly in the middle paragraphs where the claim drifts slightly.",
  "Evidence & Sources": "Good use of cited material. Two instances where claims lack supporting evidence. Recommend adding citations to the third body paragraph.",
  "Structure & Flow": "Well-organized overall. Introduction sets up the topic clearly. Conclusion could tie back more explicitly to the opening thesis.",
  "Writing Clarity": "Academic tone maintained throughout. A few run-on sentences in the middle section. Grammar is generally strong.",
  "Correctness": "Algorithm handles the main test cases. Edge case with empty input not addressed — this would cause a runtime error.",
  "Time Complexity": "O(n log n) achieved and clearly justified. Could elaborate on why O(n²) was rejected.",
  "Code Quality": "Well-structured and readable. Variable names are descriptive. Missing docstrings on two helper functions.",
  "Methodology": "Setup clearly described. Control variables section needs more detail on how interference was minimized.",
  "Data Analysis": "Quantitative analysis is solid. The anomaly in trial 3 is noted but unexplained.",
  "Conclusion": "Findings connect well to theory. Limitations section acknowledges sample size but not potential data collection bias.",
};

let _thread = null;

export function init(container, thread, onBack) {
  _thread = thread;

  container.innerHTML = `
    <nav class="thread-nav">
      <div class="thread-nav__left">
        <button class="btn btn-ghost btn-sm" id="back-btn">← Back</button>
      </div>
      <div class="thread-nav__center">
        <div class="thread-nav__name">${thread.name}</div>
      </div>
      <div class="thread-nav__right">
        <button class="btn btn-ghost btn-sm" id="history-btn">History</button>
      </div>
    </nav>
    <div class="thread-body">
      <div class="thread-main">
        <div id="rubric-container"></div>
        <div class="grading-box">
          <span class="grading-box__label">Paste submission</span>
          <textarea class="textarea" id="submission-text" placeholder="Paste the student's submission here..."></textarea>
          <div class="grading-box__footer">
            <span class="grading-box__hint">One AI call per criterion · Saved automatically</span>
            <button class="btn btn-primary" id="grade-btn">Grade submission</button>
          </div>
        </div>
        <div id="result-area"></div>
      </div>
      <div id="sidebar-container"></div>
    </div>
  `;

  $('back-btn').addEventListener('click', onBack);
  $('history-btn').addEventListener('click', Sidebar.toggle);
  $('grade-btn').addEventListener('click', grade);

  RubricPanel.init($('rubric-container'), thread);
  Sidebar.init($('sidebar-container'), thread);
}

function grade() {
  const txt = $('submission-text').value.trim();
  if (!txt) { alert('Please paste a submission before grading.'); return; }

  const btn = $('grade-btn');
  btn.disabled = true;
  btn.textContent = 'Grading...';

  ResultCard.showProgress($('result-area'), _thread.criteria, () => {
    const scores = _thread.criteria.map(c => ({
      n: c.name,
      s: Math.min(c.pts, Math.round(c.pts * (0.66 + Math.random() * 0.28))),
      m: c.pts,
      fb: FEEDBACK[c.name] ?? "Criterion assessed. Partially meets requirements with room to improve specificity."
    }));
    const total = scores.reduce((a, x) => a + x.s, 0);
    const max = scores.reduce((a, x) => a + x.m, 0);
    const now = new Date();
    const result = {
      id: Date.now(),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      total, max, scores
    };

    _thread.results.push(result);
    ResultCard.showResult($('result-area'), result);
    Sidebar.render(_thread);
    Sidebar.open();

    btn.disabled = false;
    btn.textContent = 'Grade submission';
    $('submission-text').value = '';
  });
}
