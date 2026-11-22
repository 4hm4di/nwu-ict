// Mounts the GradientASCII light into the page header, in the school's blues.
// Falls back to the circuit-trace SVG when WebGL2 isn't available.
(function(){
  const hero = document.querySelector('.hero');
  const host = document.getElementById('heroAscii');
  if (!hero || !host || !window.GradientASCII) return;

  const small = window.matchMedia('(max-width: 560px)').matches;
  const coursePage = hero.classList.contains('hero-course');

  const fx = GradientASCII.mount(host, {
    // shadow edge → brightest: navy, deep sky, sky, pale sky
    colors: ['#1D3A5C', '#1C7FCB', '#2E9BEF', '#9FD2FF'],
    shape: 'horizon',
    characters: ' .:-=+x01#',       // a nod to ICT: binary in the mix
    cellSize: small ? 13 : 15,
    density: 0.7,
    glyphOpacity: 0.6,
    gradientOpacity: coursePage ? 0.5 : 0.6,
    glow: 0.25,
    flicker: 0.2,
    softness: 0.6,
    scale: coursePage ? 1.35 : 1.2,
    flow: 0.6,
    speed: 0.8,
    grain: 0.05,
    clickEffect: 'wave',
    scrambleRadius: 0.12,
    dpr: small ? 1.25 : 1.75,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'
  });

  if (fx) hero.classList.add('has-ascii');
})();
