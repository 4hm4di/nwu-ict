// Generated from the materials folders. Single source of truth for course,
// schedule and material data; each materials/<CODE>/manifest.json mirrors
// the "materials" list below.
//
// dow: JS getUTCDay convention, 0=Sun ... 6=Sat
// material.source: "lecturer" = given by the lecturer, "other" = materials that were on the site before
const COURSES = [
  {
    "code": "COS202",
    "title": "Computer Programming II",
    "unit": 3,
    "dow": 4,
    "dayLabel": "Thursday",
    "startHour": 10,
    "endHour": 12,
    "venue": "7th Floor SCIR18, City Campus",
    "materialsDir": "COS202",
    "materials": [
      {
        "title": "COS201 Computer Programming I lecture notes",
        "file": "COS201 Computer Programming I - Lecture Notes.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Aminu Abdulkadir Mahmoud and others",
        "note": "The lecturer said to use the COS201 lecture notes for COS202.",
        "pages": 329,
        "size": 2000833
      }
    ]
  },
  {
    "code": "GST212",
    "title": "Philosophy, Logic and Human Existence",
    "unit": 2,
    "dow": 5,
    "dayLabel": "Friday",
    "startHour": 8,
    "endHour": 10,
    "venue": "Science Theatre B, Main Campus",
    "materialsDir": "GST212",
    "materials": [
      {
        "title": "Lecture 1: Meaning and nature of philosophy",
        "file": "GST212 - Lecture 1 - Meaning and Nature of Philosophy.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 4,
        "size": 333788
      },
      {
        "title": "Lecture 2: Branches of philosophy",
        "file": "GST212 - Lecture 2 - Branches of Philosophy.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 6,
        "size": 330147
      },
      {
        "title": "Lecture 3: Problems of philosophy",
        "file": "GST212 - Lecture 3 - Problems of Philosophy.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 4,
        "size": 315810
      },
      {
        "title": "Lecture 4: Logic",
        "file": "GST212 - Lecture 4 - Logic.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 6,
        "size": 423033
      },
      {
        "title": "Lecture 5: Logic's vocabulary",
        "file": "GST212 - Lecture 5 - Logics Vocabulary.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 6,
        "size": 428300
      },
      {
        "title": "Lecture 6: Syllogism",
        "file": "GST212 - Lecture 6 - Syllogism.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 4,
        "size": 660322
      },
      {
        "title": "Lecture 7: Fallacy",
        "file": "GST212 - Lecture 7 - Fallacy.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 6,
        "size": 1052247
      },
      {
        "title": "Lecture 8: Philosophy and politics",
        "file": "GST212 - Lecture 8 - Philosophy and Politics.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 4,
        "size": 790655
      },
      {
        "title": "Lecture 9: Philosophy and human conduct",
        "file": "GST212 - Lecture 9 - Philosophy and Human Conduct.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Saheed Olanrewaju Jabaar, PhD",
        "pages": 4,
        "size": 724289
      },
      {
        "title": "Introduction to philosophy past questions",
        "file": "INTRODUCTION TO PHILOSOPHY PASS QUESTION .pdf",
        "type": "pdf",
        "source": "other",
        "pages": 5,
        "size": 2945295
      }
    ]
  },
  {
    "code": "IFT212",
    "title": "Computer Architecture and Organisation",
    "unit": 2,
    "dow": 2,
    "dayLabel": "Tuesday",
    "startHour": 8,
    "endHour": 10,
    "venue": "7th Floor SCIR18, City Campus",
    "materialsDir": "IFT212",
    "materials": [
      {
        "title": "Computer Architecture and Organisation lecture notes",
        "file": "IFT212 - Computer Architecture and Organisation Notes.pdf",
        "type": "pdf",
        "source": "lecturer",
        "by": "Ibrahim Isah Nayaya",
        "pages": 60,
        "size": 1463421
      },
      {
        "title": "ICT212 Computer Architecture & Organisation",
        "file": "ICT212 - Computer Architecture & Organisation.pdf",
        "type": "pdf",
        "source": "other",
        "pages": 27,
        "size": 1000205
      }
    ]
  },
  {
    "code": "INS202",
    "title": "Human-Computer Interface",
    "unit": 2,
    "dow": 2,
    "dayLabel": "Tuesday",
    "startHour": 10,
    "endHour": 12,
    "venue": "SCIR18, City Campus",
    "materialsDir": "INS202",
    "materials": [
      {
        "title": "Principles of user interface design",
        "file": "INS202 - Principles of User Interface Design.pdf",
        "type": "pdf",
        "source": "lecturer",
        "pages": 9,
        "size": 219240
      },
      {
        "title": "Principles of GUI",
        "file": "INS202 - Principles of GUI.pdf",
        "type": "pdf",
        "source": "lecturer",
        "pages": 11,
        "size": 249678
      },
      {
        "title": "ITC2308 Human Computer Interface lecture note",
        "file": "ITC2308 - Human Computer Interface lecture Note.pdf",
        "type": "pdf",
        "source": "other",
        "pages": 51,
        "size": 664616
      }
    ]
  },
  {
    "code": "INS204",
    "title": "System Analysis and Design",
    "unit": 3,
    "dow": 4,
    "dayLabel": "Thursday",
    "startHour": 8,
    "endHour": 10,
    "venue": "7th Floor SCIR18, City Campus",
    "materialsDir": "INS204",
    "materials": [
      {
        "title": "System Analysis and Design, modules 1 to 5",
        "file": "INS204 - System Analysis and Design - Modules 1-5.pdf",
        "type": "pdf",
        "source": "lecturer",
        "pages": 36,
        "size": 992085
      },
      {
        "title": "Use case diagram",
        "file": "INS204 - Use Case Diagram.pdf",
        "type": "pdf",
        "source": "lecturer",
        "pages": 6,
        "size": 527116
      },
      {
        "title": "Activity diagram",
        "file": "INS204 - Activity Diagram.pdf",
        "type": "pdf",
        "source": "lecturer",
        "pages": 22,
        "size": 594974
      },
      {
        "title": "E-R (entity relationship) diagram",
        "file": "INS204 - E-R Diagram.pdf",
        "type": "pdf",
        "source": "lecturer",
        "note": "Converted from the lecturer’s PowerPoint slides so it opens on any phone.",
        "pages": 16,
        "size": 2105773
      },
      {
        "title": "INS204 past questions",
        "file": "INS204__PQ.pdf",
        "type": "pdf",
        "source": "other",
        "pages": 9,
        "size": 1148688
      },
      {
        "title": "In-class assignment",
        "file": "In-Class Assignment_INS204.pdf",
        "type": "pdf",
        "source": "other",
        "pages": 1,
        "size": 7916
      }
    ]
  },
  {
    "code": "MTH202",
    "title": "Elementary Differential Equations",
    "unit": 2,
    "dow": 3,
    "dayLabel": "Wednesday",
    "startHour": 12,
    "endHour": 14,
    "venue": "Faculty of Science Hall 4, Main Campus",
    "materialsDir": "MTH202",
    "materials": [
      {
        "title": "Elementary Differential Equations lecture notes",
        "file": "MTH202 - Elementary Differential Equations Notes.pdf",
        "type": "pdf",
        "source": "lecturer",
        "pages": 75,
        "size": 1385725
      },
      {
        "title": "D.E. MTH2302",
        "file": "D.E Mth2302.pdf",
        "type": "pdf",
        "source": "other",
        "pages": 75,
        "size": 9509100
      },
      {
        "title": "Differential equations",
        "file": "DIFFERENTIAL EQUATIONS.pdf",
        "type": "pdf",
        "source": "other",
        "pages": 97,
        "size": 9368374
      }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.COURSES = COURSES;
}
