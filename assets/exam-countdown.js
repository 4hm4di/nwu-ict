// Exam countdown, synced to the calendar day in Lagos (UTC+1, no DST).
// To change the dates, edit EXAM_START / COUNT_FROM below and the two
// date label in index.html and materials.html.
(function(){
  const EXAM_START = { y: 2026, m: 11, d: 30 };  // Monday, 30 November 2026
  const COUNT_FROM = { y: 2026, m: 9,  d: 15 };  // timetable went live
  const DAY = 86400000;
  const LAGOS = 3600000;

  const section = document.getElementById('exam');
  if (!section) return;
  const $ = id => document.getElementById(id);

  const dayIndex = ({ y, m, d }) => Math.floor(Date.UTC(y, m - 1, d) / DAY);
  const todayIndex = () => Math.floor((Date.now() + LAGOS) / DAY);

  function update(){
    const exam = dayIndex(EXAM_START);
    const from = dayIndex(COUNT_FROM);
    const today = todayIndex();
    const left = exam - today;
    const pct = Math.max(0, Math.min(1, (today - from) / (exam - from)));

    const days = $('examDays');
    const msg = $('examMsg');
    if (left > 7){
      days.innerHTML = `<span class="num">${left}</span> days to exams`;
      msg.textContent = 'Study to understand, not just to pass.';
    } else if (left > 1){
      days.innerHTML = `<span class="num">${left}</span> days to exams`;
      msg.textContent = 'Steady revision beats last-minute cramming.';
    } else if (left === 1){
      days.innerHTML = 'Exams start tomorrow';
      msg.textContent = 'Light revision, early night.';
    } else {
      // Exam period: point at the next paper instead of a countdown.
      const next = window.nextPaper && window.nextPaper();
      if (next){
        days.innerHTML = `Next paper: <span class="num">${next.exam.code}</span>`;
        $('examWhen').firstChild.textContent = next.when + ', ' + next.label + ' ';
        msg.textContent = left === 0 ? 'You have prepared. All the best.' : 'One paper at a time.';
      } else {
        days.textContent = 'Exams are done';
        msg.textContent = 'Well done. Rest well.';
      }
    }
    section.classList.toggle('urgent', left >= 0 && left <= 7);

    const shown = Math.round(pct * 100);
    $('examPct').textContent = shown + '%';
    $('examBar').setAttribute('aria-valuenow', String(shown));
    section.style.setProperty('--p', pct.toFixed(4));
  }

  // Re-check just after midnight in Lagos so the count rolls over by itself.
  function scheduleMidnight(){
    const sinceMidnight = (Date.now() + LAGOS) % DAY;
    setTimeout(() => { update(); scheduleMidnight(); }, DAY - sinceMidnight + 1000);
  }

  update();
  scheduleMidnight();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
})();
