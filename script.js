(() => {
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
  const words = ['python clean.py', 'SELECT * FROM ideas;', 'git push', 'learning...'];
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

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
