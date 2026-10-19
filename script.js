const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const P = 'assets/projects/';
// portrait shots span two rows, panoramas two columns
const SHAPES = {"apple-01": "tall", "apple-02": "tall", "apple-03": "tall", "apple-04": "tall", "apple-05": "tall", "apple-06": "wide", "apple-07": "wide", "apple-08": "tall", "apple-09": "tall", "apple-10": "tall", "campus-05": "tall", "campus-06": "tall", "gsb-01": "tall", "gsb-02": "tall", "gsb-05": "tall", "smart-02": "tall", "safar-02": "tall", "safar-04": "tall", "akriti-02": "tall", "gsb-06": "tall", "gsb-08": "tall", "gsb-10": "tall"};

// ---------- Project photos ----------
const GALLERIES = {
  apple: {
    title: 'Apple Premium Retail', kicker: 'Vijay Sales · Summer Internship 2026', section: '#p-apple',
    photos: [
      ['apple-01', 'Mandvi outside Vijay Sales'],
      ['apple-03', 'Vijay Sales intern pass'],
      ['apple-04', 'Apple Watch display'],
      ['apple-05', 'Apple Watch Series 11 and iPhone display'],
      ['apple-07', 'Back to School sale on the MacBook floor'],
      ['apple-02', 'Mandvi at the Back to School campaign'],
      ['apple-06', 'Customer-story standees in store'],
      ['apple-08', 'Premium tech counters on the floor'],
      ['apple-09', 'Gaming and music displays'],
      ['apple-10', 'Mandvi at the Vijay Sales storefront'],
    ],
  },
  gsb: {
    title: 'GSB — Global Shirt Box', kicker: 'Industry Visit', section: '#p-gsb',
    photos: [
      ['gsb-01', 'Mandvi at GSB'],
      ['gsb-07', 'Global Shirt Box India, Andheri East, Mumbai'],
      ['gsb-06', 'Mandvi among the GSB shirt racks'],
      ['gsb-08', 'GSB label on a denim shirt'],
      ['gsb-02', 'GSB shirt print designs'],
      ['gsb-03', 'Fabric stock'],
      ['gsb-04', 'Shirts on the rack'],
      ['gsb-09', 'Industry visit session at the GSB office'],
      ['gsb-10', 'Students at the GSB office'],
      ['gsb-05', 'Interaction with the GSB team'],
    ],
  },
  safar: {
    title: 'SafarCabby', kicker: 'Lucenta Solutions Technologies · CMAPS', section: '#p-safar',
    photos: [
      ['safar-01', 'Working session in Jaipur'],
      ['safar-02', 'Research and analysis on the laptop'],
      ['safar-03', 'Project team with the client'],
      ['safar-04', 'Startup Oasis, an initiative by RIICO'],
      ['safar-05', 'SafarCabby brand creative'],
      ['safar-06', 'SafarCabby campaign creative — luxury Mercedes rentals'],
    ],
  },
  akriti: {
    title: 'Akriti Fabrication', kicker: 'CMAPS · Operations Study', section: '#p-akriti',
    photos: [
      ['akriti-01', 'Project team at Akriti Fabrication'],
      ['akriti-02', 'Meeting at the Akriti Fabrication office'],
    ],
  },
  rush: {
    title: 'Rush4Rush', kicker: 'Event Experience · Universal AI University', section: '#p-rush',
    photos: [
      ['rush-01', 'Rush4Rush team'],
      ['rush-02', 'Rush4Rush celebrations'],
    ],
  },
  smart: {
    title: 'SMART Project', kicker: 'Light Of Life Trust · Raigad, Maharashtra', section: '#p-smart',
    photos: [
      ['smart-01', 'Community session in the village'],
      ['smart-02', 'Session with village women'],
      ['smart-03', 'Project team in Raigad'],
      ['smart-04', 'SMART project team'],
    ],
  },
  campus: {
    title: 'Campus & Leadership', kicker: 'Universal AI University', section: '#leadership',
    photos: [
      ['campus-01', 'MBA cohort on campus'],
      ['campus-02', 'Formal event on stage'],
      ['campus-03', 'Felicitation on stage'],
      ['campus-04', 'Cohort at a formal event'],
      ['campus-05', 'Mandvi B. at a session'],
      ['campus-06', 'Mandvi on campus'],
      ['campus-07', 'Universal AI University group photo'],
    ],
  },
};

