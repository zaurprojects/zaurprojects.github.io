(() => {
  const root = document.documentElement, btn = document.getElementById('toggle');
  let t = null; try { t = localStorage.getItem('theme'); } catch (e) {}
  if (!t && matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
  const apply = v => { root.setAttribute('data-theme', v || 'light'); btn.textContent = v === 'dark' ? 'Light' : 'Dark'; };
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

  document.getElementById('yr').textContent = new Date().getFullYear();
})();