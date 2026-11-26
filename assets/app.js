const ICONS = {
  day: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>',
  time: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  venue: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M12 14v4"/><path d="M10 16h4"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>'
};

// COURSES is provided by courses-data.js, loaded before this file.

function fmtHour(h){
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + period;
}

function pad(n){ return n < 10 ? '0' + n : String(n); }

function icsTimestamp(date){
  return date.getUTCFullYear() + pad(date.getUTCMonth()+1) + pad(date.getUTCDate()) + 'T' +
         pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds()) + 'Z';
}

// Nigeria (Africa/Lagos) is a fixed UTC+1, no DST, so Lagos local = UTC + 1h.
function nextOccurrenceUTC(course){
  const nowUTCms = Date.now();
  const lagosNow = new Date(nowUTCms + 60*60*1000); // fields below now represent Lagos wall time
  const lagosDow = lagosNow.getUTCDay();
  let diff = (course.dow - lagosDow + 7) % 7;

  const y = lagosNow.getUTCFullYear(), m = lagosNow.getUTCMonth(), d = lagosNow.getUTCDate();
  const lagosMidnightMs = Date.UTC(y, m, d + diff, 0, 0, 0); // Lagos midnight, expressed in UTC-labelled fields

  const startLagosLabelledMs = lagosMidnightMs + course.startHour * 3600000;
  const endLagosLabelledMs   = lagosMidnightMs + course.endHour * 3600000;

  // convert Lagos-labelled ms back to true UTC by subtracting the 1h offset
  const startUTC = new Date(startLagosLabelledMs - 60*60*1000);
  const endUTC   = new Date(endLagosLabelledMs - 60*60*1000);
  return {startUTC, endUTC};
}

function buildICS(course){
  const {startUTC, endUTC} = nextOccurrenceUTC(course);
  const stamp = new Date();

  const uid = course.code + '-' + Date.now() + '@nwu-kano-ict-timetable';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NWU Kano ICT//Departmental Timetable//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + icsTimestamp(stamp),
    'DTSTART:' + icsTimestamp(startUTC),
    'DTEND:' + icsTimestamp(endUTC),
    'RRULE:FREQ=WEEKLY;UNTIL=20261130T225959Z',
    'SUMMARY:' + course.code + ' • ' + course.title,
    'LOCATION:' + course.venue,
    'DESCRIPTION:' + course.unit + ' unit course. ' + course.dayLabel + ', ' + fmtHour(course.startHour) + '–' + fmtHour(course.endHour) + '. Northwest University, Kano • Dept. of ICT.',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + course.code + ' starts tomorrow',
    'TRIGGER:-P1D',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + course.code + ' starts in 1 hour',
    'TRIGGER:-PT1H',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:' + course.code + ' starts in 30 minutes',
    'TRIGGER:-PT30M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function showToast(msg){
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// Detect the device so we can hand off to whichever calendar app is
// actually available, instead of forcing an .ics download.
function detectDevice(){
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
                (platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS reports as Mac
  const isMac = /Macintosh/.test(ua) && !isIOS;
  const isAndroid = /Android/.test(ua);
  if (isIOS || isMac) return 'apple';
  if (isAndroid) return 'android';
  return 'other';
}

function googleCalendarURL(course){
  // Kept for reference / potential future use, but no longer used by
  // addToCalendar() — Google's quick-add link can't carry the custom
  // 1-day/1-hour/30-minute reminders this app promises, so the .ics
  // Blob approach below is used for every platform instead.
  const {startUTC, endUTC} = nextOccurrenceUTC(course);
  const until = '20261130T235959Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: course.code + ' • ' + course.title,
    dates: icsTimestamp(startUTC) + '/' + icsTimestamp(endUTC),
    details: course.unit + ' unit course. ' + course.dayLabel + ', ' + fmtHour(course.startHour) + '–' + fmtHour(course.endHour) + '. Northwest University, Kano • Dept. of ICT.',
    location: course.venue,
    recur: 'RRULE:FREQ=WEEKLY;UNTIL=' + until
  });
  return 'https://calendar.google.com/calendar/render?' + params.toString();
}

