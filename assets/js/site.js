/* Bright Roots - site script: header, menu, hero slider, reveals, counters, tilt, sliders, gallery, forms */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var CFG = w.BR || {};
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = w.matchMedia && w.matchMedia('(pointer:fine)').matches;

  /* ---- links set in one place (window.BR at the bottom of each page) ---- */
  $$('[data-link]').forEach(function (a) {
    var k = a.getAttribute('data-link'), u = CFG.links && CFG.links[k];
    if (k === 'whatsapp' && CFG.whatsapp) u = 'https://wa.me/' + CFG.whatsapp;
    if (u) a.setAttribute('href', u);
  });
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- page transition curtain ---- */
  function ready() { root.classList.add('ready'); }
  if (d.readyState === 'complete') setTimeout(ready, 60); else w.addEventListener('load', function () { setTimeout(ready, 60); });
  setTimeout(ready, 1800);
  w.addEventListener('pageshow', function (e) { if (e.persisted) { root.classList.remove('leaving'); ready(); } });
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|https?:|javascript:)/i.test(h) || /\.(pdf|mp4|zip)$/i.test(h)) return;
    if (h.indexOf('#') > -1 && h.split('#')[0] === location.pathname.split('/').pop()) return;
    if (reduce) return;
    e.preventDefault(); root.classList.add('leaving');
    setTimeout(function () { location.href = a.href; }, 520);
  });

  /* ---- scroll: progress bar, solid header, back to top, parallax ---- */
  var hd = $('#hd'), bar = $('#progress'), totop = $('#totop');
  var pars = $$('[data-parallax]'), tl = $('.tl');
  var ticking = false;
  function onScroll() {
    var y = w.pageYOffset, max = d.body.scrollHeight - w.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (hd) hd.classList.toggle('is-stuck', y > 90);
    if (totop) totop.classList.toggle('show', y > 700);
    if (!reduce) pars.forEach(function (el) {
      var r = el.parentNode.getBoundingClientRect();
      if (r.bottom < -100 || r.top > w.innerHeight + 100) return;
      var sp = parseFloat(el.getAttribute('data-parallax')) || .2;
      el.style.transform = 'translate3d(0,' + (r.top * -sp).toFixed(1) + 'px,0)';
    });
    if (tl) {
      var r = tl.getBoundingClientRect(), p = (w.innerHeight * .6 - r.top) / r.height;
      tl.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
      $$('.ts', tl).forEach(function (s) { s.classList.toggle('on', s.getBoundingClientRect().top < w.innerHeight * .65); });
    }
    ticking = false;
  }
  w.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  w.addEventListener('resize', onScroll);
  onScroll();
  if (totop) totop.addEventListener('click', function () { w.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---- menu drawer ---- */
  var burger = $('#burger'), drawer = $('#drawer'), ov = $('#drOv'), dx = $('#drClose');
  function menu(open) {
    d.body.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    if (drawer) drawer.setAttribute('aria-hidden', !open);
  }
  if (burger) burger.addEventListener('click', function () { menu(!d.body.classList.contains('menu-open')); });
  if (ov) ov.addEventListener('click', function () { menu(false); });
  if (dx) dx.addEventListener('click', function () { menu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu(false); closeLb(); } });
  $$('.dr-link').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });

  /* ---- split words ---- */
  $$('.sw').forEach(function (el) {
    if (el.getAttribute('data-done')) return;
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(d.createTextNode(' ')); return; }
            var s = d.createElement('span'); s.className = 'w'; s.style.setProperty('--i', i++);
            var inn = d.createElement('i'); inn.textContent = t; s.appendChild(inn); frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
      });
    })(el);
    el.setAttribute('data-done', 1);
  });

  /* ---- reveal on scroll (+ stagger, counters) ---- */
  $$('[data-stagger]').forEach(function (g) {
    var step = parseFloat(g.getAttribute('data-stagger')) || .1;
    Array.prototype.slice.call(g.children).forEach(function (c, i) {
      c.classList.add('rv'); if (!c.hasAttribute('data-rv')) c.setAttribute('data-rv', g.getAttribute('data-rv-kind') || 'up');
      c.style.setProperty('--d', (i * step).toFixed(2) + 's');
    });
  });
  function count(el) {
    var end = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suf') || '', t0 = null, dur = 1600;
    if (reduce) { el.textContent = end + suf; return; }
    (function step(t) {
      if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e) + suf; if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var targets = $$('.rv,.sw,.stat,.title');
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in'); io.unobserve(en.target);
        $$('[data-count]', en.target).forEach(count);
        if (en.target.hasAttribute('data-count')) count(en.target);
      });
    }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else { targets.forEach(function (t) { t.classList.add('in'); $$('[data-count]', t).forEach(count); }); }

  /* ---- 3D tilt + magnetic buttons ---- */
  if (fine && !reduce) {
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .1s'; el.style.transform = 'rotateY(' + (x * 10).toFixed(1) + 'deg) rotateX(' + (-y * 10).toFixed(1) + 'deg) translateY(-8px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)'; el.style.transform = ''; });
    });
    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (x * .28).toFixed(1) + 'px,' + (y * .35).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---- hero slider: the small caption box animates word by word on every slide ---- */
  var hero = $('#hero');
  function words(html) {
    var t = d.createElement('div'); t.innerHTML = html; var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var f = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (x) {
            if (!x) return;
            if (/^\s+$/.test(x)) { f.appendChild(d.createTextNode(' ')); return; }
            var s = d.createElement('span'); s.className = 'hw'; s.style.setProperty('--i', i++);
            var e = d.createElement('i'); e.textContent = x; s.appendChild(e); f.appendChild(s);
          });
          node.replaceChild(f, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(t);
    return t.innerHTML;
  }
  if (hero) {
    var slides = $$('.slide', hero), dotsBox = $('#dots'), h1 = $('#h1'), box = $('#hbox'), cur = 0, timer, first = true, speed = CFG.speed || 6500;
    hero.style.setProperty('--speed', speed + 'ms');
    var dots = slides.map(function (s, i) {
      var b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show slide ' + (i + 1));
      b.addEventListener('click', function () { go(i, true); }); dotsBox.appendChild(b); return b;
    });
    function setText(i) { h1.innerHTML = words(slides[i].getAttribute('data-h')); box.classList.remove('out'); }
    function go(i, user) {
      i = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      dots.forEach(function (b, k) { b.classList.remove('on'); if (k === i) { void b.offsetWidth; b.classList.add('on'); } });
      if (first) { first = false; setText(i); }
      else if (i !== cur) { box.classList.add('out'); setTimeout(function () { setText(i); }, 420); }
      cur = i; clearTimeout(timer); timer = setTimeout(function () { go(cur + 1); }, speed);
    }
    $('#next').addEventListener('click', function () { go(cur + 1, true); });
    $('#prev').addEventListener('click', function () { go(cur - 1, true); });
    var sx = 0;
    hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) { var dx2 = e.changedTouches[0].clientX - sx; if (Math.abs(dx2) > 50) go(cur + (dx2 < 0 ? 1 : -1), true); });
    d.addEventListener('visibilitychange', function () { if (d.hidden) clearTimeout(timer); else go(cur); });
    go(0);
  }

  /* ---- "why choose us": tap or wait, photo and reason change together ---- */
  $$('[data-why]').forEach(function (box) {
    var items = $$('.wr', box), imgs = $$('.wphoto img', box), tag = $('.stk', box), i = 0, t, wt = 5200;
    box.style.setProperty('--wt', wt + 'ms');
    function show(n, user) {
      i = (n + items.length) % items.length;
      items.forEach(function (b, k) { b.classList.remove('on'); if (k === i) { void b.offsetWidth; b.classList.add('on'); } });
      imgs.forEach(function (m, k) { m.classList.toggle('on', k === i); });
      if (tag) { tag.classList.add('sw2'); setTimeout(function () { tag.textContent = imgs[i].getAttribute('data-t'); tag.classList.remove('sw2'); }, 180); }
      clearTimeout(t); t = setTimeout(function () { show(i + 1); }, wt);
    }
    items.forEach(function (b, k) { b.addEventListener('click', function () { show(k, true); }); });
    show(0);
  });

  /* ---- generic crossfade slideshows (.show) ---- */
  $$('.show').forEach(function (box) {
    var sl = $$('.sl', box), db = $('.sd', box), i = 0, t;
    if (sl.length < 2) return;
    var bs = sl.map(function (s, k) { var b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Photo ' + (k + 1)); b.addEventListener('click', function () { show(k); }); db.appendChild(b); return b; });
    function show(n) { i = n % sl.length; sl.forEach(function (s, k) { s.classList.toggle('on', k === i); bs[k].classList.toggle('on', k === i); }); clearTimeout(t); t = setTimeout(function () { show(i + 1); }, 4200); }
    show(0);
  });

  /* ---- review slider ---- */
  $$('[data-slider]').forEach(function (box) {
    var view = $('.sl-view', box), track = $('.sl-track', box), cards = $$('.rcard', track), dotsBox = $('.sl-dots', box);
    var idx = 0, per = 3, timer, dots = [];
    function calc() { per = parseInt(getComputedStyle(box).getPropertyValue('--per')) || 3; }
    function pages() { return Math.max(1, cards.length - per + 1); }
    function build() { dotsBox.innerHTML = ''; dots = []; for (var i = 0; i < pages(); i++) (function (i) { var b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Review ' + (i + 1)); b.addEventListener('click', function () { to(i, true); }); dotsBox.appendChild(b); dots.push(b); })(i); }
    function to(i, user) {
      var n = pages(); idx = (i + n) % n;
      var step = cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 24);
      track.style.transform = 'translateX(' + (-idx * step) + 'px)';
      dots.forEach(function (b, k) { b.classList.toggle('on', k === idx); });
      clearTimeout(timer); timer = setTimeout(function () { to(idx + 1); }, 4800);
    }
    $('.ar.l', box).addEventListener('click', function () { to(idx - 1, true); });
    $('.ar.r', box).addEventListener('click', function () { to(idx + 1, true); });
    var sx = 0, drag = false;
    view.addEventListener('pointerdown', function (e) { sx = e.clientX; drag = true; });
    w.addEventListener('pointerup', function (e) { if (!drag) return; drag = false; var dx = e.clientX - sx; if (Math.abs(dx) > 40) to(idx + (dx < 0 ? 1 : -1), true); });
    box.addEventListener('mouseenter', function () { clearTimeout(timer); });
    box.addEventListener('mouseleave', function () { to(idx); });
    w.addEventListener('resize', function () { calc(); build(); to(Math.min(idx, pages() - 1)); });
    calc(); build(); to(0);
  });

  /* ---- video tour ---- */
  var play = $('#play'), vid = $('#video'), pl = $('#player');
  if (play && vid) {
    play.addEventListener('click', function () { pl.classList.add('go'); vid.controls = true; vid.play(); });
    var closeTour = function () { vid.pause(); vid.currentTime = 0; vid.controls = false; pl.classList.remove('go'); };
    var tx = $('#tourX'); if (tx) tx.addEventListener('click', closeTour);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pl.classList.contains('go')) closeTour(); });
  }

  /* ---- lightbox + gallery filters ---- */
  var lb = $('#lb'), lbImg = lb && $('img', lb), set = [], li = 0;
  function openLb(i) { li = (i + set.length) % set.length; lbImg.src = set[li].src; lbImg.alt = set[li].alt; lb.classList.add('open'); }
  function closeLb() { if (lb) lb.classList.remove('open'); }
  if (lb) {
    $('.x', lb).addEventListener('click', closeLb);
    $('.p', lb).addEventListener('click', function (e) { e.stopPropagation(); openLb(li - 1); });
    $('.n', lb).addEventListener('click', function (e) { e.stopPropagation(); openLb(li + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    d.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'ArrowRight') openLb(li + 1); if (e.key === 'ArrowLeft') openLb(li - 1); });
    $$('[data-lb]').forEach(function (grp) {
      grp.addEventListener('click', function (e) {
        var img = e.target.closest('img'); if (!img) return;
        set = $$('img', grp).filter(function (m) { var f = m.closest('figure'); return !f || !f.classList.contains('hide'); });
        set = set.filter(function (m, k, a) { return a.findIndex(function (z) { return z.src === m.src; }) === k; });
        openLb(set.findIndex(function (m) { return m.src === img.src; }));
      });
    });
  }
  $$('.filters').forEach(function (f) {
    var figs = $$('.masonry figure');
    f.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', f).forEach(function (x) { x.classList.toggle('on', x === b); });
      var c = b.getAttribute('data-f');
      figs.forEach(function (fg) { fg.classList.toggle('hide', c !== 'all' && fg.getAttribute('data-c').split(' ').indexOf(c) < 0); });
    });
  });

  /* ---- forms: open WhatsApp with the message ready to send ---- */
  $$('form[data-wa]').forEach(function (form) {
    var ok = $('.ok', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return;
      var lines = [form.getAttribute('data-wa')];
      $$('label', form).forEach(function (l) {
        var f = $('input,select,textarea', l); if (!f || f.name === 'website') return;
        lines.push(l.childNodes[0].textContent.trim() + ': ' + f.value);
      });
      w.open('https://wa.me/' + (CFG.whatsapp || '256700436527') + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
      if (ok) { ok.textContent = CFG.ok || 'Opening WhatsApp. Thank you!'; ok.classList.add('show'); }
      form.reset();
    });
  });
})();
