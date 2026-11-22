# NWU Kano — ICT Departmental Timetable

A small static web app for the Department of ICT, Faculty of Computing,
Northwest University, Kano — Second Semester 2025/2026. Built for the
whole class to use: browse the timetable, add classes to your phone or
desktop calendar, and open each course's lecture materials.

## Structure

```
nwu-ict-timetable/
├── index.html              Main timetable page
├── materials.html          Course materials page (linked from index.html)
├── assets/
│   ├── styles.css          Shared styles for both pages (indigo + marigold theme)
│   ├── courses-data.js     Single source of truth for course/schedule data
│   ├── app.js              Timetable rendering + calendar integration
│   ├── materials.js        Course materials page logic
│   ├── motion.js           Scroll reveals + sliding tab underline
│   ├── gradient-ascii.js   React Bits GradientASCII, ported to plain JS (WebGL2)
│   ├── hero-fx.js          Mounts the GradientASCII light in the header
│   ├── exam-countdown.js   Days-to-exams bar, synced to the Lagos date
│   ├── tests-data.js       Upcoming tests and CA tests (edit this to add one)
│   ├── exams-data.js       Our papers from the exam timetable
│   ├── schedule.js         Renders tests + exams, one-off calendar events
│   ├── announcements-data.js   Editable list of announcements
│   ├── announcements.js    Popup, bell panel, and share logic
│   ├── nwu-crest.png       University crest
│   ├── ug-chip.png         UG24·ICT class symbol (footer)
│   ├── favicon-32.png
│   ├── favicon-64.png
│   └── apple-touch-icon.png
└── materials/
    ├── COS202/
    │   ├── manifest.json    Lists this course's material files
    │   ├── README.md        How to add materials for this course
    │   └── (your PDFs go here)
    ├── GST212/
    ├── IFT212/
    ├── INS202/
    ├── INS204/
    └── MTH202/
```

## Running it locally

Because `materials.html` fetches each course's `manifest.json` with
`fetch()`, the site needs to be served over `http://`, not opened
directly as a `file://` path (browsers block that fetch for local
files). Any static server works, for example:

```bash
# from inside the nwu-ict-timetable folder
python3 -m http.server 8000
# then open http://localhost:8000
```

In Antigravity (or VS Code, etc.), use its built-in "Open with Live
Server" / preview feature on `index.html` instead of double-clicking
the file.

## Posting an announcement

Announcements live in one file: `assets/announcements-data.js`. To post
a new one, add an object to the `ANNOUNCEMENTS` array:

```js
{
  id: "2026-10-01-exam-timetable",   // unique, never reuse
  title: "Exam timetable released",
  excerpt: "Check the new dates for CBT and theory papers this semester.",
  url: "https://your-blog.example.com/exam-timetable",
  date: "2026-10-01",
  active: true
}
```

- The **newest active announcement** a visitor hasn't seen yet pops up
  automatically (once per device, remembered via `localStorage`) and
  links out to `url` when they tap "Read more".
- The bell icon (top-right of the header) opens a panel listing
  **every** active announcement, each with its own "share" and "open"
  buttons — this is where older announcements stay reachable.
- Set `active: false` to retire an announcement without deleting it
  (useful for keeping a history in the same file).
- Sharing uses the device's native share sheet (`navigator.share`) on
  phones, and falls back to copying the link to the clipboard on
  desktop browsers that don't support it.

## Adding course materials

1. Drop the PDF(s) for a course into `materials/<COURSE CODE>/`.
2. Open that folder's `manifest.json` and add one entry per file:

   ```json
   {
     "course": "COS202",
     "title": "Computer Programming II",
     "materials": [
       {
         "title": "Lecture 1: Introduction",
         "file": "lecture-01.pdf",
         "type": "pdf",
         "source": "lecturer",
         "by": "Lecturer's name",
         "note": "Optional short note shown under the title",
         "pages": 12,
         "size": 345678
       }
     ]
   }
   ```
3. Add the same entry to that course's `materials` list in
   `assets/courses-data.js` (used as a fallback when the manifest can't be
   fetched, e.g. when the page is opened as a `file://`).

- `source: "lecturer"` puts the file under **Given by the lecturer** with a
  "Given by lecturer" badge. Anything else (or no `source`) is listed under
  **Other materials**.
- `by`, `note`, `pages` and `size` (bytes) are optional.
- `file` must match the filename in the folder exactly.

COS202 currently uses the COS201 lecture notes, as the lecturer directed.

## Exam timetable

Our six papers live in `assets/exams-data.js`, taken from the university's
tentative exam timetable. If a revised timetable comes out, edit the dates,
times or venues there. Each paper has its own "Add to calendar" button, and
"Add all to calendar" adds every paper still to come in one file.

## Upcoming tests

Add a test to `assets/tests-data.js` (the list is empty now; there's an example in the file) (code, kind, date, start/end hour,
venue). It shows under "Upcoming tests" on the home page with its own
"Add to calendar" button (reminders 1 day, 1 hour and 30 minutes before),
tags the course row, and disappears once it has ended.

## Exam countdown

`assets/exam-countdown.js` counts down to the first exam day in Lagos time and
rolls over at midnight on its own. Change `EXAM_START` there (currently
30 November 2026) and the two labels under the bar in `index.html` if the
date moves.

## Header animation

The header light is React Bits' GradientASCII, ported to plain JavaScript so
no build step or React is needed. Its colours and shape are set in
`assets/hero-fx.js`. If a device has no WebGL2, the circuit-trace animation
shows instead.

## Updating the schedule

All course/schedule data lives in one place:
`assets/courses-data.js`. Edit the `COURSES` array there — both
`index.html` and `materials.html` read from it.

## Calendar integration

Tapping **Add to calendar** hands the event off to whatever calendar
app is available on the device instead of downloading a file:

- **Safari (iOS/macOS)** — opens a same-origin Blob URL with MIME type
  `text/calendar`, which Safari recognises and opens directly in the
  Calendar app's "Add Event" screen. (An earlier version used a
  `data:` URI here, which modern Safari blocks for top-level
  navigation — the Blob URL approach fixes that.)
- **Everything else (Android, desktop Chrome/Firefox/Edge)** — opens
  Google Calendar's "add event" page in a new tab, pre-filled with the
  course details and a weekly recurrence.

Each event recurs weekly through **30 November 2026** and — where the
calendar app supports it — includes reminders 1 day, 1 hour, and 30
minutes before class.

## Credits

Developed by ƏҺmӘгDi.