// ---------- Split headlines into masked characters ----------
function splitText(el) {
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
}
document.querySelectorAll('[data-split]').forEach(splitText);

// ---------- Photo strips inside each case ----------
document.querySelectorAll('.case-gallery[data-gallery]').forEach((strip) => {
  const g = GALLERIES[strip.dataset.gallery];
  if (!g || !g.photos.length) return;
  const shown = g.photos.slice(0, 4);
  shown.forEach(([id, alt], idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cg-item';
    b.dataset.index = idx;
    b.innerHTML = `<img src="${P}${id}-sm.jpg" alt="${alt}" loading="lazy" decoding="async">`;
    strip.append(b);
  });
  const more = document.createElement('button');
  more.type = 'button';
  more.className = 'cg-more';
  more.innerHTML = g.photos.length > shown.length
    ? `<b>+${g.photos.length - shown.length}</b>View all photos`
    : `<b>${g.photos.length}</b>Open gallery`;
  strip.append(more);
  strip.addEventListener('click', (e) => {
    const item = e.target.closest('.cg-item, .cg-more');
    if (!item) return;
    openGallery(strip.dataset.gallery, item, item.classList.contains('cg-item') ? +item.dataset.index : null);
  });
});

// ---------- Real photos spill out of each project folder ----------
document.querySelectorAll('.folder[data-gallery]').forEach((folder) => {
  const g = GALLERIES[folder.dataset.gallery];
  if (!g || !g.photos.length) return;
  folder.classList.add('has-photos');
  const sheets = folder.querySelectorAll('.sheet');
  g.photos.slice(0, sheets.length).forEach(([id], k) => {
    const img = document.createElement('img');
    img.className = 'sheet photo';
    img.src = `${P}${id}-sm.jpg`;
    img.alt = '';
    img.loading = 'lazy';
    sheets[k].replaceWith(img);
  });
});

// ---------- Reveal on scroll ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    if (entry.target.hasAttribute('data-split')) entry.target.classList.add('split-in');
    entry.target.querySelectorAll('[data-split]').forEach((s) => s.classList.add('split-in'));
    entry.target.querySelectorAll('[data-count]').forEach(countUp);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
});

function countUp(el) {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 1400);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
    if (t < 1) requestAnimationFrame(tick);
  };
  el.textContent = '0';
  requestAnimationFrame(tick);
}

function startObserving() {
  document.querySelectorAll('.reveal, [data-split]:not(.reveal *)').forEach((el) => observer.observe(el));
}

// ---------- Opening curtain ----------
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
  // never hold visitors on a slow network for more than a few seconds
  setTimeout(() => { pageReady = true; }, 4500);

  const step = (now) => {
    const pct = Math.min(pageReady ? 100 : 92, Math.round(((now - t0) / minTime) * 100));
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

// ---------- Scroll lock while overlays are open ----------
let locks = 0;
function lockScroll(on) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  document.documentElement.style.overflow = locks ? 'hidden' : '';
}

// ---------- Gold wipe on in-page navigation ----------
const wipe = document.querySelector('.wipe');
function wipeTo(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (reduceMotion) { target.scrollIntoView(); return; }
  wipe.classList.remove('out');
  wipe.classList.add('in');
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    history.replaceState(null, '', hash);
    wipe.classList.remove('in');
    wipe.classList.add('out');
  }, 600);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link || link.classList.contains('gallery-case')) return;
  const hash = link.getAttribute('href');
  if (hash.length < 2) return;

  if (link.classList.contains('folder') && GALLERIES[link.dataset.gallery]?.photos.length) {
    e.preventDefault();
    const ico = link.querySelector('.folder-ico');
    link.classList.add('opening');
    setTimeout(() => link.classList.remove('opening'), 900);
    openGallery(link.dataset.gallery, ico);
    return;
  }

  e.preventDefault();
  if (link.closest('.menu')) { closeMenu(); setTimeout(() => wipeTo(hash), 350); return; }
  wipeTo(hash);
});

// ---------- Gallery: photos burst out of the folder ----------
const gallery = document.querySelector('.gallery');
const gGrid = gallery.querySelector('.gallery-grid');
const gTitle = gallery.querySelector('.gallery-title');
const gKicker = gallery.querySelector('.gallery-kicker');
const gCase = gallery.querySelector('.gallery-case');
let galleryState = null;