// Every reminder (1 day, 1 hour, 30 minutes before) is baked into the
// .ics file as VALARM entries. Calendar quick-add links (like Google
// Calendar's "render" URL) cannot carry custom reminder offsets at all —
// only a real calendar file can guarantee these fire correctly, so every
// platform uses the same method below rather than splitting by device.
function addToCalendar(course, btn){
  const ics = buildICS(course);
  const blob = new Blob([ics], {type: 'text/calendar;charset=utf-8'});
  const blobUrl = URL.createObjectURL(blob);

  showToast(course.code + ': opening with reminders 1 day, 1 hour, and 30 minutes before class…');

  // A same-origin Blob URL (unlike a "data:" URL) is not blocked for
  // top-level navigation, and browsers that recognise "text/calendar"
  // hand it straight to the device's calendar app. Browsers that don't
  // render it inline will download the .ics instead — opening that
  // download still imports the event with all three reminders intact.
  window.location.href = blobUrl;
  setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

  if (btn){
    btn.style.transform = 'scale(0.94)';
    setTimeout(() => btn.style.transform = '', 140);
  }
}

function goToMaterials(course){
  window.location.href = 'materials.html?course=' + encodeURIComponent(course.code);
}

const DAY_NAMES = {2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday'};
const LECTURES_END_UTC = Date.UTC(2026, 10, 30, 23, 0, 0); // end of 30 Nov 2026, Lagos

// Current Lagos wall-clock as {dow, hour (fractional)}; Lagos is fixed UTC+1.
function lagosNow(){
  const d = new Date(Date.now() + 3600000);
  return { dow: d.getUTCDay(), hour: d.getUTCHours() + d.getUTCMinutes() / 60, date: d };
}

// The class happening now, or the next one coming up this week/next week.
function findNextClass(){
  if (Date.now() > LECTURES_END_UTC) return null;
  const now = lagosNow();
  let best = null;
  COURSES.forEach(c => {
    if (c.dow === null) return;
    let daysAway = (c.dow - now.dow + 7) % 7;
    let live = false;
    if (daysAway === 0){
      if (now.hour >= c.endHour) daysAway = 7;
      else if (now.hour >= c.startHour) live = true;
    }
    const score = daysAway * 24 + c.startHour;
    if (!best || score < best.score) best = { course: c, daysAway, live, score };
  });
  if (best){
    const start = nextOccurrenceUTC(best.course).startUTC.getTime();
    if (!best.live && start > LECTURES_END_UTC) return null;
  }
  return best;
}

function whenLabel(n){
  const c = n.course;
  const time = fmtHour(c.startHour) + '–' + fmtHour(c.endHour);
  if (n.live) return 'Happening now, until ' + fmtHour(c.endHour);
  if (n.daysAway === 0) return 'Today, ' + time;
  if (n.daysAway === 1) return 'Tomorrow, ' + time;
  return c.dayLabel + ', ' + time + ' (in ' + n.daysAway + ' days)';
}

function renderNextCard(next){
  const el = document.getElementById('nextCard');
  if (!el) return;
  if (!next){
    el.innerHTML = '<p class="next-when">Lectures have ended</p><p class="next-what">That was the last week of lectures for the semester.</p>';
    return;
  }
  const c = next.course;
  el.innerHTML = `
    <p class="next-when"><span class="live-dot" aria-hidden="true"></span>${next.live ? 'Now' : 'Next class'}: ${whenLabel(next)}</p>
    <p class="next-what">${c.code} ${c.title}</p>
    <p class="next-where">${c.venue}</p>`;
}

// Lecture timetable folds away while exams are the focus. The visitor's
// choice is remembered on their device.
const lectures = document.getElementById('lectures');
const lecturesToggle = document.getElementById('lecturesToggle');
const lecturesBody = document.getElementById('lecturesBody');
const LECTURES_KEY = 'nwu_ict_lectures_open';

function setLectures(open, animate){
  if (!lectures) return;
  const reduce = window.Motion && Motion.reduce;
  if (!animate || reduce) lectures.classList.add('instant');
  lectures.classList.toggle('open', open);
  lectures.classList.remove('settled');
  lecturesToggle.setAttribute('aria-expanded', String(open));
  if (open) lecturesBody.removeAttribute('inert'); else lecturesBody.setAttribute('inert', '');
  try { localStorage.setItem(LECTURES_KEY, open ? '1' : '0'); } catch (e) {}
  const settle = () => {
    lectures.classList.remove('instant');
    if (lectures.classList.contains('open')) {
      lectures.classList.add('settled'); // lets glows and highlights spill past the edges
      if (window.Motion) Motion.moveIndicator(tabsEl, tabsEl.querySelector('.tab.active'), false);
    }
  };
  if (!animate || reduce) { requestAnimationFrame(settle); return; }
  clearTimeout(lectures._t);
  lectures._t = setTimeout(settle, 340);
}

if (lecturesToggle) lecturesToggle.addEventListener('click', () => {
  setLectures(!lectures.classList.contains('open'), true);
});

// Highlight a course row once the page has finished scrolling to it.
function focusRow(row){
  if (!row) return;
  if (lectures && lectures.contains(row) && !lectures.classList.contains('open')) {
    setLectures(true, true);
    setTimeout(() => focusRow(row), 360);
    return;
  }
  const reduce = window.Motion && Motion.reduce;
  const play = () => {
    row.classList.remove('focus');
    void row.offsetWidth; // restart the animation if tapped twice
    row.classList.add('focus');
    clearTimeout(row._focusTimer);
    row._focusTimer = setTimeout(() => row.classList.remove('focus'), 2300);
  };
  const rect = row.getBoundingClientRect();
  const inView = rect.top >= 0 && rect.bottom <= window.innerHeight;
  row.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  if (inView || reduce) { play(); return; }
  let done = false;
  const finish = () => { if (done) return; done = true; window.removeEventListener('scrollend', finish); play(); };
  if ('onscrollend' in window) window.addEventListener('scrollend', finish, { once: true });
  setTimeout(finish, 900); // fallback for browsers without scrollend
}

function rowHTML(c, next){
  const isTba = c.dow === null;
  const isNext = next && next.course.code === c.code;
  const metaHtml = isTba
    ? `<div class="meta"><span>${ICONS.day}${c.dayLabel}</span></div>`
    : `<div class="meta">
         <span>${ICONS.day}${c.dayLabel}</span>
         <span>${ICONS.time}${fmtHour(c.startHour)}–${fmtHour(c.endHour)}</span>
         <span>${ICONS.venue}${c.venue}</span>
       </div>`;
  const count = Array.isArray(c.materials) ? c.materials.length : 0;
  return `
    <span class="row-focus" aria-hidden="true"></span>
    <div class="row-main">
      <div class="code-line">
        <span class="code">${c.code}</span>
        <span class="unit">${c.unit} unit${c.unit > 1 ? 's' : ''}</span>
        ${isNext ? `<span class="next-tag"><span class="live-dot" aria-hidden="true"></span>${next.live ? 'Happening now' : 'Next class'}</span>` : ''}
      </div>
      <div class="title">${c.title}</div>
      ${metaHtml}
    </div>
    <div class="row-action">
      ${isTba
        ? `<button class="btn" disabled>${ICONS.cal} Schedule TBA</button>`
        : `<button class="btn" data-code="${c.code}">${ICONS.cal} Add to calendar</button>`}
      <button class="btn btn-secondary" data-materials="${c.code}">${ICONS.folder} Materials<span class="material-count" id="matcount-${c.code}">${count ? ' (' + count + ')' : ''}</span></button>
    </div>`;
}

// mode: 'initial' (scroll reveal) or 'swap' (tab change, staggered entrance)
function render(filter, mode){
  const list = document.getElementById('list');
  list.innerHTML = '';
  const sorted = [...COURSES].sort((a, b) => {
    const da = a.dow === null ? 99 : a.dow;
    const db = b.dow === null ? 99 : b.dow;
    if (da !== db) return da - db;
    return (a.startHour || 0) - (b.startHour || 0);
  });
  let shown = 0;
  sorted.forEach(c => {
    const matches = filter === 'all' || (filter === 'tba' && c.dow === null) || String(c.dow) === filter;
    const row = document.createElement('div');
    row.className = 'row' + (matches ? '' : ' hidden') + (_next && _next.course.code === c.code ? ' is-next' : '');
    row.id = 'course-' + c.code;
    row.innerHTML = rowHTML(c, _next);
    if (matches){
      if (mode === 'swap'){ row.classList.add('enter'); row.style.setProperty('--d', (shown * 45) + 'ms'); }
      else { row.classList.add('reveal'); row.style.setProperty('--d', (Math.min(shown, 3) * 60) + 'ms'); }
      shown++;
    }
    list.appendChild(row);
  });
  if (mode !== 'swap' && window.Motion) Motion.observe(list.querySelectorAll('.row.reveal'));

  list.querySelectorAll('button[data-code]').forEach(btn => {
    btn.addEventListener('click', () => addToCalendar(COURSES.find(c => c.code === btn.dataset.code), btn));
  });
  list.querySelectorAll('button[data-materials]').forEach(btn => {
    btn.addEventListener('click', () => goToMaterials(COURSES.find(c => c.code === btn.dataset.materials)));
  });

  refreshMaterialCounts();
  if (window.tagTestCourses) window.tagTestCourses();
}

// Keeps the count in step with each folder's manifest.json, falling back
// to the COURSES data when the fetch is blocked (e.g. file://).
function refreshMaterialCounts(){
  COURSES.forEach(c => {
    const badge = document.getElementById('matcount-' + c.code);
    if (!badge) return;
    fetch('materials/' + encodeURIComponent(c.materialsDir) + '/manifest.json', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.materials)) badge.textContent = data.materials.length ? ' (' + data.materials.length + ')' : '';
      })
      .catch(() => {});
  });
}

