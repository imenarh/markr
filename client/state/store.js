const _listeners = {};

export const state = {
  threads: [
    {
      id: 1, name: "COMP101 — Essay Submissions", date: "Mar 20, 2026",
      criteria: [
        { id: 1, name: "Argument Quality", desc: "Central argument is clear, specific, and maintained throughout", pts: 20 },
        { id: 2, name: "Evidence & Sources", desc: "Credible sources cited and used effectively", pts: 20 },
        { id: 3, name: "Structure & Flow", desc: "Logical organization with clear intro, body, and conclusion", pts: 15 },
        { id: 4, name: "Writing Clarity", desc: "Sentence-level clarity, grammar, and consistent academic tone", pts: 10 }
      ],
      results: [
        {
          id: 1, date: "Mar 22", time: "14:32", total: 52, max: 65,
          scores: [
            { n: "Argument Quality", s: 16, m: 20, fb: "Strong central claim. Supporting reasoning in paragraphs 2–3 could be more specific." },
            { n: "Evidence & Sources", s: 14, m: 20, fb: "Good use of primary sources. Two citations missing page numbers in section 3." },
            { n: "Structure & Flow", s: 13, m: 15, fb: "Well-organized overall. Minor topic overlap between body paragraphs 2 and 4." },
            { n: "Writing Clarity", s: 9, m: 10, fb: "Excellent academic tone. One run-on sentence in paragraph 5." }
          ]
        },
        {
          id: 2, date: "Mar 23", time: "09:15", total: 44, max: 65,
          scores: [
            { n: "Argument Quality", s: 11, m: 20, fb: "Argument present but underdeveloped. Needs a more explicit thesis statement." },
            { n: "Evidence & Sources", s: 10, m: 20, fb: "Sources exist but over-reliance on one reference. Broader evidence base needed." },
            { n: "Structure & Flow", s: 13, m: 15, fb: "Well-organized with clear transitions between all sections." },
            { n: "Writing Clarity", s: 10, m: 10, fb: "Excellent sentence construction and academic tone throughout." }
          ]
        }
      ]
    },
    {
      id: 2, name: "Data Structures — Final Project", date: "Mar 18, 2026",
      criteria: [
        { id: 1, name: "Correctness", desc: "Algorithm produces correct output for all test cases including edge cases", pts: 30 },
        { id: 2, name: "Time Complexity", desc: "Optimal complexity achieved and clearly justified", pts: 25 },
        { id: 3, name: "Code Quality", desc: "Readable, well-commented, properly structured code", pts: 20 }
      ],
      results: []
    },
    {
      id: 3, name: "Networks — Lab Report", date: "Mar 15, 2026",
      criteria: [
        { id: 1, name: "Methodology", desc: "Experimental setup and procedure clearly described", pts: 25 },
        { id: 2, name: "Data Analysis", desc: "Data interpreted correctly with appropriate depth", pts: 25 },
        { id: 3, name: "Conclusion", desc: "Findings connect to theory with limitations acknowledged", pts: 20 }
      ],
      results: [
        {
          id: 1, date: "Mar 16", time: "11:04", total: 58, max: 70,
          scores: [
            { n: "Methodology", s: 22, m: 25, fb: "Setup well described. Minor gap in variable control explanation." },
            { n: "Data Analysis", s: 20, m: 25, fb: "Solid quantitative work. Anomaly in trial 3 noted but unexplained." },
            { n: "Conclusion", s: 16, m: 20, fb: "Strong theory connection. Limitations section too brief." }
          ]
        }
      ]
    }
  ],
  thread: null,
  parsed: [],
};

export function on(event, fn) {
  (_listeners[event] ??= []).push(fn);
}

export function emit(event, data) {
  (_listeners[event] ?? []).forEach(fn => fn(data));
}