function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function openGallery(id, originEl, startIndex = null) {
  const g = GALLERIES[id];
  if (!g || galleryState) return;
  const origin = centerOf(originEl);
  galleryState = { id, origin, originEl };

  gallery.style.setProperty('--ox', `${origin.x}px`);
  gallery.style.setProperty('--oy', `${origin.y}px`);
  gKicker.textContent = g.kicker;
  gTitle.setAttribute('aria-label', g.title);
  let n = 0;
  gTitle.innerHTML = g.title.split(' ').map((word) =>
    `<em>${[...word].map((ch) => `<span style="--i:${n++}">${ch}</span>`).join('')}</em>`).join(' ');
  gCase.setAttribute('href', g.section);
  gCase.style.display = document.querySelector(g.section)?.contains(originEl) ? 'none' : '';

  gGrid.innerHTML = '';
  g.photos.forEach(([pid, alt], idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'g-card';
    b.dataset.index = idx;
    b.innerHTML = `<img src="${P}${pid}-sm.jpg" alt="${alt}" decoding="async">`;
    if (SHAPES[pid] === 'tall') b.classList.add('tall');
    if (SHAPES[pid] === 'wide' && window.innerWidth > 560) b.classList.add('wide');
    gGrid.append(b);
  });

  gallery.setAttribute('aria-hidden', 'false');
  gallery.classList.remove('closing');
  gallery.classList.add('open');
  lockScroll(true);

  requestAnimationFrame(() => {
    const cards = [...gGrid.children];
    cards.forEach((card, i) => {
      if (reduceMotion) return;
      const c = centerOf(card);
      const spin = (Math.random() - 0.5) * 70;
      card.animate([
        { transform: `translate(${origin.x - c.x}px, ${origin.y - c.y}px) scale(.12) rotate(${spin}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      ], { duration: 1100, delay: 280 + i * 75, easing: 'cubic-bezier(.34,1.45,.5,1)', fill: 'backwards' });
    });
    if (startIndex !== null) setTimeout(() => openLightbox(startIndex), reduceMotion ? 0 : 900);
  });
}

function closeGallery(then) {
  if (!galleryState) return;
  const { origin } = galleryState;
  const cards = [...gGrid.children];
  if (!reduceMotion) {
    cards.forEach((card, i) => {
      const c = centerOf(card);
      card.animate([
        { transform: 'none', opacity: 1 },
        { transform: `translate(${origin.x - c.x}px, ${origin.y - c.y}px) scale(.1) rotate(${(Math.random() - 0.5) * 90}deg)`, opacity: 0 },
      ], { duration: 650, delay: (cards.length - i) * 30, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' });
    });
  }
  gallery.classList.add('closing');
  setTimeout(() => {
    gallery.classList.remove('open', 'closing');
    gallery.setAttribute('aria-hidden', 'true');
    gGrid.innerHTML = '';
    galleryState = null;
    lockScroll(false);
    if (then) then();
  }, reduceMotion ? 0 : 1300);
}

gallery.querySelector('.gallery-close').addEventListener('click', () => closeGallery());
gCase.addEventListener('click', (e) => {
  e.preventDefault();
  const hash = gCase.getAttribute('href');
  closeGallery(() => wipeTo(hash));
});
gGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.g-card');
  if (card) openLightbox(+card.dataset.index);
});

// ---------- Lightbox: photo zooms out of its card ----------
const lb = document.querySelector('.lightbox');
const lbImg = lb.querySelector('img');
const lbCount = lb.querySelector('.lb-count');
let lbIndex = 0;

function flipFrom(fromEl) {
  if (reduceMotion || !fromEl) return;
  const a = fromEl.getBoundingClientRect();
  const b = lbImg.getBoundingClientRect();
  if (!b.width) return;
  lbImg.animate([
    { transform: `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width}, ${a.height / b.height})`, borderRadius: '12px' },
    { transform: 'none', borderRadius: '6px' },
  ], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' });
}

function showPhoto(i, dir = 0) {
  const photos = GALLERIES[galleryState.id].photos;
  lbIndex = (i + photos.length) % photos.length;
  const [pid, alt] = photos[lbIndex];
  lbCount.textContent = `${String(lbIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  const card = gGrid.children[lbIndex];
  lbImg.src = card.querySelector('img').src; // instant preview from the thumbnail
  lbImg.alt = alt;
  const full = new Image();
  full.onload = () => { if (lbImg.alt === alt) lbImg.src = full.src; };
  full.src = `${P}${pid}.jpg`;
  if (dir && !reduceMotion) {
    lbImg.animate([
      { transform: `translateX(${dir * 80}px) rotate(${dir * 4}deg) scale(.92)`, opacity: 0, filter: 'blur(8px)' },
      { transform: 'none', opacity: 1, filter: 'blur(0)' },
    ], { duration: 550, easing: 'cubic-bezier(.16,1,.3,1)' });
  }
  return card;
}

function openLightbox(i) {
  if (!galleryState) return;
  const card = showPhoto(i);
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  const go = () => flipFrom(card);
  lbImg.complete ? requestAnimationFrame(go) : lbImg.addEventListener('load', go, { once: true });
}

function closeLightbox() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
}

lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
lb.querySelector('.lb-prev').addEventListener('click', () => showPhoto(lbIndex - 1, -1));
lb.querySelector('.lb-next').addEventListener('click', () => showPhoto(lbIndex + 1, 1));
lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });

let touchX = null;
lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 45) showPhoto(lbIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  touchX = null;
});

// ---------- Navigation collapses into the M.S.B pill ----------
const nav = document.querySelector('.nav');
const pill = document.querySelector('.msb-pill');
const pillPct = pill.querySelector('.pill-pct');
const pillSec = pill.querySelector('.pill-sec');
const menu = document.querySelector('.menu');
nav.querySelectorAll('.nav-links a').forEach((a, k, all) => a.style.setProperty('--k', all.length - 1 - k));

const SECTIONS = [
  ['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['p-apple', 'Apple'],
  ['p-gsb', 'GSB'], ['p-safar', 'SafarCabby'], ['p-rush', 'Rush4Rush'], ['p-smart', 'SMART'],
  ['p-akriti', 'Akriti'], ['leadership', 'Leadership'], ['contact', 'Contact'],
].map(([id, label]) => [document.getElementById(id), label]).filter(([el]) => el);

function openMenu() {
  menu.classList.add('open');
  menu.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
  pill.setAttribute('aria-label', 'Close menu');
  lockScroll(true);
}
function closeMenu() {
  if (!menu.classList.contains('open')) return;
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  lockScroll(false);
  updatePill();
}

// the section name rolls like an odometer
let currentSec = 'About';
function rollSection(label) {
  if (label === currentSec) return;
  const dir = SECTIONS.findIndex(([, l]) => l === label) > SECTIONS.findIndex(([, l]) => l === currentSec) ? 1 : -1;
  currentSec = label;
  // only one name may ever be on screen: drop anything still leaving, roll out the current one
  const spans = [...pillSec.children];
  const current = spans.pop();
  spans.forEach((s) => s.remove());
  const next = document.createElement('span');
  next.textContent = label;
  pillSec.append(next);
  if (!current) return;
  if (reduceMotion) { current.remove(); return; }
  next.animate([{ transform: `translateY(${dir * 110}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
  current.animate([{ transform: 'none', opacity: 1 }, { transform: `translateY(${-dir * 110}%)`, opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' });
  setTimeout(() => current.remove(), 400);
}

// nav links physically fly into the pill (and back out again)
function flyLinks(intoPill) {
  if (reduceMotion) return;
  const pr = pill.getBoundingClientRect();
  const px = pr.left + pr.width / 2;
  const py = 14 + 23;
  [...nav.querySelectorAll('.nav-links a, .nav-mark')].forEach((a, i) => {
    const r = a.getBoundingClientRect();
    if (!r.width) return;
    const ghost = a.cloneNode(true);
    ghost.className = 'fly-ghost';
    Object.assign(ghost.style, { left: `${r.left}px`, top: `${intoPill ? r.top : 18}px` });
    document.body.append(ghost);
    const dx = px - (r.left + r.width / 2);
    const dy = py - (r.top + r.height / 2);
    const spin = (i % 2 ? 1 : -1) * (120 + i * 40);
    const frames = [
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1, filter: 'blur(0)' },
      { transform: `translate(${dx * 0.55}px, ${dy + 60}px) scale(.8) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.1) rotate(${spin}deg)`, opacity: 0, filter: 'blur(2px)' },
    ];
    ghost.animate(intoPill ? frames : frames.slice().reverse(), {
      duration: 760, delay: i * 55, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both',
    }).finished.then(() => ghost.remove());
  });
  if (intoPill) {
    pill.animate([
      { scale: '1 1' }, { scale: '1 1', offset: 0.55 }, { scale: '1.35 .7', offset: 0.75 }, { scale: '.9 1.12', offset: 0.88 }, { scale: '1 1' },
    ], { duration: 1150, easing: 'ease-out' });
  }
}

// gold sparks burst when the pill is full
function burst() {
  if (reduceMotion) return;
  const r = pill.getBoundingClientRect();
  for (let i = 0; i < 34; i++) {
    const s = document.createElement('i');
    s.className = 'spark';
    s.style.left = `${r.left + Math.random() * r.width}px`;
    s.style.top = `${r.top + r.height / 2}px`;
    document.body.append(s);
    const ang = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 130;
    s.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist * 0.7 + 40}px) scale(0)`, opacity: 0 },
    ], { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.16,1,.3,1)' }).finished.then(() => s.remove());
  }
  pill.animate([{ scale: '1 1' }, { scale: '1.25 1.25' }, { scale: '1 1' }], { duration: 600, easing: 'cubic-bezier(.34,1.56,.64,1)' });
}

let wasCollapsed = false;
let wasFull = false;
function updatePill() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, y / max) : 0;
  const collapsed = y > innerHeight * 0.5;
  if (collapsed !== wasCollapsed && !document.body.classList.contains('is-loading')) flyLinks(collapsed);
  wasCollapsed = collapsed;
  nav.classList.toggle('collapsed', collapsed);
  pill.classList.toggle('show', collapsed || menu.classList.contains('open'));
  pill.style.setProperty('--p', p.toFixed(4));
  pillPct.textContent = `${Math.round(p * 100)}%`;
  const full = p > 0.985;
  if (full && !wasFull && collapsed) setTimeout(burst, 250);
  wasFull = full;
  pill.classList.toggle('full', full);
  if (!menu.classList.contains('open')) pill.setAttribute('aria-label', full ? 'Back to top' : 'Open menu');

  let label = SECTIONS[0][1];
  SECTIONS.forEach(([el, l]) => { if (el.getBoundingClientRect().top < innerHeight * 0.45) label = l; });
  rollSection(label);
}
window.addEventListener('scroll', updatePill, { passive: true });
window.addEventListener('resize', updatePill);
updatePill();

