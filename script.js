const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- Split headlines into masked characters ----------
document.querySelectorAll('[data-split]').forEach((el) => {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.className = 'w';
          [...part].forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'c';
            c.style.setProperty('--i', i++);
            c.textContent = ch;
            word.append(c);
          });
          frag.append(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  walk(el);
});

// ---------- Fade-and-tilt sections into view ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    if (entry.target.hasAttribute('data-split')) entry.target.classList.add('split-in');
    entry.target.querySelectorAll('[data-split]').forEach((s) => s.classList.add('split-in'));
    entry.target.querySelectorAll('[data-count]').forEach(countUp);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
});

// ---------- Stats count up ----------
function countUp(el) {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now();
  const dur = 1400;
  const tick = (now) => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
    if (t < 1) requestAnimationFrame(tick);
  };
  el.textContent = '0';
  requestAnimationFrame(tick);
}

// ---------- Opening curtain ----------
function startObserving() {
  document.querySelectorAll('.reveal, [data-split]:not(.reveal *)').forEach((el) => observer.observe(el));
}

if (reduceMotion) {
  document.body.classList.remove('is-loading');
  document.body.classList.add('loaded');
  startObserving();
} else {
  const counter = document.querySelector('.pl-count');
  const t0 = performance.now();
  const minTime = 2200;
  let pageReady = document.readyState === 'complete';
  window.addEventListener('load', () => { pageReady = true; });

  const step = (now) => {
    const elapsed = now - t0;
    const pct = Math.min(pageReady ? 100 : 92, Math.round((elapsed / minTime) * 100));
    counter.textContent = String(pct).padStart(3, '0');
    if (pct < 100) { requestAnimationFrame(step); return; }
    document.body.classList.add('loaded');
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      startObserving();
    }, 550);
    setTimeout(() => { document.querySelector('.preloader').style.display = 'none'; }, 1500);
  };
  requestAnimationFrame(step);
}

// ---------- Gold wipe on in-page navigation ----------
const wipe = document.querySelector('.wipe');
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target || reduceMotion) return;
    e.preventDefault();
    wipe.classList.remove('out');
    wipe.classList.add('in');
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
      wipe.classList.remove('in');
      wipe.classList.add('out');
    }, 600);
  });
});

if (!reduceMotion) {
  // ---------- Scroll-driven effects ----------
  const progress = document.querySelector('.progress');
  const tracks = [...document.querySelectorAll('.marquee-track')];
  const peeks = [...document.querySelectorAll('.peek-title')];
  const photo = document.querySelector('.about-photo .photo');
  let lastY = window.scrollY;
  let velocity = 0;
  let offset = 0;

  const loop = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    velocity += ((y - lastY) - velocity) * 0.12;
    lastY = y;

    // marquee speeds up and skews with scroll velocity
    offset -= 0.6 + Math.abs(velocity) * 0.25;
    tracks.forEach((track, idx) => {
      const w = track.scrollWidth / 3;
      const x = ((idx % 2 ? -offset : offset) % w + w) % w;
      const skew = Math.max(-12, Math.min(12, velocity * 0.4));
      track.style.transform = `translateX(${-x}px) skewX(${skew}deg)`;
    });

    peeks.forEach((p) => {
      const r = p.parentElement.getBoundingClientRect();
      p.style.transform = `translateX(${(r.top / innerHeight) * -80}px)`;
    });

    if (photo && document.body.classList.contains('loaded')) {
      photo.style.translate = `0 ${y * 0.08}px`;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  if (finePointer) {
    // ---------- Custom cursor ----------
    document.body.classList.add('has-cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const label = ring.querySelector('span');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    const follow = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(follow);
    };
    follow();
    document.querySelectorAll('a, button, .chip-wrap span, .card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (el.dataset.cursor) { ring.classList.add('label'); label.textContent = el.dataset.cursor; }
        else ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => ring.classList.remove('hover', 'label'));
    });

    // ---------- 3D tilt ----------
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add('tilting');
        el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) scale(1.02)`;
      });
      el.addEventListener('mouseleave', () => {
        el.classList.remove('tilting');
        el.style.transform = '';
      });
    });

    // ---------- Magnetic buttons ----------
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.35}px, ${y * 0.45}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
}
