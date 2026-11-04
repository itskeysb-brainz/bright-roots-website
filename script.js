/* =========================================================
   BRIGHT ROOTS INTERNATIONAL - SITE INTERACTIONS
   This file controls the animated heading, hero slider,
   mobile navigation, scroll effects, buttons and other
   interactive behaviour. Edit the relevant labelled block.
   ========================================================= */

/* =========================================================
   SITE SETTINGS: change your social links and WhatsApp number here.
   Every WhatsApp / Facebook / Instagram / Google Maps button on the
   website reads from this one block.
   ========================================================= */
const SITE = {
  whatsapp: '256700436527',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  maps: 'https://www.google.com/maps/search/?api=1&query=Bright+Roots+International+Lubowa+Kampala'
};

(function () {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const pal = ['#EF4B3F', '#FF8A1F', '#FFC20E', '#6CC24A', '#2F7BEA', '#8B3FD9', '#FF4F9A'];

  /* ---- hero headline pops in word by word ---- */
  let wi = 0;
  (function wrap(n) {
    [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t.trim()) { f.append(t); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = t; s.style.animationDelay = (2 + wi++ * .09) + 's'; f.append(s);
        });
        c.replaceWith(f);
      } else wrap(c);
    });
  })($('#h1') || document.createElement('i'));

  /* ---- hero slider ---- */
  if ($('#slides')) {
  const slides = $$('.slide'), dots = $('#dots'); let idx = 0, timer;
  slides.forEach((_, i) => { const b = document.createElement('b'); b.onclick = () => go(i, true); dots.append(b); });
  function go(i, manual) {
    slides[idx].classList.remove('on'); dots.children[idx].classList.remove('on');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('on'); dots.children[idx].classList.add('on');
    if (manual) { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6500); }
  }
  dots.children[0].classList.add('on'); timer = setInterval(() => go(idx + 1), 6500);
  $('#next').onclick = () => go(idx + 1, true); $('#prev').onclick = () => go(idx - 1, true);

    }

  /* ---- header: sticks on scroll, mobile menu, active link ---- */
  const nav = $('#nav'), menu = $('#menu'), burger = $('#burger'), top = $('#totop'), bar = $('#progress');
  burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
  $$('.menu a').forEach(a => a.onclick = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('stuck', y > 160); top.classList.toggle('on', y > 700);
    bar.style.width = (y / h * 100) + '%';
    document.querySelectorAll('.hero-copy,.float').forEach(e => { if (y < innerHeight) e.style.translate = `0 ${y * .12}px`; });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  /* ---- quick links: apply the SITE settings above ---- */
  $$('[data-link]').forEach(a => {
    const k = a.dataset.link; let u = SITE[k];
    if (k === 'whatsapp') u = 'https://wa.me/' + SITE.whatsapp + (a.dataset.msg ? '?text=' + encodeURIComponent(a.dataset.msg) : '');
    if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; }
  });

  /* ---- mobile sub-menus ---- */
  $$('.dd-t').forEach(b => b.onclick = e => { e.stopPropagation(); const d = b.parentElement, o = d.classList.toggle('open'); b.setAttribute('aria-expanded', o); });

  /* ---- photo sliders (programme pages) ---- */
  $$('.slider').forEach(s => {
    const sl = $$('.sld', s), dots = $('.sl-dots', s); let i = 0, t;
    sl.forEach((_, k) => { const b = document.createElement('b'); b.onclick = () => go(k, true); dots.append(b); });
    function go(n, manual) {
      sl[i].classList.remove('on'); dots.children[i].classList.remove('on');
      i = (n + sl.length) % sl.length;
      sl[i].classList.add('on'); dots.children[i].classList.add('on');
      if (manual) { clearInterval(t); t = setInterval(() => go(i + 1), 4800); }
    }
    sl[0].classList.add('on'); dots.children[0].classList.add('on');
    t = setInterval(() => go(i + 1), 4800 + Math.random() * 900);
    $('.sl-prev', s).onclick = () => go(i - 1, true); $('.sl-next', s).onclick = () => go(i + 1, true);
  });

  /* =========================================================
     SCROLL ANIMATIONS
     Headings, paragraphs, buttons, images and cards slide in from the
     left, right, bottom or zoom in as they enter the screen, and
     disappear again when they leave, so they replay on every scroll.
     Remove a block's animation by adding class="no-fx" to it.
     ========================================================= */
  (function () {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const legacy = $$('.rv,.rl,.rr'), dirOf = new Map();
    legacy.forEach(e => { dirOf.set(e, e.classList.contains('rl') ? 'l' : e.classList.contains('rr') ? 'r' : null); e.classList.remove('rv', 'rl', 'rr', 'd2', 'd3', 'd4'); });
    if (reduce || !('IntersectionObserver' in window)) return;

    const LEAF = 'h1,h2,h3,h4,p,li,.btn,.chip,.redline,.badge27,img,figure,.ctabar,.map,iframe,.tblwrap,.form,details,.sub,.lead,.lead2';
    const UNIT = '.fcol,.copy,.fbrand,.soc,.pcard,.lc,.ft,.step,.vcol,.who,.card,.cc,.ti,.fcard,.facard,.igrid a,.badge27';
    const SKIP = '.topbar,.nav,header,.menu,.progress,.totop,.lb,.hero,.phero,.slider,.slides,.orb,.track,.marquee,.player,.float,.moon,.sticker,.fall,.spark,.confetti,.no-fx,svg,symbol,script,style,noscript,.dots,.arrow';
    const all = new Set($$(LEAF + ',' + UNIT)); legacy.forEach(e => all.add(e));
    const isBox = el => {
      if (el.matches(UNIT)) return true;
      const s = getComputedStyle(el);
      return (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || s.backgroundImage !== 'none' || s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0;
    };
    const targets = [...all].filter(el => {
      if (el.closest(SKIP) || el.closest('.no-fx')) return false;
      const cs = getComputedStyle(el);
      if (cs.animationName !== 'none' || cs.position === 'fixed' || cs.display === 'none') return false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        if (all.has(a) && isBox(a) && !a.closest(SKIP)) return false;       // a box already animates as one piece
        if (a.matches && a.matches('.menu,.dd')) return false;
      }
      if (!isBox(el) && el.querySelector && [...all].some(c => c !== el && el.contains(c))) return false; // bare wrapper: animate its children instead
      return true;
    });

    document.documentElement.classList.add('fx-boot');
    let seq = 0;
    targets.forEach(el => { el.classList.add('fx'); el._fx = dirOf.get(el) || null; });
    requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('fx-boot')));

    const setDir = el => {
      const r = el.getBoundingClientRect(), cx = (r.left + r.width / 2) / innerWidth, tag = el.tagName;
      let d = el._fx;
      if (!d) {
        if (r.width < innerWidth * .6 && cx < .4) d = 'l';
        else if (r.width < innerWidth * .6 && cx > .6) d = 'r';
        else if (/^H[1-4]$/.test(tag)) d = 'l';
        else if (tag === 'P' || tag === 'LI') d = 'r';
        else if (tag === 'IMG' || el.matches('.map,iframe,figure,.tblwrap')) d = 'z';
        else d = 'u';
      }
      const dist = Math.min(70, innerWidth * .12) + 'px';
      el.style.setProperty('--fx-x', d === 'l' ? '-' + dist : d === 'r' ? dist : '0px');
      el.style.setProperty('--fx-y', d === 'u' ? '46px' : '0px');
      el.style.setProperty('--fx-s', d === 'z' ? '.88' : '1');
    };
    const io = new IntersectionObserver(es => {
      let n = 0;
      es.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
      es.forEach(e => {
        const el = e.target;
        if (e.isIntersecting) {
          if (el.classList.contains('fx-in')) return;
          setDir(el); el.style.setProperty('--fx-delay', (Math.min(n++ * .09, .5) + Math.max(0, 1.9 - performance.now() / 1000)) + 's');
          void el.offsetWidth; el.classList.add('fx-in');
        } else el.classList.remove('fx-in');     // out of view: hide again so it can re-appear
      });
    }, { rootMargin: '0px 0px -30px 0px', threshold: 0 });
    targets.forEach(el => io.observe(el));
    // at the very bottom of the page, make sure nothing is left hidden
    addEventListener('scroll', () => {
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4)
        targets.forEach(el => { if (el.classList.contains('fx') && !el.classList.contains('fx-in') && el.getBoundingClientRect().top < innerHeight) { setDir(el); el.classList.add('fx-in'); } });
    }, { passive: true });
  })();

  /* ---- page wipe: slide the page away before opening another page ---- */
  addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download') || !/^https?:|^file:/.test(a.href)) return;
    if (a.protocol !== location.protocol || a.host !== location.host) return;
    if (a.pathname === location.pathname && a.search === location.search) return;   // same page / #anchor
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    document.documentElement.classList.add('pg-leave');
    setTimeout(() => { location.href = a.href; }, 280);
  });
  addEventListener('pageshow', e => { if (e.persisted) document.documentElement.classList.remove('pg-leave'); });

  /* ---- video ---- */
  const player = $('#player'), vid = $('#video');
  if (player) $('#play').onclick = () => { player.classList.add('go'); vid.play(); };

  /* ---- gallery lightbox ---- */
  const lb = $('#lb'), lbi = $('img', lb);
  $$('#masonry img').forEach(i => i.onclick = () => { lbi.src = i.src; lbi.alt = i.alt; lb.classList.add('on'); });
  lb.onclick = () => lb.classList.remove('on');
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));

  /* ---- admissions form -> WhatsApp, with confetti ---- */
  if ($('#form')) $('#form').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    for (let i = 0; i < 70; i++) {
      const c = document.createElement('i'); c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw'; c.style.background = pal[i % 7]; c.style.animationDelay = Math.random() * .6 + 's';
      c.style.borderRadius = i % 2 ? '50%' : '2px'; document.body.append(c); setTimeout(() => c.remove(), 3500);
    }
    const prog = f.get('g') ? ` is interested in ${f.get('g')} for 2027 and` : '';
    const msg = `Hello Bright Roots! My name is ${f.get('n')}. My child (${f.get('a')})${prog} needs ${f.get('c')}. Please call me on ${f.get('p')} to arrange a visit.`;
    setTimeout(() => open('https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg), '_blank'), 900);
  };

  /* ---- contact form -> WhatsApp ---- */
  if ($('#cform')) $('#cform').onsubmit = e => {
    e.preventDefault(); const f = new FormData(e.target);
    const msg = `Hello Bright Roots! My name is ${f.get('n')} (${f.get('p')}). ${f.get('m')}`;
    open('https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');
  };

  /* ---- long cards: tap to slide the words up over the card, 3D tilt ---- */
  $$('.lc-in').forEach(c => {
    const toggle = () => {
      const o = !c.classList.contains('open');
      $$('.lc-in.open').forEach(x => { x.classList.remove('open'); x.setAttribute('aria-expanded', false); });
      if (o) { c.classList.add('open'); c.setAttribute('aria-expanded', true); }
    };
    c.onclick = toggle;
    c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--rx', (-y * 9) + 'deg'); c.style.setProperty('--ry', (x * 11) + 'deg');
    });
    c.addEventListener('mouseleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  });

  /* ---- moving circular cards: clone for a seamless loop ---- */
  $$('.orb-track').forEach(t => { t.innerHTML += t.innerHTML; });

  /* ---- falling leaves, hand-prints and sparkles (from the Bright Roots tree) ---- */
  const shapes = [
    c => `<svg viewBox="0 0 24 24"><path d="M12 1C20 6 21 16 12 23 3 16 4 6 12 1Z" fill="${c}"/><path d="M12 5V20" stroke="#fff6" stroke-width="1.2"/></svg>`,
    c => `<svg viewBox="0 0 20 24" fill="${c}"><rect x="4" y="9" width="12" height="13" rx="6"/><rect x="4" y="2" width="3" height="12" rx="1.5"/><rect x="8" y="0" width="3" height="12" rx="1.5"/><rect x="12" y="1" width="3" height="12" rx="1.5"/><rect x="15.5" y="5" width="2.8" height="9" rx="1.4"/><rect x=".5" y="11" width="9" height="3.2" rx="1.6" transform="rotate(35 4 12)"/></svg>`
  ], spark = c => `<svg viewBox="0 0 24 24"><path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" fill="${c}"/></svg>`;
  $$('.hero,.phero').forEach(h => {
    const fall = h.clientHeight + 140;
    for (let i = 0; i < 18; i++) {
      const e = document.createElement('span'), z = 24 + Math.random() * 28, c = pal[i % 7];
      e.className = 'fall'; e.innerHTML = shapes[i % 2](c);
      e.style.cssText = `width:${z}px;left:${Math.random() * 96}%;--fall:${fall}px;--dx:${(Math.random() * 120 - 60) | 0}px;animation-duration:${14 + Math.random() * 12}s;animation-delay:${-Math.random() * 24}s`;
      h.append(e);
    }
    for (let i = 0; i < 9; i++) {
      const e = document.createElement('span'), z = 12 + Math.random() * 18;
      e.className = 'spark'; e.innerHTML = spark(i % 2 ? '#FFC20E' : '#fff');
      e.style.cssText = `width:${z}px;left:${Math.random() * 96}%;top:${Math.random() * 70}%;animation-delay:${-Math.random() * 3}s;animation-duration:${1.6 + Math.random() * 2}s`;
      h.append(e);
    }
  });

  $('#yr').textContent = new Date().getFullYear();
})();