function pillAction(e) {
  if (e.target.closest('.pill-links a')) return; // handled by the in-page link wipe
  if (menu.classList.contains('open')) { closeMenu(); return; }
  if (pill.classList.contains('full')) { goTop(); return; }
  openMenu();
}
pill.addEventListener('click', pillAction);
pill.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pillAction(e); }
});

// ---------- Back to top: the pill launches, the shutter falls ----------
const shutter = document.querySelector('.shutter');
function goTop() {
  if (reduceMotion) { window.scrollTo(0, 0); return; }
  if (shutter.classList.contains('run')) return;
  pill.animate([
    { translate: '0 0', scale: '1 1' },
    { translate: '0 14px', scale: '1.15 .75', offset: 0.18 },
    { translate: '0 -160px', scale: '.7 1.5', offset: 0.45 },
    { translate: '0 -160px', scale: '.7 1.5', offset: 0.8 },
    { translate: '0 0', scale: '1 1' },
  ], { duration: 2000, easing: 'cubic-bezier(.65,0,.35,1)' });
  setTimeout(() => shutter.classList.add('run'), 250);
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    history.replaceState(null, '', location.pathname);
    // replay the hero entrance under the shutter
    document.body.classList.remove('loaded');
    const h1 = document.querySelector('.about [data-split]');
    h1.classList.remove('split-in');
    void h1.offsetWidth;
    setTimeout(() => {
      document.body.classList.add('loaded');
      h1.classList.add('split-in');
    }, 250);
  }, 1070);
  setTimeout(() => shutter.classList.remove('run'), 2350);
}

