// Add a new announcement by adding an object to the TOP of this array.
// Newest "date" wins for what shows in the popup — order in the array
// doesn't matter, but keeping newest-first here makes it easier to read.
//
// Fields:
//   id      — unique, never reused (used to remember "already seen" per device)
//   title   — short headline shown in the popup and the announcements list
//   excerpt — one or two sentences of preview text
//   url     — the blog post / page this announcement links to
//   date    — "YYYY-MM-DD", used only to pick the newest for the popup
//   active  — set to false to hide an announcement without deleting it
//   action  — optional button label (defaults to "Read more")

const ANNOUNCEMENTS = [
  {
    id: "2026-11-26-final-exam-timetable",
    title: "Final exam timetable: no changes",
    excerpt: "The final timetable is out and our six papers are the same as before: GST212 on Mon 30 Nov through to INS204 on Thu 17 Dec. If you've added them to your calendar, you're set.",
    url: "index.html#exams",
    action: "See the timetable",
    date: "2026-11-26",
    active: true
  },
  {
    id: "2026-11-06-lecturer-materials",
    title: "Lecturer notes added for all six courses",
    excerpt: "Every course page now has the notes given by the lecturer, marked \"Given by lecturer\" and listed first. For COS202, the lecturer said to use the COS201 lecture notes.",
    url: "https://whatsapp.com/channel/0029VbCgrrGFSAt7yRwcVq40",
    date: "2026-11-06",
    active: true
  },
  {
    id: "2026-09-22-mth202-rescheduled",
    title: "MTH202 rescheduled to Wednesday",
    excerpt: "MTH202 (Elementary Differential Equations) has been moved to Wednesday 12pm–2pm at Faculty of Science Hall 4, Main Campus.",
    url: "https://whatsapp.com/channel/0029VbCgrrGFSAt7yRwcVq40",
    date: "2026-09-22",
    active: true
  },
  {
    id: "2026-09-16-timetable-adjusted",
    title: "Timetable updated — 4 courses rescheduled",
    excerpt: "IFT212 → Tue 8–10am, INS204 → Thu 8–10am, COS202 → Thu 10–12pm (all 7th Floor SCIR18), MTH202 → Wed 12–2pm, Faculty of Science Hall 4. This is what was possible to adjust for our convenience.",
    url: "https://whatsapp.com/channel/0029VbCgrrGFSAt7yRwcVq40",
    date: "2026-09-16",
    active: true
  },
  {
    id: "2026-09-16-timetable-complete",
    title: "Timetable is now complete",
    excerpt: "All 6 courses now have a confirmed day, time, and venue — including IFT212, now Thursday 2-4pm at SCIR18, City Campus.",
    url: "https://whatsapp.com/channel/0029VbCgrrGFSAt7yRwcVq40",
    date: "2026-09-15",
    active: true
  },
  {
    id: "2026-09-15-welcome",
    title: "Welcome to the ICT class timetable",
    excerpt: "Bookmark this page — announcements about timetable changes, materials, and SIWES updates will show up here.",
    url: "https://whatsapp.com/channel/0029VbCgrrGFSAt7yRwcVq40",
    date: "2026-09-15",
    active: true
  }
];
