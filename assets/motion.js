// Shared motion helpers: scroll reveals and the sliding tab underline.
// Everything here is progressive: without JS (or with reduced motion)
// content simply shows.
(function(){
  document.documentElement.classList.add('js');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let io = null;
  if ('IntersectionObserver' in window){
    io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
  }

  // Reveal elements once as they scroll into view.
  function observe(els){
    (els instanceof Element ? [els] : Array.from(els || [])).forEach(el => {
      if (!io || reduce) { el.classList.add('in'); return; }
      io.observe(el);
    });
  }

  // Slide an underline (.tab-indicator inside container) under the active item.
  function moveIndicator(container, active, animate){
    if (!container || !active) return;
    const bar = container.querySelector('.tab-indicator');
    if (!bar) return;
    const x = active.offsetLeft + 10;
    const w = Math.max(active.offsetWidth - 20, 12);
    if (!animate) bar.style.transition = 'none';
    bar.style.transform = `translateX(${x}px) scaleX(${w})`;
    if (!animate){
      bar.getBoundingClientRect(); // commit the jump before restoring the transition
      bar.style.transition = '';
    }
    // keep the active item in view on narrow, scrollable rows
    const l = active.offsetLeft, r = l + active.offsetWidth;
    if (l < container.scrollLeft || r > container.scrollLeft + container.clientWidth){
      container.scrollTo({ left: l - 16, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  window.Motion = { observe, moveIndicator, reduce };

  document.addEventListener('DOMContentLoaded', () => observe(document.querySelectorAll('.reveal')));
})();
