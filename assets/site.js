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
