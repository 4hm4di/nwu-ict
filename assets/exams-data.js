// Second semester 2025/2026 examinations: our six papers, taken from the
// university's FINAL examinations timetable (checked 26 Nov 2026; no changes
// from the tentative one).
//
// Same fields as tests-data.js. Times are Lagos time, 24-hour clock.
// (The tentative PDF printed GST212's date as "Mon 30th DEC"; the final one
// corrects it to 30th NOV.)

const EXAMS = [
  {
    id: 'exam-gst212-2026-11-30',
    code: 'GST212', kind: 'Exam',
    title: 'Philosophy, Logic and Human Existence',
    date: '2026-11-30', start: 11.5, end: 14.5,
    venue: '7th & 8th Floors (Faculty of Computing)'
  },
  {
    id: 'exam-ins202-2026-12-01',
    code: 'INS202', kind: 'Exam',
    title: 'Human-Computer Interface',
    date: '2026-12-01', start: 15, end: 18,
    venue: '5th & 8th Floors'
  },
  {
    id: 'exam-ift212-2026-12-04',
    code: 'IFT212', kind: 'Exam',
    title: 'Computer Architecture and Organisation',
    date: '2026-12-04', start: 8, end: 11,
    venue: 'MST A, B & C, MAT'
  },
  {
    id: 'exam-cos202-2026-12-09',
    code: 'COS202', kind: 'Exam',
    title: 'Computer Programming II',
    date: '2026-12-09', start: 11.5, end: 14.5,
    venue: '1st, 3rd, 4th, 5th, 7th & 8th Floors'
  },
  {
    id: 'exam-mth202-2026-12-12',
    code: 'MTH202', kind: 'Exam',
    title: 'Elementary Differential Equations',
    date: '2026-12-12', start: 8, end: 11,
    venue: 'SMT, MAT, MST A–C, ICAN Theatre, FEDU & FSMS Theatres, SC-BMS Rooms, Sci-Theatres, FCOMM & DAP Rooms, II LC Sci & Edu'
  },
  {
    id: 'exam-ins204-2026-12-17',
    code: 'INS204', kind: 'Exam',
    title: 'System Analysis and Design',
    date: '2026-12-17', start: 11.5, end: 14.5,
    venue: '5th, 7th & 8th Floors'
  }
];

if (typeof window !== 'undefined') {
  window.EXAMS = EXAMS;
}
