/* =========================================================================
   Qótimo Sorvetes — comportamento

   Progressive enhancement: o conteúdo já está visível no HTML/CSS.
   Só depois que este arquivo executa é que a classe .tem-motion entra e
   habilita a animação de entrada. Se o script não carregar, nada some.
   ========================================================================= */

(function () {
  'use strict';

  var raiz = document.documentElement;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var itens = document.querySelectorAll('.reveal');

  /* --- entrada dos cards ao rolar ---------------------------------------- */

  if (!reduzido && 'IntersectionObserver' in window && itens.length) {
    raiz.classList.add('tem-motion');

    var io = new IntersectionObserver(function (entradas, obs) {
      entradas
        .filter(function (e) { return e.isIntersecting; })
        .map(function (e) { return e.target; })
        .sort(function (a, b) {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        })
        .forEach(function (el, i) {
          el.style.setProperty('--d', (i * 100) + 'ms');
          el.classList.add('is-visible');
          obs.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(itens, function (el) { io.observe(el); });

    /* rede: se algo impedir o observer, revela tudo depois de 2s */
    window.setTimeout(function () {
      Array.prototype.forEach.call(itens, function (el) { el.classList.add('is-visible'); });
    }, 2000);
  }

  /* --- rolagem suave nas âncoras internas -------------------------------- */

  document.addEventListener('click', function (ev) {
    var link = ev.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href');
    if (id === '#') return;

    var alvo = document.querySelector(id);
    if (!alvo) return;                      // TODO Fase 5: #sobre e #contato

    ev.preventDefault();
    alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' });
  });
}());
