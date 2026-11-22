const ICONS_M = {
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
  day: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>',
  time: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  venue: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>'
};

function getCourseCode(){
  const params = new URLSearchParams(window.location.search);
  return (params.get('course') || '').toUpperCase();
}

function fmtBytes(bytes){
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function fmtHourM(h){
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + period;
}

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

function getAllCourses(){
  if (typeof COURSES !== 'undefined') return COURSES;
  if (typeof window !== 'undefined' && window.COURSES) return window.COURSES;
  return [];
}

async function loadManifest(code){
  try {
    const res = await fetch('materials/' + encodeURIComponent(code) + '/manifest.json', { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (err) {
    // fetch blocked (file:// or offline): fall back to COURSES data below
  }
  const course = getAllCourses().find(c => c.code === code || c.materialsDir === code);
  if (course && course.materials) {
    return { course: course.code, title: course.title, materials: course.materials };
  }
  throw new Error('manifest not found');
}

function renderHeader(code, course){
  document.getElementById('courseCode').textContent = code ? code + ' course materials' : '';
  document.getElementById('courseTitle').textContent = course ? course.title : 'Course materials';
  document.title = code + ' materials • Northwest University, Kano';
  const sub = document.getElementById('courseSub');
  if (course){
    sub.innerHTML =
      `<span>${course.unit} unit${course.unit > 1 ? 's' : ''}</span>` +
      (course.dow !== null
        ? `<span>${ICONS_M.day}${esc(course.dayLabel)}</span>` +
          `<span>${ICONS_M.time}${fmtHourM(course.startHour)}–${fmtHourM(course.endHour)}</span>` +
          `<span>${ICONS_M.venue}${esc(course.venue)}</span>`
        : '');
  }

  const sw = document.getElementById('switcher');
  sw.querySelectorAll('a').forEach(a => a.remove());
  getAllCourses().forEach(c => {
    const a = document.createElement('a');
    a.href = 'materials.html?course=' + encodeURIComponent(c.code);
    a.textContent = c.code;
    a.title = c.title;
    if (c.code === code) a.setAttribute('aria-current', 'page');
    sw.appendChild(a);
  });
  const active = sw.querySelector('[aria-current="page"]');
  if (window.Motion && active){
    Motion.moveIndicator(sw, active, false);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => Motion.moveIndicator(sw, active, false));
    window.addEventListener('resize', () => Motion.moveIndicator(sw, active, false));
  }
}

function materialCard(m, code, i){
  const href = 'materials/' + encodeURIComponent(code) + '/' + encodeURIComponent(m.file);
  const isLecturer = m.source === 'lecturer';
  const meta = [];
  if (isLecturer) meta.push(`<span class="m-given">${ICONS_M.check}Given by the lecturer</span>`);
  if (m.pages) meta.push(`<span>${m.pages} page${m.pages > 1 ? 's' : ''}</span>`);
  if (m.size) meta.push(`<span>${fmtBytes(m.size)}</span>`);
  if (m.by) meta.push(`<span>${esc(m.by)}</span>`);
  if (m.date) meta.push(`<span>${esc(m.date)}</span>`);
  return `
    <div class="material-card reveal" style="--d:${Math.min(i, 5) * 50}ms">
      <div class="material-icon">${ICONS_M.pdf}</div>
      <div class="material-info">
        <div class="m-title">${esc(m.title || m.file)}</div>
        <div class="m-meta">${meta.join('')}</div>
        ${m.note ? `<p class="m-note">${esc(m.note)}</p>` : ''}
      </div>
      <a class="btn ${isLecturer ? '' : 'btn-quiet'} material-open" href="${href}" target="_blank" rel="noopener">${ICONS_M.open}Open</a>
    </div>`;
}

function section(cls, heading, intro, items, code){
  if (!items.length) return '';
  return `
    <section class="mat-section ${cls}">
      <h2 class="reveal">${heading}</h2>
      ${intro ? `<p class="mat-section-intro reveal" style="--d:60ms">${intro}</p>` : ''}
      <div class="material-list">${items.map((m, i) => materialCard(m, code, i)).join('')}</div>
    </section>`;
}

function renderMaterials(materials, code){
  const list = document.getElementById('materialList');
  const empty = document.getElementById('emptyState');

  if (!materials || materials.length === 0){
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const lecturer = materials.filter(m => m.source === 'lecturer');
  const other = materials.filter(m => m.source !== 'lecturer');
  list.innerHTML =
    section('lecturer', 'Given by the lecturer', lecturer.length + ' file' + (lecturer.length > 1 ? 's' : '') + ' handed out for this course.', lecturer, code) +
    section('other', lecturer.length ? 'Other materials' : 'Materials',
            other.length + ' file' + (other.length > 1 ? 's' : '') + (lecturer.length ? ' shared earlier, useful for revision.' : ''),
            other, code);
  if (window.Motion) Motion.observe(list.querySelectorAll('.reveal'));
  else list.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

async function init(){
  const code = getCourseCode();
  if (!code){
    renderHeader('', null);
    document.getElementById('courseTitle').textContent = 'No course selected';
    document.getElementById('courseSub').textContent = 'Go back to the timetable and pick a course.';
    document.getElementById('emptyState').style.display = 'block';
    return;
  }

  const course = getAllCourses().find(c => c.code === code);
  renderHeader(code, course);

  try {
    const manifest = await loadManifest(code);
    renderMaterials(manifest.materials, code);
  } catch (e) {
    document.getElementById('emptyState').style.display = 'block';
  }
}

init();
