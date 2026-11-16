/* 滚动入场：只有 JS 生效时才隐藏，避免脚本失效导致整页空白 */
document.documentElement.classList.add('js-reveal');
(function () {
  var targets = document.querySelectorAll('.section-head, .grid, .intro-card, .scribble-bar, .teams-filters, .teams-grid, .teams-note, .connect-box, .footer .container');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal', 'is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  Array.prototype.forEach.call(targets, function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

(function () {
  var copyButtons = document.querySelectorAll('.copy-btn[data-copy]');
  Array.prototype.forEach.call(copyButtons, function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var done = function () {
        var original = btn.textContent;
        btn.textContent = '已复制';
        btn.classList.add('copied');
        window.setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () { fallbackCopy(value, done); });
      } else {
        fallbackCopy(value, done);
      }
    });
  });
  function fallbackCopy(value, done) {
    var input = document.createElement('textarea');
    input.value = value;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(input);
  }
})();

(function () {
  var toggle = document.getElementById('mobileToggle');
  var nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') || e.target.closest('[data-open-phone]')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  var links = Array.prototype.slice.call(nav.querySelectorAll('.nav-link[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();


(function () {
  var modal = document.getElementById('phoneModal');
  if (!modal) return;
  var openers = document.querySelectorAll('[data-open-phone]');
  var closers = modal.querySelectorAll('[data-close-phone]');
  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('phone-open');
    var card = modal.querySelector('.phone-card');
    if (card) card.focus();
  }
  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('phone-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(openers, function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  Array.prototype.forEach.call(closers, function (el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();

(function () {
  var chips = document.querySelectorAll('.filter-chip[data-filter]');
  var cards = document.querySelectorAll('#teamsGrid .team-card');
  var grid = document.getElementById('teamsGrid');
  if (!chips.length || !cards.length) return;

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');
      Array.prototype.forEach.call(chips, function (c) {
        var on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      Array.prototype.forEach.call(cards, function (card) {
        var cities = (card.getAttribute('data-city') || '').split(/\s+/);
        card.classList.toggle('is-hidden', filter !== 'all' && cities.indexOf(filter) === -1);
        card.classList.remove('card-pop');
      });
      if (!grid) return;
      void grid.offsetWidth;
      Array.prototype.forEach.call(cards, function (card) {
        if (!card.classList.contains('is-hidden')) card.classList.add('card-pop');
      });
    });
  });
})();

/* 随手记：点一下换一句，纯装饰，不承载关键信息 */
(function () {
  var bar = document.getElementById('scribbleBar');
  var text = document.getElementById('scribbleText');
  if (!bar || !text) return;
  var notes = [
    '今天适合把方向再核一轮～',
    '最近常被问到：视频生成的效果到底怎么评',
    '有人问我：不看机会能不能聊？能 :)',
    '正在整理各家团队最近的方向变化',
    '一句话：先聊你在做什么，再聊机会',
    '榜单涨分不等于线上真有用，这句我常说'
  ];
  var i = 0;
  bar.addEventListener('click', function () {
    i = (i + 1) % notes.length;
    text.classList.remove('swap');
    void text.offsetWidth;
    text.textContent = notes[i];
    text.classList.add('swap');
  });
})();

/* 右下角随手逛逛 */
(function () {
  var dock = document.getElementById('dock');
  var toggle = document.getElementById('dockToggle');
  var panel = document.getElementById('dockPanel');
  if (!dock || !toggle || !panel) return;

  function open() {
    dock.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }
  function close() {
    dock.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', function () {
    if (dock.classList.contains('open')) close(); else open();
  });

  panel.addEventListener('click', function (e) {
    if (e.target.closest('[data-dock-close]')) { close(); return; }
    if (e.target.closest('[data-dock-top]')) {
      close();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (e.target.closest('a') || e.target.closest('[data-open-phone]') || e.target.closest('[data-copy]')) close();
  });

  document.addEventListener('click', function (e) {
    if (!dock.contains(e.target) && dock.classList.contains('open')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dock.classList.contains('open')) close();
  });
})();

/* 贴纸彩蛋 */
(function () {
  var toast = document.getElementById('toast');
  if (!toast) return;
  var timer = null;
  function show(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }
  var lines = [
    '别紧张，先聊聊就好 :)',
    '今天也适合把行业地图看清楚一点',
    '不用附简历，聊你在做的就行',
    'Hi，看到你啦，随时来聊',
    '方向，比岗位清单有意思多了'
  ];
  var n = 0;
  function hit() { show(lines[n % lines.length]); n += 1; }
  var eggs = document.querySelectorAll('[data-easter]');
  Array.prototype.forEach.call(eggs, function (el) {
    el.addEventListener('click', hit);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(); }
    });
  });
})();
