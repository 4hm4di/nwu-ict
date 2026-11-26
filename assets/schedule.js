// One-off dated events (tests, exams): renders each list on the home page,
// adds events to the device calendar with reminders, and tags course rows.
// Times are Lagos (UTC+1, no DST). Finished events disappear by themselves.
(function(){
  const LAGOS = 3600000;
  const DAY = 86400000;
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const icons = (typeof ICONS !== 'undefined') ? ICONS : {};

  function parts(t){
    const [y, m, d] = t.date.split('-').map(Number);
    const midnight = Date.UTC(y, m - 1, d) - LAGOS; // Lagos midnight as an instant
    return {
      y, m, d,
      startMs: midnight + t.start * 3600000,
      endMs: midnight + t.end * 3600000,
      weekday: WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()],
      month: MONTHS[m - 1]
    };
  }

  function clock(h){
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    const period = hh >= 12 ? 'pm' : 'am';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return h12 + (mm ? ':' + String(mm).padStart(2, '0') : '') + period;
  }

  const stamp = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  function relative(p){
    const now = Date.now();
    if (now >= p.startMs && now < p.endMs) return { text: 'Happening now', soon: true };
    const diff = Math.floor((p.startMs + LAGOS) / DAY) - Math.floor((now + LAGOS) / DAY);
    if (diff === 0) return { text: 'Today', soon: true };
    if (diff === 1) return { text: 'Tomorrow', soon: true };
    return { text: 'In ' + diff + ' days', soon: diff <= 3 };
  }

  function vevent(t){
    const p = parts(t);
    const label = t.code + ' ' + t.kind;
    return [
      'BEGIN:VEVENT',
      'UID:' + t.id + '@nwu-kano-ict-timetable',
      'DTSTAMP:' + stamp(Date.now()),
      'DTSTART:' + stamp(p.startMs),
      'DTEND:' + stamp(p.endMs),
      'SUMMARY:' + label + ' • ' + t.title,
      'LOCATION:' + t.venue.replace(/,/g, '\\,'),
      'DESCRIPTION:' + (label + ', ' + p.weekday + ' ' + p.d + ' ' + p.month + ', ' + clock(t.start) + '–' + clock(t.end) + '.' + (t.note ? ' ' + t.note : '') + ' Northwest University, Kano • Dept. of ICT.').replace(/,/g, '\\,'),
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + label + ' is tomorrow', 'TRIGGER:-P1D', 'END:VALARM',
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + label + ' starts in 1 hour', 'TRIGGER:-PT1H', 'END:VALARM',
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + label + ' starts in 30 minutes', 'TRIGGER:-PT30M', 'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  }

  function openICS(events, message){
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NWU Kano ICT//Departmental Timetable//EN', 'CALSCALE:GREGORIAN']
      .concat(events.map(vevent), ['END:VCALENDAR']).join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    if (typeof showToast === 'function') showToast(message);
    window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }

  const upcomingOf = items => (items || [])
    .map(t => ({ t, p: parts(t) }))
    .filter(x => x.p.endMs > Date.now())
    .sort((a, b) => a.p.startMs - b.p.startMs);

  const lists = []; // every mounted schedule, for course tags

  function mount({ items, sectionId, listId, allButtonId }){
    const section = document.getElementById(sectionId);
    const list = document.getElementById(listId);
    if (!section || !list) return;
    let signature = '';

    function render(){
      const upcoming = upcomingOf(items);
      section.hidden = upcoming.length === 0;
      const sig = upcoming.map(x => x.t.id + relative(x.p).text).join('|');
      if (sig === signature) return;
      signature = sig;

      list.innerHTML = upcoming.map(({ t, p }, i) => {
        const rel = relative(p);
        return `
          <div class="test-row reveal" style="--d:${Math.min(i, 5) * 60}ms" id="${t.id}">
            <div class="test-date" aria-hidden="true">
              <span class="td-month">${p.month}</span>
              <span class="td-day">${p.d}</span>
              <span class="td-week">${p.weekday.slice(0, 3)}</span>
            </div>
            <div class="test-main">
              <div class="code-line">
                <span class="code">${t.code}</span>
                <span class="test-kind">${t.kind}</span>
                <span class="test-when${rel.soon ? ' soon' : ''}">${rel.text}</span>
              </div>
              <div class="title">${t.title}</div>
              <div class="meta">
                <span>${icons.time || ''}${p.weekday} ${p.d} ${p.month}, ${clock(t.start)}–${clock(t.end)}</span>
                <span>${icons.venue || ''}${t.venue}</span>
              </div>
              ${t.note ? `<p class="test-note">${t.note}</p>` : ''}
            </div>
            <div class="row-action">
              <button class="btn" data-event="${t.id}">${icons.cal || ''} Add to calendar</button>
              <a class="btn btn-quiet" href="materials.html?course=${encodeURIComponent(t.code)}">${icons.folder || ''} Materials</a>
            </div>
          </div>`;
      }).join('');

      list.querySelectorAll('button[data-event]').forEach(btn => btn.addEventListener('click', () => {
        const t = items.find(x => x.id === btn.dataset.event);
        openICS([t], t.code + ' ' + t.kind.toLowerCase() + ': opening with reminders 1 day, 1 hour and 30 minutes before…');
      }));
      if (window.Motion) Motion.observe(list.querySelectorAll('.reveal'));
      else list.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }

    const all = allButtonId && document.getElementById(allButtonId);
    if (all) all.addEventListener('click', () => {
      const upcoming = upcomingOf(items).map(x => x.t);
      if (upcoming.length) openICS(upcoming, 'Adding ' + upcoming.length + ' papers to your calendar, each with reminders…');
    });

    lists.push(items);
    render();
    setInterval(render, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  }

  // Course rows get a small tag for each upcoming test or exam.
  function tagCourses(){
    document.querySelectorAll('.row .test-tag').forEach(el => el.remove());
    lists.forEach(items => upcomingOf(items).forEach(({ t, p }) => {
      const line = document.querySelector('#course-' + t.code + ' .code-line');
      if (!line) return;
      const tag = document.createElement('a');
      tag.className = 'test-tag';
      tag.href = '#' + t.id;
      tag.textContent = t.kind + ', ' + p.weekday.slice(0, 3) + ' ' + p.d + ' ' + p.month;
      line.appendChild(tag);
    }));
  }

  if (window.TESTS) mount({ items: TESTS, sectionId: 'tests', listId: 'testList' });
  if (window.EXAMS) mount({ items: EXAMS, sectionId: 'exams', listId: 'examList', allButtonId: 'examAll' });
  tagCourses();
  window.tagTestCourses = tagCourses;

  // Shared with the exam countdown: the next paper still to come.
  window.nextPaper = () => {
    const next = upcomingOf(window.EXAMS)[0];
    return next ? { exam: next.t, when: relative(next.p).text, label: next.p.weekday + ' ' + next.p.d + ' ' + next.p.month + ', ' + clock(next.t.start) } : null;
  };
})();
