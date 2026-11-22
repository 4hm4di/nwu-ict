# MTH202 — Elementary Differential Equations

Drop this course's lecture notes, slide decks, or other PDF materials into this folder.

For each file you add, add a matching entry to `manifest.json` in this
folder, e.g.:

```json
{
  "course": "MTH202",
  "title": "Elementary Differential Equations",
  "materials": [
    {
      "title": "Lecture 1 — Introduction",
      "file": "lecture-01-introduction.pdf",
      "type": "pdf"
    },
    {
      "title": "Slides — Week 2",
      "file": "slides-week-02.pdf",
      "type": "pdf"
    }
  ]
}
```

- `file` must match the actual filename in this folder exactly.
- `title` is what students see on the "Course material" page.
- `type` is shown as a small label (e.g. PDF); optional.
- `"source": "lecturer"` marks the file as given by the lecturer and lists it first.

The timetable's "Course material" button for MTH202 links straight to
this folder's listing — nothing else needs to change once you update
`manifest.json`.
