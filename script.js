/* ─────────────────────────────────────────────
   Portfolio · interactive layer
───────────────────────────────────────────── */
(function () {
  'use strict';

  /* ─────────── Theme toggle ─────────── */
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon   = document.getElementById('themeIcon');

  const SUN  = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';

  function syncIcon() {
    if (!icon) return;
    icon.innerHTML = (html.getAttribute('data-theme') === 'dark') ? MOON : SUN;
  }
  syncIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = (html.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncIcon();
    });
  }

  /* ─────────── Mini bar chart (dashboard cell 3) ─────────── */
  (function miniBars() {
    const el = document.getElementById('miniBars');
    if (!el) return;
    const data = [4, 7, 5, 9, 12, 6, 14, 11, 16, 9, 13, 18];
    const max  = Math.max.apply(null, data);
    el.innerHTML = data.map((v, i) => {
      const h   = Math.max(2, Math.round((v / max) * 28));
      const hot = i === data.length - 1 ? 'hot' : '';
      return '<i class="' + hot + '" style="height:' + h + 'px"></i>';
    }).join('');
  })();

  /* ─────────── Ticker stripe ─────────── */
  (function ticker() {
    const el = document.getElementById('ticker');
    if (!el) return;
    const items = [
      ['PYTHON',           '42%',          'pos'],
      ['SQL',              '+9%',          'pos'],
      ['CLAUDE API',       'live',         'pos'],
      ['REPOS',            '124',          ''],
      ['MODELS / PROD',    '4',            'pos'],
      ['AAFC',             '95%',          'pos'],
      ['DASHBOARDS · MJR', '∞',            ''],
      ['STONKS.CA',        'shipped',      'pos'],
      ['HONEY BADGER',     'local',        ''],
      ['RAG · FAISS',      'on',           'pos'],
      ['LODESTAR',         'WIP',          'neg'],
      ['LOCATION',         'TORONTO · ON', ''],
      ['STATUS',           'OPEN',         'pos']
    ];
    const html = items.map(([k, v, cls]) =>
      '<span class="stripe-item"><b>' + k + '</b> <span class="delta ' + cls + '">' + v + '</span></span>'
    ).join('');
    // duplicate for seamless marquee loop
    el.innerHTML = html + html;
  })();

  /* ─────────── Live UTC clock ─────────── */
  (function clock() {
    const c1 = document.getElementById('clock');
    const c2 = document.getElementById('clock2');
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
      const d  = new Date();
      const hh = pad(d.getUTCHours());
      const mm = pad(d.getUTCMinutes());
      const ss = pad(d.getUTCSeconds());
      const t  = hh + ':' + mm + ':' + ss;
      if (c1) c1.textContent = t + ' UTC';
      if (c2) c2.textContent = t;
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ─────────── Reveal-on-scroll ─────────── */
  (function reveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  })();

  /* ─────────── Active nav highlight ─────────── */
  (function scrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.navbar a[data-nav]');
    if (!sections.length || !links.length) return;

    let ticking = false;
    function update() {
      let cur = 'hero';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) cur = s.id;
      });
      links.forEach(a => a.classList.toggle('active', a.dataset.nav === cur));
      ticking = false;
    }
    update();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ─────────── Monte Carlo simulator ─────────── */
  (function mc() {
    const canvas = document.getElementById('mcCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.floor(320 * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHistogram();
    }

    const BINS = 40;
    let hist  = new Array(BINS).fill(0);
    let count = 0;
    let sum   = 0;
    let sumSq = 0;
    let samples = [];

    const els = {
      w1:  document.getElementById('w1'),
      w2:  document.getElementById('w2'),
      w3:  document.getElementById('w3'),
      w1v: document.getElementById('w1v'),
      w2v: document.getElementById('w2v'),
      w3v: document.getElementById('w3v'),
      run: document.getElementById('mcRun'),
      status: document.getElementById('mcStatus'),
      n:        document.getElementById('mcN'),
      sMean:    document.getElementById('sMean'),
      sStd:     document.getElementById('sStd'),
      sP5:      document.getElementById('sP5'),
      sP95:     document.getElementById('sP95'),
      sN:       document.getElementById('sN'),
      sVerdict: document.getElementById('sVerdict')
    };

    function updateLabels() {
      els.w1v.textContent = (els.w1.value / 100).toFixed(2);
      els.w2v.textContent = (els.w2.value / 100).toFixed(2);
      els.w3v.textContent = (els.w3.value / 100).toFixed(2);
    }
    ['w1', 'w2', 'w3'].forEach(k => els[k].addEventListener('input', updateLabels));
    updateLabels();

    function getCSSVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    /* Box-Muller normal */
    function randn() {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }
    function clip(v) { return Math.max(0, Math.min(100, v)); }

    function runOnce() {
      const w1 = +els.w1.value / 100;
      const w2 = +els.w2.value / 100;
      const w3 = +els.w3.value / 100;
      const wSum = w1 + w2 + w3 || 1;

      const s1 = clip(70 + randn() * 12);          // salary  ~ N(70, 12)
      const s2 = clip(60 + randn() * 18);          // growth  ~ N(60, 18)
      const rRaw = clip(50 + randn() * 22);        // risk-tolerant ~ N(50, 22)
      const s3 = w3 < 0.4 ? rRaw * 0.6 : rRaw;     // low risk-tolerance penalises risky outcomes

      return clip((s1 * w1 + s2 * w2 + s3 * w3) / wSum);
    }

    function drawHistogram() {
      const w = canvas.width  / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const max     = Math.max.apply(null, hist.concat([1]));
      const barW    = w / BINS;
      const padBot  = 6;

      const ruleC = getCSSVar('--rule-2') || 'rgba(0,0,0,.06)';
      const ink   = getCSSVar('--ink')    || '#141414';
      const acc   = getCSSVar('--accent') || '#c98c40';
      const mean  = count ? sum / count : 50;

      // soft gridlines
      ctx.strokeStyle = ruleC;
      ctx.lineWidth = 1;
      for (let i = 1; i < 5; i++) {
        const y = (h - padBot) * (1 - i / 5);
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(w, y);
        ctx.stroke();
      }

      // bars
      for (let i = 0; i < BINS; i++) {
        const barH = (hist[i] / max) * (h - padBot - 4);
        const x = i * barW + 1;
        const y = h - padBot - barH;
        const binCenter = (i + 0.5) / BINS * 100;
        const isHot = Math.abs(binCenter - mean) < 5;
        ctx.fillStyle = isHot ? acc : ink;
        ctx.fillRect(x, y, Math.max(1, barW - 2), barH);
      }

      // mean line + label
      if (count > 0) {
        const mx = (mean / 100) * w;
        ctx.strokeStyle = acc;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(mx, 0);
        ctx.lineTo(mx, h - padBot);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = acc;
        ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
        const rightAlign = mx > w - 60;
        ctx.textAlign = rightAlign ? 'right' : 'left';
        ctx.fillText('μ ' + mean.toFixed(1), mx + (rightAlign ? -4 : 4), 14);
      }
    }

    function pickVerdict(mean) {
      if (mean >= 65) return { txt: 'GO',      cls: 'go'   };
      if (mean >= 50) return { txt: 'LEAN GO', cls: 'go'   };
      if (mean >= 40) return { txt: 'HOLD',    cls: 'hold' };
      return            { txt: 'PASS',    cls: 'no'   };
    }

    function updateStats() {
      const n = count;
      const mean = n ? sum / n : 0;
      const variance = n ? (sumSq / n) - mean * mean : 0;
      const std = Math.sqrt(Math.max(0, variance));

      let p5 = 0, p95 = 0;
      if (samples.length) {
        const s = samples.slice().sort((a, b) => a - b);
        p5  = s[Math.floor(s.length * 0.05)];
        p95 = s[Math.floor(s.length * 0.95)];
      }

      els.sMean.textContent = n ? mean.toFixed(1) : '—';
      els.sStd.textContent  = n ? std.toFixed(1)  : '—';
      els.sP5.textContent   = n ? p5.toFixed(0)   : '—';
      els.sP95.textContent  = n ? p95.toFixed(0)  : '—';
      els.sN.textContent    = n.toLocaleString();
      els.n.textContent     = 'n = ' + n.toLocaleString();

      if (n >= 1000) {
        const v = pickVerdict(mean);
        els.sVerdict.textContent = v.txt;
        els.sVerdict.className   = 'v ' + v.cls;
      } else {
        els.sVerdict.textContent = '—';
        els.sVerdict.className   = 'v';
      }
    }

    function reset() {
      hist = new Array(BINS).fill(0);
      count = 0; sum = 0; sumSq = 0;
      samples = [];
      drawHistogram();
      updateStats();
    }

    let running = false;
    let target = 0, remaining = 0;

    function step() {
      if (!running) return;
      const batch = Math.min(remaining, 250);
      for (let i = 0; i < batch; i++) {
        const s = runOnce();
        const bin = Math.min(BINS - 1, Math.floor(s / 100 * BINS));
        hist[bin]++;
        count++;
        sum   += s;
        sumSq += s * s;
        samples.push(s);
      }
      remaining -= batch;
      drawHistogram();
      updateStats();

      if (remaining <= 0) {
        running = false;
        els.run.disabled = false;
        els.status.textContent = 'COMPLETE · ' + count.toLocaleString() + ' trials';
        els.status.className   = 'mc-status done';
        return;
      }
      els.status.textContent = 'RUNNING · ' + Math.floor((count / target) * 100) + '%';
      els.status.className   = 'mc-status run';
      requestAnimationFrame(step);
    }

    els.run.addEventListener('click', () => {
      reset();
      target    = 10000;
      remaining = target;
      running   = true;
      els.run.disabled = true;
      els.status.textContent = 'RUNNING · 0%';
      els.status.className   = 'mc-status run';
      requestAnimationFrame(step);
    });

    // initial paint + responsive resize
    resize();
    window.addEventListener('resize', resize);

    // theme-reactive recolour
    const obs = new MutationObserver(() => drawHistogram());
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style']
    });
  })();
})();
