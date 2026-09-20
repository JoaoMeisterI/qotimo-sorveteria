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

  /* --- menu empilhado: hamburguer + painel -------------------------------
     Funciona sem CSS de estado: o botao so alterna aria-expanded e a classe.
     Fecha com Esc, ao clicar num link e ao clicar fora; enquanto aberto o
     Tab circula dentro do painel.
     --------------------------------------------------------------------- */

  var btnMenu = document.querySelector('.nav__menu');
  var painel = document.querySelector('.nav__links');

  if (btnMenu && painel) {
    var abrir = function (sim) {
      btnMenu.setAttribute('aria-expanded', sim ? 'true' : 'false');
      painel.classList.toggle('is-aberto', sim);
      if (sim) {
        // o painel so fica focavel depois que visibility sai de hidden
        window.requestAnimationFrame(function () {
          var primeiro = painel.querySelector('a');
          if (primeiro) primeiro.focus();
        });
      }
    };
    var aberto = function () { return btnMenu.getAttribute('aria-expanded') === 'true'; };

    btnMenu.addEventListener('click', function () { abrir(!aberto()); });

    painel.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) abrir(false);
    });

    document.addEventListener('keydown', function (ev) {
      if (!aberto()) return;
      if (ev.key === 'Escape') { abrir(false); btnMenu.focus(); return; }
      if (ev.key !== 'Tab') return;
      // foco preso: botao + links do painel
      var foco = [btnMenu].concat(Array.prototype.slice.call(painel.querySelectorAll('a')));
      var i = foco.indexOf(document.activeElement);
      if (i === -1) return;
      var prox = ev.shiftKey ? i - 1 : i + 1;
      if (prox < 0) prox = foco.length - 1;
      if (prox >= foco.length) prox = 0;
      ev.preventDefault();
      foco[prox].focus();
    });

    document.addEventListener('click', function (ev) {
      if (aberto() && !ev.target.closest('.nav')) abrir(false);
    });

    /* ao voltar para a composicao de mesa o painel nao pode ficar preso */
    window.matchMedia('(max-width:899px)').addEventListener('change', function () { abrir(false); });
  }

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
  var copy = document.querySelector('.hero__copy');

  if (hero && (faixas.length || cascao)) {
    var pendente = false;

    var pintar = function () {
      pendente = false;
      var y = window.scrollY || window.pageYOffset;
      var altura = hero.offsetHeight || 1;
      var p = Math.min(y / altura, 1);           // 0 → 1 dentro do herói
      /* Deslocamentos em FRACAO da altura do heroi, nao em px fixos: em
         telas menores o heroi encolhe junto com --u, e um valor fixo tiraria
         a ponta do cascao de tras da onda. A folga do cascao e ~4,6% da
         altura, entao 3,4% mantem a ponta sempre coberta. */
      var d = (p * altura * 0.05).toFixed(1);
      Array.prototype.forEach.call(faixas, function (el, i) {
        el.style.transform = 'translate3d(0,' + (i ? -d : d) + 'px,0)';
      });
      if (cascao) cascao.style.transform =
        'translate3d(0,' + (p * altura * -0.034).toFixed(1) + 'px,0)';

      /* O texto sobe um pouco mais que o resto e esmaece: da a leitura de
         que a primeira tela esta saindo, sem esconder nada antes da hora
         (so comeca a apagar depois de 35% do heroi rolado). */
      if (copy) {
        var f = Math.max(0, (p - 0.35) / 0.65);
        copy.style.transform = 'translate3d(0,' + (p * altura * -0.085).toFixed(1) + 'px,0)';
        copy.style.opacity = (1 - f * 0.85).toFixed(3);
      }
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
