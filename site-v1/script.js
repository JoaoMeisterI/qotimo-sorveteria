/* =========================================================================
   Qótimo Sorvetes — comportamento
   ========================================================================= */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------------------
     Entrada do hero: as peças aparecem em sequência curta depois que o
     sorvete carrega, para a composição não montar aos pedaços.
     ----------------------------------------------------------------------- */

  var hero = document.querySelector('.hero');

  if (hero) {
    var pieces = hero.querySelectorAll('.hero__copy, .hero__cone, .pillars');
    var reveal = function () { hero.classList.add('is-ready'); };

    if (reduced) {
      reveal();
    } else {
      Array.prototype.forEach.call(pieces, function (el, i) {
        el.style.setProperty('--delay', (i * 90) + 'ms');
      });

      var cone = hero.querySelector('.hero__cone');
      if (cone && !cone.complete) {
        cone.addEventListener('load', reveal, { once: true });
        cone.addEventListener('error', reveal, { once: true });
        window.setTimeout(reveal, 1200);
      } else {
        requestAnimationFrame(reveal);
      }
    }
  }

  /* -----------------------------------------------------------------------
     Linhas: fundo e cards entram ao rolar (IntersectionObserver).
     Cards que entram juntos recebem intervalo de 100 ms entre si.
     ----------------------------------------------------------------------- */

  var linhas = document.querySelector('.linhas');
  var items = document.querySelectorAll('.reveal');

  function showAll() {
    if (linhas) linhas.classList.add('is-visible');
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    if (linhas) {
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 }).observe(linhas);
    }

    var io = new IntersectionObserver(function (entries, obs) {
      var batch = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .map(function (entry) { return entry.target; })
        .sort(function (a, b) {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });

      batch.forEach(function (el, i) {
        el.style.setProperty('--d', (i * 100) + 'ms');
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* -----------------------------------------------------------------------
     Rolagem suave para as âncoras internas, respeitando movimento reduzido.
     ----------------------------------------------------------------------- */

  document.addEventListener('click', function (ev) {
    var link = ev.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href');
    if (id === '#') return;

    var target = document.querySelector(id);
    if (!target) return;

    ev.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
}());
