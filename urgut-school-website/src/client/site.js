// Progressive enhancement only — every page works without JavaScript.
(function () {
  var body = document.body;

  // Mobile menu: without JS the "Menu" link jumps to the footer navigation.
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('aria-expanded', 'false');

    var setOpen = function (open) {
      body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      setOpen(!body.classList.contains('nav-open'));
    });
    toggle.addEventListener('keydown', function (event) {
      if (event.key === ' ') {
        event.preventDefault();
        setOpen(!body.classList.contains('nav-open'));
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && body.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // "Print / Save as PDF" button on the School Profile.
  document.querySelectorAll('[data-print]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () {
      window.print();
    });
  });
})();
