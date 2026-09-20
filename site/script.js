/* =========================================================================
   Qótimo Sorvetes — comportamento

   Progressive enhancement: o conteúdo já está visível no HTML/CSS.
   Só depois que este arquivo executa é que a classe .tem-motion entra e
   habilita a animação. Se o script não carregar, nada some.
   ========================================================================= */

(function () {
  'use strict';

  var raiz = document.documentElement;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var itens = document.querySelectorAll('.reveal');

  if (reduzido) return iniciarAncoras();

  /* --- entrada ao rolar --------------------------------------------------
     Cada bloco sobe e aparece quando entra na tela. Blocos que entram
     juntos recebem 90 ms de intervalo entre si.
     --------------------------------------------------------------------- */

  if ('IntersectionObserver' in window && itens.length) {
    raiz.classList.add('tem-motion');

    var io = new IntersectionObserver(function (entradas, obs) {
      entradas
        .filter(function (e) { return e.isIntersecting; })
        .map(function (e) { return e.target; })
        .sort(function (a, b) {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        })
        .forEach(function (el, i) {
          el.style.setProperty('--d', (i * 90) + 'ms');
          el.classList.add('is-visible');
          obs.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(itens, function (el) { io.observe(el); });

    /* rede: se algo impedir o observer, revela tudo depois de 2s */
    window.setTimeout(function () {
      Array.prototype.forEach.call(itens, function (el) { el.classList.add('is-visible'); });
    }, 2000);
  }

  /* --- paralaxe leve no herói --------------------------------------------
     As faixas de fundo e o cascão andam mais devagar que a rolagem, o que
     dá profundidade à primeira tela sem tirar nada do lugar.
     --------------------------------------------------------------------- */

  var hero = document.querySelector('.hero');
  var faixas = document.querySelectorAll('.hero__faixa');
  var cascao = document.querySelector('.hero__cascao img');

  if (hero && (faixas.length || cascao)) {
    var pendente = false;

    var pintar = function () {
      pendente = false;
      var y = window.scrollY || window.pageYOffset;
      var altura = hero.offsetHeight || 1;
      var p = Math.min(y / altura, 1);           // 0 → 1 dentro do herói
      var d = (p * 46).toFixed(1);
      Array.prototype.forEach.call(faixas, function (el, i) {
        el.style.transform = 'translate3d(0,' + (i ? -d : d) + 'px,0)';
      });
      if (cascao) cascao.style.transform = 'translate3d(0,' + (p * -34).toFixed(1) + 'px,0)';
    };

    var aoRolar = function () {
      if (pendente) return;
      pendente = true;
      window.requestAnimationFrame(pintar);
    };

    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar, { passive: true });
    pintar();
  }

  iniciarAncoras();

  /* --- rolagem suave nas âncoras internas -------------------------------- */

  function iniciarAncoras() {
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
  }
}());
