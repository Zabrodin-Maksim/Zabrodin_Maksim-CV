/* ============================================================
   Maksim Zabrodin — portfolio
   Plain vanilla JS. No frameworks. Runs after the DOM is ready.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- contact form delivery ----------
     A static site can't send email by itself, so the form POSTs to Web3Forms,
     a free form-to-email service that delivers the message to my inbox.
     Get a free key at https://web3forms.com (tied to zabrodin_maksim1@outlook.com)
     and paste it below. Until then, the form falls back to opening a mail client. */
  var WEB3FORMS_KEY = '6bff1bd9-b4c4-45f6-8689-943ebe1d4530';
  var CONTACT_EMAIL = 'zabrodin_maksim1@outlook.com';

  var root = document.getElementById('mz-root');
  if (!root) return;

  var $  = function (id) { return document.getElementById(id); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || root).querySelectorAll(sel)); };

  /* ---------- hover / focus inline styles ----------
     Elements can carry style-hover="..." and style-focus="..." with extra CSS.
     We toggle only the listed properties so other inline styles (e.g. a
     magnetic button's transform) are left untouched. */
  function parseDecls(css) {
    return (css || '').split(';').map(function (d) {
      var i = d.indexOf(':');
      if (i < 0) return null;
      return { prop: d.slice(0, i).trim(), val: d.slice(i + 1).trim() };
    }).filter(Boolean);
  }
  function wireStateStyle(attr, onEvt, offEvt) {
    $$('[' + attr + ']').forEach(function (el) {
      var decls = parseDecls(el.getAttribute(attr));
      if (!decls.length) return;
      var saved = null;
      el.addEventListener(onEvt, function () {
        saved = decls.map(function (d) { return el.style.getPropertyValue(d.prop); });
        decls.forEach(function (d) { el.style.setProperty(d.prop, d.val); });
      });
      el.addEventListener(offEvt, function () {
        if (!saved) return;
        decls.forEach(function (d, i) {
          if (saved[i]) el.style.setProperty(d.prop, saved[i]);
          else el.style.removeProperty(d.prop);
        });
      });
    });
  }
  wireStateStyle('style-hover', 'mouseenter', 'mouseleave');
  wireStateStyle('style-focus', 'focus', 'blur');

  /* ---------- text scramble effect ---------- */
  function scramble(el, text) {
    var chars = '!<>-_\\/[]{}=+*^?#01アイウ';
    var frame = 0, total = 16, startT = performance.now(), deadline = total * 35 + 250;
    if (el._si) clearInterval(el._si);
    function settle() { clearInterval(el._si); el._si = null; el.textContent = text; }
    el._si = setInterval(function () {
      if (performance.now() - startT > deadline) { settle(); return; }
      var out = '';
      for (var i = 0; i < text.length; i++) {
        if (i < (frame / total) * text.length) out += text[i];
        else if (text[i] === ' ') out += ' ';
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out; frame++;
      if (frame > total) settle();
    }, 35);
    setTimeout(settle, 2200);
  }

  /* ---------- color themes ---------- */
  var themes = {
    neon:      { '--bg':'#07070b','--surface':'#0f0f18','--surface2':'#15151f','--text':'#ECECF2','--muted':'#8E8EA6','--border':'rgba(255,255,255,.09)','--accent':'#C6FF3D','--accent2':'#1FE0FF', dot:'198,255,61' },
    editorial: { '--bg':'#0c0a07','--surface':'#16130d','--surface2':'#1c1810','--text':'#F2EEE6','--muted':'#9E948A','--border':'rgba(255,255,255,.09)','--accent':'#F5A623','--accent2':'#FF5E3A', dot:'245,166,35' },
    playful:   { '--bg':'#0b0814','--surface':'#150f24','--surface2':'#1b1430','--text':'#F0ECF8','--muted':'#9A8EB0','--border':'rgba(255,255,255,.1)','--accent':'#FF3D9A','--accent2':'#6E5BFF', dot:'255,61,154' }
  };
  var dot = '198,255,61';
  function applyTheme(name) {
    var t = themes[name]; if (!t) return;
    Object.keys(t).forEach(function (k) { if (k.indexOf('--') === 0) root.style.setProperty(k, t[k]); });
    document.body.style.background = t['--bg'];
    dot = t.dot;
  }
  $$('[data-theme]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyTheme(btn.getAttribute('data-theme')); });
  });

  /* ---------- language switch (EN / CS) ---------- */
  var langBtn = $('mz-langBtn'), langLabel = $('mz-langLabel');
  function toggleLang() {
    var next = root.dataset.lang === 'en' ? 'cs' : 'en';
    root.dataset.lang = next;
    $$('[data-en]').forEach(function (el) {
      var v = el.getAttribute('data-' + next);
      if (v != null) { if (el.hasAttribute('data-scramble')) scramble(el, v); else el.textContent = v; }
    });
    $$('[data-en-ph]').forEach(function (el) {
      var v = el.getAttribute('data-' + next + '-ph');
      if (v != null) el.placeholder = v;
    });
    if (langLabel) langLabel.textContent = next === 'en' ? 'CZ' : 'EN';
  }
  if (langBtn) langBtn.addEventListener('click', toggleLang);

  /* ---------- download-CV dropdown ---------- */
  var cvWrap = $('mz-cvWrap'), cvMenu = $('mz-cvMenu');
  var cvBtn = cvWrap && cvWrap.querySelector('[data-action="cv-toggle"]');
  if (cvBtn && cvMenu) {
    cvBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      cvMenu.style.display = cvMenu.style.display === 'flex' ? 'none' : 'flex';
    });
    document.addEventListener('click', function (e) {
      if (cvWrap && !cvWrap.contains(e.target)) cvMenu.style.display = 'none';
    });
  }

  /* ---------- contact form ---------- */
  var form = $('mz-form'), submit = $('mz-submit');
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  function fieldVal(name) {
    return (form && form.elements[name] && form.elements[name].value || '').trim();
  }
  function formValid() {
    return form && fieldVal('name').length > 0 && EMAIL_RE.test(fieldVal('email')) && fieldVal('message').length > 0;
  }
  function onFormInput() {
    if (!form || !submit) return;
    if (form.elements.name) form.elements.name.setCustomValidity(fieldVal('name') ? '' : 'Please enter your name');
    if (form.elements.email) form.elements.email.setCustomValidity(EMAIL_RE.test(fieldVal('email')) ? '' : 'Please enter a valid email address');
    if (form.elements.message) form.elements.message.setCustomValidity(fieldVal('message') ? '' : 'Please enter a message');
    var ok = formValid();
    submit.disabled = !ok;
    submit.style.opacity = ok ? '1' : '.45';
    submit.style.cursor = ok ? 'pointer' : 'not-allowed';
  }
  var toastEl = null, toastTimer = null;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.style.cssText = "position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(20px);z-index:9999;padding:14px 22px;border-radius:12px;background:var(--accent);color:#07070b;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:15px;box-shadow:0 12px 40px rgba(0,0,0,.35);opacity:0;transition:opacity .3s,transform .3s;pointer-events:none";
      root.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.style.opacity = '1'; toastEl.style.transform = 'translateX(-50%) translateY(0)'; });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.style.opacity = '0'; toastEl.style.transform = 'translateX(-50%) translateY(20px)'; }, 4000);
  }
  function sendLabel() { return submit.getAttribute('data-' + (root.dataset.lang || 'en')) || 'Send message →'; }
  // Success state: green outline, clear the fields, show a toast.
  function markSent() {
    submit.textContent = "✓ Thanks — I'll reply soon";
    submit.style.background = 'transparent';
    submit.style.color = 'var(--accent)';
    submit.style.border = '1px solid var(--accent)';
    $$('input,textarea', form).forEach(function (i) { i.value = ''; if (i.setCustomValidity) i.setCustomValidity(''); });
    submit.disabled = true; submit.style.opacity = '.45'; submit.style.cursor = 'not-allowed';
    showToast("Thanks — I'll reply soon!");
  }
  // Fallback: if the real send can't go through, open the visitor's own mail
  // client with everything pre-filled so the message is never lost.
  function fallbackToMail(name, email, message, subject) {
    var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    submit.disabled = false; submit.textContent = sendLabel();
  }
  if (form && submit) {
    form.addEventListener('input', onFormInput);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submit.disabled || !formValid()) { form.reportValidity(); return; }
      var name = fieldVal('name'), email = fieldVal('email'), message = fieldVal('message');
      var subject = 'Portfolio inquiry — ' + (name || email);

      // 1) Try to really deliver the message via Web3Forms (emails me directly).
      submit.disabled = true; submit.textContent = 'Sending…';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: subject,
          from_name: name,   // shown as the sender's name
          email: email,      // becomes the Reply-To, so I can reply to the visitor
          message: message
        })
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        // 2a) Delivered -> done.
        if (res && res.success) markSent();
        // 2b) Service reachable but refused -> hand off to the mail client.
        else fallbackToMail(name, email, message, subject);
      })
      // 3) Offline / blocked / network error -> hand off to the mail client.
      .catch(function () { fallbackToMail(name, email, message, subject); });
    });
    onFormInput();
  }

  /* ---------- animated background: particle constellation ---------- */
  var canvas = $('mz-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, parts = [], mouse = { x: -9999, y: -9999 };
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var n = Math.min(86, Math.floor(W * H / 19000));
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
          r: Math.random() * 1.6 + .6
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, j;
      for (i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { var f = (14000 - d2) / 14000 * .9; p.x += dx / Math.sqrt(d2 + 1) * f; p.y += dy / Math.sqrt(d2 + 1) * f; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }
      for (i = 0; i < parts.length; i++) {
        for (j = i + 1; j < parts.length; j++) {
          var a = parts[i], b = parts[j], ex = a.x - b.x, ey = a.y - b.y, d = Math.sqrt(ex * ex + ey * ey);
          if (d < 130) { ctx.strokeStyle = 'rgba(' + dot + ',' + (1 - d / 130) * .16 + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      for (i = 0; i < parts.length; i++) {
        var q = parts[i];
        ctx.fillStyle = 'rgba(' + dot + ',.5)'; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 7); ctx.fill();
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- cursor glow ---------- */
  var cursor = $('mz-cursor');
  if (cursor) {
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    cursor.style.left = '0px'; cursor.style.top = '0px';
    (function lerp() {
      cx += (tx - cx) * .6; cy += (ty - cy) * .6;
      cursor.style.transform = 'translate(' + (cx - 260) + 'px,' + (cy - 260) + 'px)';
      requestAnimationFrame(lerp);
    })();
  }

  /* ---------- scroll reveal + counters + scramble on view ---------- */
  var reveals = $$('[data-reveal]');
  reveals.forEach(function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(34px)'; el.style.willChange = 'opacity, transform'; });
  var scrambles = $$('[data-scramble]');
  var scrambleSet = [];
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function revealEl(el) {
    var delay = parseFloat(el.style.transitionDelay) * 1000 || 0;
    var dur = 820, start = performance.now() + delay, done = false;
    function finish() { if (done) return; done = true; el.style.opacity = '1'; el.style.transform = 'none'; el.style.willChange = 'auto'; }
    (function tick(now) {
      if (done) return;
      var p = Math.max(0, Math.min(1, (now - start) / dur)), e = easeOut(p);
      el.style.opacity = e;
      el.style.transform = 'translateY(' + (34 * (1 - e)) + 'px)';
      if (p < 1) requestAnimationFrame(tick); else finish();
    })(performance.now());
    setTimeout(finish, delay + dur + 80);
  }
  var counters = $$('[data-count]');
  function runCount(el) {
    var target = +el.dataset.count, v = 0;
    (function step() {
      v += target / 38;
      if (v >= target) el.textContent = target;
      else { el.textContent = Math.floor(v); requestAnimationFrame(step); }
    })();
    setTimeout(function () { el.textContent = target; }, 1300);
  }
  function checkReveal() {
    var trigger = window.innerHeight * 0.92, i;
    for (i = reveals.length - 1; i >= 0; i--) {
      if (reveals[i].getBoundingClientRect().top < trigger) { revealEl(reveals[i]); reveals.splice(i, 1); }
    }
    for (i = counters.length - 1; i >= 0; i--) {
      if (counters[i].getBoundingClientRect().top < trigger) { runCount(counters[i]); counters.splice(i, 1); }
    }
    scrambles.forEach(function (el) {
      if (scrambleSet.indexOf(el) < 0 && el.getBoundingClientRect().top < trigger) { scrambleSet.push(el); scramble(el, el.textContent); }
    });
  }

  /* ---------- scroll progress bar + timeline fill ---------- */
  var progress = $('mz-progress'), timeline = $('mz-timeline'), timelineFill = $('mz-timelineFill');
  function onScroll() {
    var st = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? st / max * 100 : 0) + '%';
    if (timeline && timelineFill) {
      var rect = timeline.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh * .6 - rect.top) / rect.height));
      timelineFill.style.height = (p * 100) + '%';
    }
    checkReveal();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var t0 = null;
  (function initReveal(ts) {
    if (t0 == null) t0 = ts;
    checkReveal();
    if (ts - t0 < 2000 && reveals.length) requestAnimationFrame(initReveal);
  })(performance.now());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(checkReveal);
  window.addEventListener('load', checkReveal);

  var scrolled = false;
  window.addEventListener('scroll', function () { scrolled = true; }, { passive: true, once: true });
  setTimeout(function () {
    if (scrolled) return;
    reveals.slice().forEach(revealEl); reveals.length = 0;
    counters.slice().forEach(runCount); counters.length = 0;
    scrambles.forEach(function (el) { if (scrambleSet.indexOf(el) < 0) { scrambleSet.push(el); scramble(el, el.textContent); } });
  }, 3800);

  /* ---------- terminal typewriter ---------- */
  var tp = $('mz-type');
  if (tp) {
    var full = tp.getAttribute('data-' + (root.dataset.lang || 'en')) || tp.textContent;
    tp.textContent = '';
    var ti = 0;
    var tint = setInterval(function () { tp.textContent = full.slice(0, ti); ti++; if (ti > full.length) clearInterval(tint); }, 16);
    setTimeout(function () { clearInterval(tint); if (tp.textContent.length < full.length) tp.textContent = full; }, 4000);
  }

  /* ---------- 3D tilt on cards ---------- */
  $$('[data-tilt]').forEach(function (card) {
    card.addEventListener('mouseenter', function () { card.style.transition = 'transform .1s'; });
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = 'perspective(900px) rotateY(' + px * 7 + 'deg) rotateX(' + (-py * 7) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transition = 'transform .4s ease'; card.style.transform = 'none'; });
  });

  /* ---------- magnetic buttons ---------- */
  $$('[data-magnetic]').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      btn.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .25 + 'px,' + (e.clientY - r.top - r.height / 2) * .25 + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform .35s ease'; btn.style.transform = 'none';
      setTimeout(function () { btn.style.transition = ''; }, 350);
    });
  });
})();
