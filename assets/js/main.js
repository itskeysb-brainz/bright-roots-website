/* =========================================================
   BRIGHT ROOTS - SITE SCRIPT (clean version)
   Header, menu, hero slider, cards, lightbox, forms.
   Settings (phone, WhatsApp, etc.) come from WP Admin > Bright Roots.
   ========================================================= */
(function () {
  'use strict';
  var CFG = window.BR || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- header: sticks on scroll + mobile menu ---- */
  var nav = $('#nav'), menu = $('#menu'), burger = $('#burger'), topBtn = $('#totop');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (nav && CFG.sticky !== false) nav.classList.toggle('stuck', y > 160 && !nav.classList.contains('hdr-solid'));
    if (topBtn) topBtn.classList.toggle('on', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  if (burger && menu) {
    var setMenu = function (o) {
      menu.classList.toggle('open', o);
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
      document.body.classList.toggle('menu-open', o);
    };
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180) setMenu(false); });
  }
  $$('.dd-t').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var d = b.parentElement, o = d.classList.toggle('open');
      b.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
  });


  /* ---- quick links come from the Contact & Social settings ---- */
  $$('[data-link]').forEach(function (a) {
    var k = a.getAttribute('data-link'), u = CFG.links && CFG.links[k];
    if (k === 'whatsapp' && CFG.whatsapp) u = 'https://wa.me/' + CFG.whatsapp;
    if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; }
  });

  /* ---- hero slider ---- */
  var slides = $$('.slide'), dots = $('#dots');
  if (slides.length > 1 && dots) {
    var idx = 0, timer;
    slides.forEach(function (_, i) {
      var b = document.createElement('b'); b.addEventListener('click', function () { go(i, true); }); dots.appendChild(b);
    });
    var go = function (i, manual) {
      slides[idx].classList.remove('on'); dots.children[idx].classList.remove('on');
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add('on'); dots.children[idx].classList.add('on');
      if (manual) { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, CFG.speed || 6000); }
    };
    dots.children[0].classList.add('on');
    timer = setInterval(function () { go(idx + 1); }, CFG.speed || 6000);
    var nx = $('#next'), pv = $('#prev');
    if (nx) nx.addEventListener('click', function () { go(idx + 1, true); });
    if (pv) pv.addEventListener('click', function () { go(idx - 1, true); });
  }

  /* ---- photo sliders on programme pages ---- */
  $$('.slider').forEach(function (s) {
    var sl = $$('.sld', s), dts = $('.sl-dots', s), i = 0, t;
    if (!sl.length || !dts) return;
    sl.forEach(function (_, k) { var b = document.createElement('b'); b.addEventListener('click', function () { go(k, true); }); dts.appendChild(b); });
    function go(n, manual) {
      sl[i].classList.remove('on'); dts.children[i].classList.remove('on');
      i = (n + sl.length) % sl.length;
      sl[i].classList.add('on'); dts.children[i].classList.add('on');
      if (manual) { clearInterval(t); t = setInterval(function () { go(i + 1); }, 4800); }
    }
    sl[0].classList.add('on'); dts.children[0].classList.add('on');
    t = setInterval(function () { go(i + 1); }, 4800 + Math.random() * 900);
    var p = $('.sl-prev', s), n = $('.sl-next', s);
    if (p) p.addEventListener('click', function () { go(i - 1, true); });
    if (n) n.addEventListener('click', function () { go(i + 1, true); });
  });

  /* ---- tap-to-open cards ---- */
  $$('.lc-in').forEach(function (c) {
    function toggle() {
      var open = !c.classList.contains('open');
      $$('.lc-in.open').forEach(function (x) { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); });
      if (open) { c.classList.add('open'); c.setAttribute('aria-expanded', 'true'); }
    }
    c.addEventListener('click', toggle);
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* ---- moving round photos: duplicate for a seamless loop ---- */
  $$('.orb-track').forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ---- video ---- */
  var player = $('#player'), vid = $('#video'), play = $('#play');
  if (player && vid && play) play.addEventListener('click', function () { player.classList.add('go'); vid.setAttribute('controls',''); vid.play(); });

  /* ---- gallery lightbox ---- */
  var lb = $('#lb'), lbi = lb && $('img', lb);
  if (lb && lbi) {
    $$('#masonry img').forEach(function (i) {
      i.addEventListener('click', function () { lbi.src = i.currentSrc || i.src; lbi.alt = i.alt; lb.classList.add('on'); });
    });
    lb.addEventListener('click', function () { lb.classList.remove('on'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });
  }

  /* ---- forms: save + email via WordPress, then (optionally) open WhatsApp ---- */
  function wire(form, kind) {
    if (!form) return;
    var btn = $('button[type=submit]', form), hint = $('small', form);
    if (!CFG.waAfter) {
      if (btn) btn.textContent = 'Send message';
      if (hint) hint.style.display = 'none';
    }
    var msg = document.createElement('p'); msg.className = 'br-msg'; msg.setAttribute('role', 'status'); form.appendChild(msg);
    var hp = document.createElement('input'); hp.type = 'text'; hp.name = 'website'; hp.className = 'hp'; hp.tabIndex = -1; hp.autocomplete = 'off'; hp.setAttribute('aria-hidden', 'true'); form.appendChild(hp);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      f.append('action', 'br_enquiry'); f.append('nonce', CFG.nonce); f.append('form', kind);
      msg.className = 'br-msg'; msg.textContent = 'Sending…';
      if (btn) btn.disabled = true;
      var wa = '';
      if (kind === 'admissions') {
        wa = 'Hello Bright Roots! My name is ' + f.get('n') + '. My child (' + f.get('a') + ')' + (f.get('g') ? ' is interested in ' + f.get('g') + ' for 2027 and' : '') + ' needs ' + f.get('c') + '. Please call me on ' + f.get('p') + ' to arrange a visit.';
      } else {
        wa = 'Hello Bright Roots! My name is ' + f.get('n') + ' (' + f.get('p') + '). ' + f.get('m');
      }
      if (!CFG.ajax) {
        if (btn) btn.disabled = false;
        msg.className = 'br-msg ok'; msg.textContent = CFG.ok;
        if (CFG.whatsapp) window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(wa), '_blank');
        form.reset(); return;
      }
      fetch(CFG.ajax, { method: 'POST', body: f, credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (btn) btn.disabled = false;
          if (r && r.success) {
            msg.className = 'br-msg ok'; msg.textContent = (r.data && r.data.message) || CFG.ok || 'Thank you!';
            form.reset();
            if (CFG.waAfter && CFG.whatsapp) window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(wa), '_blank');
          } else {
            msg.className = 'br-msg err'; msg.textContent = (r && r.data && r.data.message) || 'Sorry, something went wrong. Please call us.';
          }
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          msg.className = 'br-msg err'; msg.textContent = 'Could not send. Please check your connection or call us.';
        });
    });
  }
  wire($('#form'), 'admissions');
  wire($('#cform'), 'contact');


  /* ---- Fees & Info: update the visible admission step while scrolling ---- */
  var joinSteps = $$('.join-step');
  if (joinSteps.length && 'IntersectionObserver' in window) {
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          joinSteps.forEach(function (step) { step.classList.remove('is-active'); });
          entry.target.classList.add('is-active');
        }
      });
    }, { root: null, rootMargin: '-38% 0px -38% 0px', threshold: 0 });
    joinSteps.forEach(function (step) { stepObserver.observe(step); });
  }

  /* ---- gentle reveal on scroll (plays once) ---- */
  if (CFG.fx && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var sel = '.sec .wrap > *, .pgm .wrap > *, .pcard, .lc, .ft, .tc, .step, .vcol, .who, .cc, .dteaser, .fcol, .band .wrap > *';
    var targets = $$(sel).filter(function (el) { return !el.closest('.hero,.phero,.orb,.slider,.player'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
