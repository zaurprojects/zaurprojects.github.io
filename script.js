(() => {
  // 🎄 Christmas theme: set to false to turn it off
  const CHRISTMAS = true;
  if (CHRISTMAS) document.documentElement.classList.add('xmas');
  const root = document.documentElement, btn = document.getElementById('toggle');
  let t = null; try { t = localStorage.getItem('theme'); } catch (e) {}
  if (!t && matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
  const apply = v => { root.setAttribute('data-theme', v || 'light'); };
  apply(t);
  btn.addEventListener('click', () => {
    const v = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(v); try { localStorage.setItem('theme', v); } catch (e) {}
  });

  // Baku local time
  const clock = document.getElementById('clock');
  const tick = () => { try { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Baku' }).format(new Date()); } catch (e) {} };
  tick(); setInterval(tick, 30000);

  // Reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typing effect in the small terminal chip
  const typed = document.getElementById('typed');
  const words = CHRISTMAS
    ? ['echo "Merry Christmas!"', 'python clean.py', 'git push --gifts', 'Happy New Year 2027']
    : ['python clean.py', 'SELECT * FROM ideas;', 'git push', 'learning...'];
  if (still) typed.textContent = words[0];
  else {
    let w = 0, i = 0, del = false;
    const step = () => {
      const word = words[w];
      typed.textContent = word.slice(0, i);
      if (!del && i < word.length) { i++; setTimeout(step, 70); }
      else if (!del) { del = true; setTimeout(step, 1600); }
      else if (i > 0) { i--; setTimeout(step, 35); }
      else { del = false; w = (w + 1) % words.length; setTimeout(step, 300); }
    };
    step();
  }

  // Background: slow drifting dots that link up when close
  const cv = document.getElementById('net'), ctx = cv.getContext('2d');
  let W, H, pts = [], mouse = { x: -999, y: -999 };
  const resize = () => {
    const d = devicePixelRatio || 1;
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.min(70, Math.round(W * H / 22000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
  };
  const color = () => getComputedStyle(root).getPropertyValue('--blue').trim() || '#2b3fd0';
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const c = color();
    ctx.fillStyle = c; ctx.strokeStyle = c;
    for (const p of pts) {
      if (!still) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fill();
    }
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y, d = Math.hypot(dx, dy);
        if (d < 120) { ctx.globalAlpha = (1 - d / 120) * .12; ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke(); }
      }
      const dm = Math.hypot(pts[a].x - mouse.x, pts[a].y - mouse.y);
      if (dm < 160) { ctx.globalAlpha = (1 - dm / 160) * .3; ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
    if (!still && !document.hidden) requestAnimationFrame(draw);
  };
  addEventListener('resize', () => { resize(); if (still) draw(); });
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !still) requestAnimationFrame(draw); });
  btn.addEventListener('click', () => { if (still) draw(); });
  resize(); draw();

  // Christmas: lights + falling snow
  if (CHRISTMAS) {
    const L = document.getElementById('lights');
    const count = Math.max(8, Math.round(innerWidth / 90));
    L.innerHTML = '<i></i>'.repeat(count);

    const sc = document.getElementById('snow'), sx = sc.getContext('2d');
    let SW, SH, flakes = [];
    const sResize = () => {
      const d = devicePixelRatio || 1;
      SW = innerWidth; SH = innerHeight;
      sc.width = SW * d; sc.height = SH * d; sx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.min(90, Math.round(SW * SH / 16000));
      flakes = Array.from({ length: n }, () => ({ x: Math.random() * SW, y: Math.random() * SH, r: .8 + Math.random() * 2.2, s: .3 + Math.random() * .7, w: Math.random() * 6.28 }));
    };
    const snow = () => {
      sx.clearRect(0, 0, SW, SH);
      const dark = root.getAttribute('data-theme') === 'dark';
      sx.fillStyle = dark ? 'rgba(255,255,255,.75)' : 'rgba(150,160,185,.55)';
      for (const f of flakes) {
        if (!still) {
          f.y += f.s; f.w += .01; f.x += Math.sin(f.w) * .35;
          if (f.y > SH + 4) { f.y = -4; f.x = Math.random() * SW; }
        }
        sx.beginPath(); sx.arc(f.x, f.y, f.r, 0, 7); sx.fill();
      }
      if (!still && !document.hidden) requestAnimationFrame(snow);
    };
    addEventListener('resize', () => { sResize(); if (still) snow(); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !still) requestAnimationFrame(snow); });
    btn.addEventListener('click', () => { if (still) snow(); });
    sResize(); snow();
  }

  document.getElementById('yr').textContent = new Date().getFullYear();
})();