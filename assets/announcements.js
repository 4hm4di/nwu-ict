const ICONS_A = {
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>'
};

const SEEN_KEY = 'nwu_ict_seen_announcements_v2';

function getSeenIds(){
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); }
  catch (e) { return []; }
}

function markSeen(id){
  const seen = getSeenIds();
  if (!seen.includes(id)){
    seen.push(id);
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* storage unavailable, ignore */ }
  }
}

function activeAnnouncements(){
  return (typeof ANNOUNCEMENTS !== 'undefined' ? ANNOUNCEMENTS : [])
    .filter(a => a.active)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function showAnnounceToast(msg){
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._announceToastTimer);
  window._announceToastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

function shareAnnouncement(a, e){
  if (e) e.stopPropagation();
  const link = new URL(a.url, location.href).href;
  const shareData = { title: a.title, text: a.excerpt, url: link };
  if (navigator.share){
    navigator.share(shareData).catch(() => { /* user cancelled, ignore */ });
  } else if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(link)
      .then(() => showAnnounceToast('Link copied — paste it anywhere.'))
      .catch(() => window.prompt('Copy this link:', link));
  } else {
    window.prompt('Copy this link:', link);
  }
}

function openAnnouncement(a){
  markSeen(a.id);
  refreshBellBadge();
  const targetUrl = (a && a.url) ? a.url : 'https://whatsapp.com/channel/0029VbCgrrGFSAt7yRwcVq40';
  // Links inside this site (e.g. "index.html#tests") open in place.
  const target = new URL(targetUrl, location.href);
  if (target.origin === location.origin){
    const here = target.pathname === location.pathname ||
      (/\/(index\.html)?$/.test(target.pathname) && /\/(index\.html)?$/.test(location.pathname));
    const el = target.hash && document.querySelector(target.hash);
    if (here && el){
      closeAnnounceModal();
      toggleAnnouncePanel(false);
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
      return;
    }
    window.location.href = target.href;
    return;
  }
  window.open(targetUrl, '_blank', 'noopener');
}

function updateBellBadge(){
  refreshBellBadge();
}

function refreshBellBadge(){
  const badge = document.getElementById('bellBadge');
  if (!badge) return;
  const seen = getSeenIds();
  const unseen = activeAnnouncements().filter(a => !seen.includes(a.id)).length;
  badge.classList.toggle('show', unseen > 0);
  const bell = document.getElementById('announceBell');
  if (bell) bell.classList.toggle('ring', unseen > 0);
}

function renderAnnouncePanel(){
  const panelList = document.getElementById('announcePanelList');
  if (!panelList) return;
  const list = activeAnnouncements();
  panelList.innerHTML = '';

  if (list.length === 0){
    panelList.innerHTML = '<div class="announce-empty">No announcements right now.</div>';
    return;
  }

  list.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'announce-item';
    row.style.animationDelay = (i * 45) + 'ms';
    row.innerHTML = `
      <div class="announce-item-main">
        <div class="announce-item-title">${a.title}</div>
        <div class="announce-item-excerpt">${a.excerpt}</div>
        <div class="announce-item-date">${a.date}</div>
      </div>
      <div class="announce-item-actions">
        <button class="icon-btn" title="Share" data-action="share">${ICONS_A.share}</button>
        <button class="icon-btn" title="Open" data-action="open">${ICONS_A.open}</button>
      </div>
    `;
    row.addEventListener('click', () => openAnnouncement(a));
    row.querySelector('[data-action="share"]').addEventListener('click', (e) => shareAnnouncement(a, e));
    row.querySelector('[data-action="open"]').addEventListener('click', (e) => { e.stopPropagation(); openAnnouncement(a); });
    panelList.appendChild(row);
  });
}

function toggleAnnouncePanel(forceOpen){
  const panel = document.getElementById('announcePanel');
  const backdrop = document.getElementById('announceBackdrop');
  if (!panel || !backdrop) return;
  const shouldOpen = forceOpen !== undefined ? forceOpen : !panel.classList.contains('open');
  if (shouldOpen){
    renderAnnouncePanel();
    panel.classList.add('open');
    backdrop.classList.add('show');
  } else {
    panel.classList.remove('open');
    backdrop.classList.remove('show');
  }
}

let _sliderIndex = 0;
let _sliderItems = [];

function buildSlideHTML(a){
  return `
    <div class="announce-slide-top">
      <div>
        <p class="announce-eyebrow">Announcement</p>
        <h3>${a.title}</h3>
      </div>
    </div>
    <p>${a.excerpt}</p>
    <div class="announce-date">${a.date}</div>
    <div class="announce-modal-actions">
      <button class="btn" data-open>${a.action || 'Read more'}</button>
      <button class="icon-btn" data-share title="Share">${ICONS_A.share}</button>
    </div>
  `;
}