// ---------- SafarCabby: the laptop opens on scroll and plays the playbook ----------
(() => {
  const stage = document.querySelector('.laptop-stage');
  if (!stage) return;
  const slides = [...stage.querySelectorAll('.dslide')];
  const cab = stage.querySelector('.cab');
  const dotsWrap = stage.querySelector('.deck-dots');
  const HOLD = 3600;
  let idx = 0;
  let timer = null;
  let busy = false;
  let open = 0;

  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.append(d);
    return d;
  });
  dotsWrap.style.setProperty('--dur', `${HOLD}ms`);

  function markDot() {
    dots.forEach((d, i) => {
      d.classList.toggle('on', i === idx);
      d.setAttribute('aria-selected', i === idx);
    });
    // restart the fill animation on the active dot
    const on = dots[idx];
    on.classList.remove('on'); void on.offsetWidth; on.classList.add('on');
  }

  function go(next) {
    next = (next + slides.length) % slides.length;
    if (busy || next === idx) return;
    const prev = slides[idx];
    const incoming = slides[next];
    idx = next;
    markDot();
    if (reduceMotion) { prev.classList.remove('on'); incoming.classList.add('on'); return; }
    busy = true;
    incoming.classList.add('entering');
    cab.classList.remove('drive'); void cab.offsetWidth; cab.classList.add('drive');
    setTimeout(() => {
      prev.classList.remove('on');
      incoming.classList.remove('entering');
      incoming.classList.add('on');
      busy = false;
    }, 1180);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(idx + 1), HOLD);
  }
  function stop() { clearInterval(timer); timer = null; }

  markDot();
  // play only while the laptop is open and on screen
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && open > 0.9) { if (!timer) restart(); } else stop();
  }, { threshold: 0.35 }).observe(stage);

  function onScroll() {
    const r = stage.getBoundingClientRect();
    // closed when the laptop's top meets the bottom of the screen, fully open by the time it reaches 30% from the top
    const t = (innerHeight - r.top) / (innerHeight * 0.72);
    open = reduceMotion ? 1 : Math.max(0, Math.min(1, t));
    // ease the hinge so it settles like a real lid
    const eased = 1 - Math.pow(1 - open, 3);
    stage.style.setProperty('--open', eased.toFixed(4));
    if (open > 0.9 && !timer && r.bottom > 0 && r.top < innerHeight) restart();
    if (open < 0.6) stop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// ---------- Keyboard ----------
document.addEventListener('keydown', (e) => {
  if (lb.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showPhoto(lbIndex + 1, 1);
    if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1, -1);
    return;
  }
  if (e.key === 'Escape') {
    if (galleryState) closeGallery();
    else closeMenu();
  }
});

