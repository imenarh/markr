# Markr

A web-based AI tool for grading submissions against a predefined rubric. Each criterion is evaluated independently by the AI, returning consistent scores and feedback every time.

> Built for students who want structured feedback on their work before submitting.

## How it works

- Create a grading thread and paste your rubric text — Markr parses it into structured criteria
- The rubric is locked once the thread is created
- Paste any submission and click Grade — one AI call per criterion
- Scores and feedback are saved to the thread and accessible from the history sidebar

## Running locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

For auto-reload while editing the server entrypoint:

```bash
npm run dev
```

## Notes

`server/ai.js`, `server/auth.js`, and `server/db.js` are placeholders right now.
