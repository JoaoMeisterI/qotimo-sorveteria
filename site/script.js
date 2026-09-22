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

  // icones reaproveitados pelos cards de unidade
  var PINO = '<svg viewBox="0 0 16 20" aria-hidden="true" focusable="false"><path d="M8 0a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>';
  var SETA = '<svg viewBox="0 0 20 14" aria-hidden="true" focusable="false"><path d="M1 7h17.5M12.4 1.2 18.5 7l-6.1 5.8"/></svg>';

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

  function movimento() {
    var itens = document.querySelectorAll('.reveal');

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
    var rolar = document.querySelector('.rolar');

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

        /* o indicador some cedo: assim que a rolagem comeca ele ja nao e
           mais util, e nao acompanha o resto ate o fim */
        if (rolar) rolar.style.setProperty('--rolar-op', Math.max(0, 1 - p * 5).toFixed(3));
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

    contadores();
    paralaxeHistoria();
  }

  /* --- paralaxe da secao Nossa historia -----------------------------------
     Texto, fotos e gotas sobem em ritmos diferentes enquanto a secao passa.
     E o que da vida ao vao navy entre o heroi e o titulo: em vez de um
     bloco parado, o conteudo atravessa esse espaco conforme a rolagem.

     A onda vermelha do topo NAO entra: ela esta ancorada no fim da faixa
     branca do heroi (nasce por baixo dela) e qualquer deslocamento
     descolaria a emenda, mostrando a borda reta da arte.
     --------------------------------------------------------------------- */

  function paralaxeHistoria() {
    var seccao = document.querySelector('.historia');
    var camadas = [
      [document.querySelector('.historia__texto'), 34],
      [document.querySelector('.fotos'), 64],
      [document.querySelector('.gotas--a'), 96],
      [document.querySelector('.gotas--b'), -80]
    ].filter(function (c) { return c[0]; });

    if (!seccao || !camadas.length) return;

    var pendente = false;

    var pintar = function () {
      pendente = false;
      var r = seccao.getBoundingClientRect();
      /* 0 quando a secao encosta na base da tela, 1 quando sai pelo topo */
      var q = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      q = Math.min(1, Math.max(0, q));
      camadas.forEach(function (c) {
        c[0].style.transform =
          'translate3d(0,' + ((0.5 - q) * c[1]).toFixed(1) + 'px,0)';
      });
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

  /* Sem animacao para quem pediu movimento reduzido: o conteudo ja esta
     visivel no HTML. Menu, filtros e ancoras funcionam do mesmo jeito. */
  iniciarUnidades();
  if (!reduzido) movimento();
  iniciarAncoras();

  /* --- rolagem suave nas âncoras internas -------------------------------- */

  function iniciarAncoras() {
    document.addEventListener('click', function (ev) {
      var link = ev.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute('href');
      if (id === '#') return;

      var alvo = document.querySelector(id);
      if (!alvo) return;                      // TODO Fase 5: #contato

      ev.preventDefault();
      alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' });
    });
  }
  /* --- contagem dos marcos da historia -----------------------------------
     Conta uma vez so, quando o numero entra na tela. O HTML ja traz o valor
     final, entao sem script (ou com movimento reduzido) nada muda.
     --------------------------------------------------------------------- */

  function contadores() {
    var nums = document.querySelectorAll('[data-conta]');
    if (!nums.length || !('IntersectionObserver' in window)) return;

    var contar = function (el) {
      var fim = +el.getAttribute('data-conta');
      var ini = +(el.getAttribute('data-de') || 0);
      var t0 = null, dur = 1300;
      var passo = function (t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);        // desacelera no fim
        el.textContent = Math.round(ini + (fim - ini) * e);
        if (p < 1) window.requestAnimationFrame(passo);
      };
      window.requestAnimationFrame(passo);
    };

    var io = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        contar(e.target);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(nums, function (el) { io.observe(el); });
  }

  /* --- nossas unidades ----------------------------------------------------
     Cards e botoes de cidade saem de data/unidades.js (fonte unica). Campo
     sem dado confirmado nao aparece: sem endereco nao ha "Como chegar",
     sem horario nao ha "Aberto agora".
     --------------------------------------------------------------------- */

  function iniciarUnidades() {
    var dados = window.QOTIMO_UNIDADES;
    var cidades = window.QOTIMO_CIDADES || [];
    var grade = document.querySelector('.grade');
    var filtros = document.querySelector('.filtros');
    var vazio = document.querySelector('.grade__vazio');
    var status = document.getElementById('unidades-status');
    if (!grade || !filtros || !dados) return;

    cidades.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'filtro';
      b.type = 'button';
      b.setAttribute('data-cidade', c);
      b.setAttribute('aria-pressed', 'false');
      b.textContent = c;
      filtros.appendChild(b);
    });

    // destaque primeiro; o resto na ordem do cadastro
    var lista = dados.slice().sort(function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
    var cards = lista.map(criarCard);
    cards.forEach(function (li) { grade.appendChild(li); });

    var atual = null;
    var aplicar = function (cidade, animar) {
      if (cidade === atual) return;
      atual = cidade;

      Array.prototype.forEach.call(filtros.querySelectorAll('.filtro'), function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-cidade') === cidade ? 'true' : 'false');
      });

      var trocar = function () {
        var n = 0, destaque = false;
        cards.forEach(function (li, i) {
          var ok = !cidade || lista[i].city === cidade;
          li.hidden = !ok;
          if (ok) { n++; if (lista[i].featured) destaque = true; }
        });
        // grade editorial so com a lista completa de quatro e o destaque nela
        grade.setAttribute('data-qtd', n);
        grade.setAttribute('data-layout', n === 4 && destaque ? 'editorial' : 'simples');
        vazio.hidden = n > 0;
        if (!n) vazio.textContent = 'As unidades de ' + cidade + ' estão sendo cadastradas e aparecem aqui em breve.';
        status.textContent = n
          ? n + (n === 1 ? ' unidade exibida' : ' unidades exibidas') + (cidade ? ' em ' + cidade : '') + '.'
          : 'Nenhuma unidade cadastrada em ' + cidade + ' ainda.';
        grade.classList.remove('is-trocando');
      };

      if (!animar || reduzido) return trocar();
      grade.classList.add('is-trocando');       // some rapido, troca, volta
      window.setTimeout(trocar, 160);
    };

    filtros.addEventListener('click', function (ev) {
      var b = ev.target.closest('.filtro');
      if (b) aplicar(b.getAttribute('data-cidade'), true);
    });

    aplicar('', false);
  }

  function criarCard(u) {
    var nome = u.name || 'Unidade Qótimo';
    var li = document.createElement('li');
    li.className = 'card reveal' + (u.featured ? ' card--destaque' : '');

    var art = document.createElement('article');
    art.setAttribute('aria-label', nome);

    var foto = document.createElement('div');
    foto.className = 'card__foto';
    var img = document.createElement('img');
    img.src = u.image.base + '-' + u.image.widths[0] + '.webp';
    img.srcset = u.image.widths.map(function (w) {
      return u.image.base + '-' + w + '.webp ' + w + 'w';
    }).join(', ');
    img.sizes = u.featured
      ? '(max-width: 1099px) 92vw, 44vw'
      : '(max-width: 767px) 92vw, (max-width: 1099px) 46vw, 28vw';
    img.width = 900; img.height = 600;
    img.loading = 'lazy'; img.decoding = 'async';
    img.alt = u.image.alt;
    if (u.image.position) img.style.objectPosition = u.image.position;
    foto.appendChild(img);

    var info = document.createElement('div');
    info.className = 'card__info';

    var h = document.createElement('h3');
    h.className = 'card__nome';
    h.textContent = nome;
    info.appendChild(h);

    var linha = [u.address, u.city ? u.city + ' - SC' : null].filter(Boolean).join(' — ');
    var end = document.createElement('p');
    end.className = 'card__end';
    if (linha) {
      end.innerHTML = PINO;
      end.appendChild(document.createTextNode(linha));
    } else {
      end.textContent = 'Endereço em atualização';
    }
    if (!u.address) end.classList.add('card__end--pendente');
    info.appendChild(end);

    var aberto = abertoAgora(u.openingHours);
    if (aberto !== null) {
      var st = document.createElement('p');
      st.className = 'card__status' + (aberto ? ' is-aberto' : '');
      st.textContent = aberto ? 'Aberto agora' : 'Fechado agora';
      info.appendChild(st);
    }

    var url = linkMapa(u);
    if (url) {
      var a = document.createElement('a');
      a.className = u.featured ? 'btn-pill card__acao' : 'card__link';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', (u.featured ? 'Ver no mapa: ' : 'Como chegar: ') + nome + ' (abre o Google Maps)');
      a.innerHTML = (u.featured ? 'Ver no mapa' : 'Como chegar') + ' ' + SETA;
      info.appendChild(a);
    }

    art.appendChild(foto);
    art.appendChild(info);
    li.appendChild(art);
    return li;
  }

  // so monta link com dado real: link pronto, coordenadas ou endereco
  function linkMapa(u) {
    if (u.mapsUrl) return u.mapsUrl;
    var base = 'https://www.google.com/maps/search/?api=1&query=';
    if (u.coordinates) return base + u.coordinates.lat + ',' + u.coordinates.lng;
    if (u.address) return base + encodeURIComponent(u.address + (u.city ? ', ' + u.city + ' - SC' : ''));
    return null;
  }

  // null quando nao ha horario cadastrado (o card nao mostra status)
  function abertoAgora(h) {
    if (!h) return null;
    var dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    var agora = new Date();
    var min = agora.getHours() * 60 + agora.getMinutes();
    var m = function (t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; };
    var dentro = function (dia, doDiaAnterior) {
      return (h[dias[dia]] || []).some(function (f) {
        var a = m(f[0]), b = m(f[1]);
        if (b > a) return !doDiaAnterior && min >= a && min < b;
        return doDiaAnterior ? min < b : min >= a;   // passa da meia-noite
      });
    };
    var hoje = agora.getDay();
    return dentro(hoje, false) || dentro((hoje + 6) % 7, true);
  }
}());