function showAnnounceModal(items){
  const modal = document.getElementById('announceModal');
  const backdrop = document.getElementById('announceBackdrop');
  const track = document.getElementById('announceSliderTrack');
  const dotsWrap = document.getElementById('announceDots');
  if (!modal || !backdrop || !track) return;

  _sliderItems = items;
  _sliderIndex = 0;

  track.innerHTML = '';
  items.forEach(a => {
    const slide = document.createElement('div');
    slide.className = 'announce-slide';
    slide.innerHTML = buildSlideHTML(a);
    slide.querySelector('[data-open]').addEventListener('click', () => { openAnnouncement(a); closeAnnounceModal(); });
    slide.querySelector('[data-share]').addEventListener('click', (e) => shareAnnouncement(a, e));
    track.appendChild(slide);
  });

  if (dotsWrap){
    dotsWrap.innerHTML = '';
    dotsWrap.classList.toggle('hidden', items.length <= 1);
    items.forEach((a, i) => {
      const dot = document.createElement('button');
      dot.className = 'announce-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to announcement ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
  }

  const prevBtn = document.getElementById('announceSliderPrev');
  const nextBtn = document.getElementById('announceSliderNext');
  if (prevBtn) prevBtn.classList.toggle('hidden', items.length <= 1);
  if (nextBtn) nextBtn.classList.toggle('hidden', items.length <= 1);

  updateSliderPosition();

  modal.classList.add('open');
  backdrop.classList.add('show');
}

function goToSlide(i){
  if (!_sliderItems.length) return;
  _sliderIndex = (i + _sliderItems.length) % _sliderItems.length;
  updateSliderPosition();
}

function updateSliderPosition(){
  const track = document.getElementById('announceSliderTrack');
  if (track) track.style.transform = 'translateX(-' + (_sliderIndex * 100) + '%)';
  document.querySelectorAll('#announceDots .announce-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === _sliderIndex);
  });
}

function closeAnnounceModal(ids){
  const modal = document.getElementById('announceModal');
  const backdrop = document.getElementById('announceBackdrop');
  if (ids !== undefined){
    ids.forEach(id => markSeen(id));
    refreshBellBadge();
  }
  if (modal) modal.classList.remove('open');
  if (backdrop && !document.getElementById('announcePanel').classList.contains('open')){
    backdrop.classList.remove('show');
  }
}

function initAnnouncements(){
  // Handy while testing: opening the page with ?resetAnnouncements=1
  // clears the "already seen" memory so the popup shows again.
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('resetAnnouncements') === '1'){
      localStorage.removeItem(SEEN_KEY);
    }
  } catch (e) { /* storage/URL API unavailable, ignore */ }

  refreshBellBadge();

  const bellBtn = document.getElementById('announceBell');
  if (bellBtn){
    bellBtn.addEventListener('click', () => toggleAnnouncePanel());
  }

  const panelClose = document.getElementById('announcePanelClose');
  if (panelClose){
    panelClose.addEventListener('click', () => toggleAnnouncePanel(false));
  }

  const backdrop = document.getElementById('announceBackdrop');
  if (backdrop){
    backdrop.addEventListener('click', () => {
      toggleAnnouncePanel(false);
      closeAnnounceModal();
    });
  }

  const modalClose = document.getElementById('announceModalClose');
  if (modalClose){
    modalClose.addEventListener('click', () => closeAnnounceModal());
  }

  const prevBtn = document.getElementById('announceSliderPrev');
  const nextBtn = document.getElementById('announceSliderNext');
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(_sliderIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(_sliderIndex + 1));

  const viewport = document.querySelector('.announce-slider-viewport');
  if (viewport){
    let touchStartX = 0;
    viewport.addEventListener('touchstart', e => {
      if (e.changedTouches && e.changedTouches.length) {
        touchStartX = e.changedTouches[0].clientX;
      }
    }, {passive: true});
    viewport.addEventListener('touchend', e => {
      if (e.changedTouches && e.changedTouches.length) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40){
          if (diff > 0) goToSlide(_sliderIndex + 1);
          else goToSlide(_sliderIndex - 1);
        }
      }
    }, {passive: true});
  }

  document.addEventListener('keydown', e => {
    const modal = document.getElementById('announceModal');
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'ArrowRight') goToSlide(_sliderIndex + 1);
    else if (e.key === 'ArrowLeft') goToSlide(_sliderIndex - 1);
    else if (e.key === 'Escape') closeAnnounceModal();
  });

  // The popup only appears on the timetable home page; other pages keep the bell.
  const isHome = !!document.getElementById('list');
  const unseen = isHome ? getUnseenAnnouncements() : [];
  if (unseen.length){
    console.log('[announcements] showing popup for: ' + unseen.map(a => a.id).join(', '));
    setTimeout(() => showAnnounceModal(unseen), 900);
  } else {
    const total = activeAnnouncements().length;
    if (total === 0){
      console.log('[announcements] no active announcements in announcements-data.js — nothing to show.');
    } else {
      console.log('[announcements] popup not shown: all ' + total + ' active announcement(s) are already marked "seen" in this browser (localStorage key "' + SEEN_KEY + '"). ' +
                  'This is expected — it only nags once per announcement per device. ' +
                  'To force it to show again for testing, open this page with ?resetAnnouncements=1 added to the URL, or use a private/incognito window.');
    }
  }
}

function getUnseenAnnouncements(){
  const seen = getSeenIds();
  return activeAnnouncements().filter(a => !seen.includes(a.id));
}

initAnnouncements();