if (!reduceMotion) {
  // ---------- Scroll-driven effects ----------
  const tracks = [...document.querySelectorAll('.marquee-track')];
  const peeks = [...document.querySelectorAll('.peek-title')];
  const photo = document.querySelector('.about-photo .photo');
  let lastY = window.scrollY;
  let velocity = 0;
  let offset = 0;

  const loop = () => {
    const y = window.scrollY;
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

    const s = Math.min(0.35, Math.abs(velocity) * 0.012);
    if (!pill.getAnimations().length) pill.style.scale = `${1 + s} ${1 - s * 0.45}`;

    peeks.forEach((p) => {
      const r = p.parentElement.getBoundingClientRect();
      p.style.transform = `translateX(${(r.top / innerHeight) * -80}px)`;
    });

    if (photo && document.body.classList.contains('loaded') && y < innerHeight * 1.5) {
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
    const HOVER = 'a, button, .chip-wrap span, .card';
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest(HOVER);
      if (!el) return;
      const text = el.dataset.cursor || (el.matches('.cg-item, .g-card') ? 'View' : '');
      if (text) { ring.classList.add('label'); label.textContent = text; }
      else ring.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest(HOVER);
      if (el && !el.contains(e.relatedTarget)) ring.classList.remove('hover', 'label');
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

    pill.addEventListener('mousemove', (e) => {
      const r = pill.getBoundingClientRect();
      pill.style.translate = `${(e.clientX - (r.left + r.width / 2)) * 0.18}px ${(e.clientY - (r.top + r.height / 2)) * 0.35}px`;
    });
    pill.addEventListener('mouseleave', () => { pill.style.translate = ''; });

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