const tabsEl = document.getElementById('tabs');
let _swapTimer = null;

function setFilter(tab, animate){
  if (!tab) return;
  tabsEl.querySelectorAll('.tab').forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', t === tab); });
  if (window.Motion) Motion.moveIndicator(tabsEl, tab, animate);
  const list = document.getElementById('list');
  clearTimeout(_swapTimer);
  if (!animate || (window.Motion && Motion.reduce)){
    list.classList.remove('leaving');
    render(tab.dataset.day, 'swap');
    return;
  }
  // quick exit, then staggered entrance
  list.classList.add('leaving');
  _swapTimer = setTimeout(() => {
    list.classList.remove('leaving');
    render(tab.dataset.day, 'swap');
  }, 120);
}

tabsEl.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab || tab.classList.contains('active')) return;
  setFilter(tab, true);
});
window.addEventListener('resize', () => {
  if (window.Motion) Motion.moveIndicator(tabsEl, tabsEl.querySelector('.tab.active'), false);
});

function renderPaperCard(paper){
  const el = document.getElementById('nextCard');
  if (!el) return false;
  const e = paper.exam;
  const live = paper.when === 'Happening now';
  el.innerHTML = `
    <p class="next-when"><span class="live-dot" aria-hidden="true"></span>${live ? 'Happening now' : 'Next paper: ' + paper.label + ' (' + paper.when.toLowerCase() + ')'}</p>
    <p class="next-what"><a href="#${e.id}">${e.code} ${e.title}</a></p>
    <p class="next-where">${e.venue}</p>`;
  return true;
}

const _next = findNextClass();
render('all', 'initial');
// schedule.js loads after this file, so pick the card once everything is in.
document.addEventListener('DOMContentLoaded', () => {
  const paper = window.nextPaper && window.nextPaper();
  if (!(paper && renderPaperCard(paper))) renderNextCard(_next);
});

let lecturesOpen = false;
try { lecturesOpen = localStorage.getItem(LECTURES_KEY) === '1'; } catch (e) {}
setLectures(lecturesOpen, false);
if (/^#course-[A-Z0-9]+$/.test(location.hash)) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) setTimeout(() => focusRow(target), 400);
}
if (window.Motion) {
  Motion.moveIndicator(tabsEl, tabsEl.querySelector('.tab.active'), false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => Motion.moveIndicator(tabsEl, tabsEl.querySelector('.tab.active'), false));
}
