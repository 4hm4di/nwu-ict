// Upcoming tests and CA tests. Add new ones here; each shows on the home page
// under "Upcoming tests" with its own "Add to calendar" button and disappears
// once it has ended. The section hides itself when this list is empty.
//
// Fields (same as exams-data.js):
//   id     — unique, never reused
//   code   — course code (links the test to its course row)
//   kind   — "Test", "CA test", etc.
//   title  — course title
//   date   — "YYYY-MM-DD" (Lagos)
//   start, end — 24-hour clock, Lagos time (decimals allowed, e.g. 13.5 = 1:30pm)
//   venue  — where it holds
//   note   — optional short line
//
// Example:
//   { id: 'ins204-ca-2026-11-21', code: 'INS204', kind: 'CA test',
//     title: 'System Analysis and Design', date: '2026-11-21',
//     start: 8, end: 10, venue: '7th Floor, City Campus', note: 'Be punctual.' }

const TESTS = [];

if (typeof window !== 'undefined') {
  window.TESTS = TESTS;
}
