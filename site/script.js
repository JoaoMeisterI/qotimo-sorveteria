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
    /* o paralaxe move o CONJUNTO (poster + video + imagem), nunca uma das
       camadas: assim a troca de estado nao desloca nada */
    var cascao = document.querySelector('.hero__cascao');
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

  /* --- cascao que se enche -----------------------------------------------
     O <head> ja decidiu se este navegador entra na animacao (movimento
     reduzido, Save-Data e VP9 fora da jogada) e marcou <html class=
     "cascao-anima">. Aqui so se cuida do video em si:

       poster    imagem do cascao vazio, primeiro quadro do proprio webm
       tocando   video por cima, poster sai em 160 ms
       (fim)     o video para no ultimo quadro — o estado nao muda mais
       fallback  tira a classe do <html> e a pagina volta a ser a de antes

     A validacao do alpha e obrigatoria: um navegador que anuncia VP9 mas
     decodifica o fundo como preto opaco desenharia um retangulo preto sobre
     o heroi. Um quadro vai para um canvas fora da arvore, o canto e lido e
     o canvas e descartado.
     --------------------------------------------------------------------- */

  function cascaoAnimado() {
    if (!raiz.classList.contains('cascao-anima')) return;

    var caixa = document.querySelector('[data-cascao]');
    var video = caixa && caixa.querySelector('.cascao__video');
    var fonte = video && video.querySelector('source[data-src]');
    if (!caixa || !video || !fonte) return;

    var encerrado = false;
    var iniciado = false;

    var desistir = function () {
      if (encerrado) return;
      encerrado = true;
      raiz.classList.remove('cascao-anima');   // volta a imagem preenchida
      caixa.removeAttribute('data-estado');
      try {
        video.pause();
        fonte.removeAttribute('src');
        video.load();                          // para o download pela metade
      } catch (e) {}
    };

    /* canto superior esquerdo do quadro: transparente no webm com alpha,
       255 (preto opaco) em quem ignora o canal */
    var temAlpha = function () {
      try {
        var tela = document.createElement('canvas');
        tela.width = 8;
        tela.height = 8;
        var ctx = tela.getContext('2d');
        if (!ctx) return false;
        ctx.clearRect(0, 0, 8, 8);
        ctx.drawImage(video, 0, 0, 8, 8);
        var a = ctx.getImageData(0, 0, 1, 1).data[3];
        tela.width = tela.height = 0;          // descarta o canvas
        tela = ctx = null;
        return a < 32;
      } catch (e) {
        return false;                          // canvas sujo/bloqueado
      }
    };

    var mostrar = function () {
      if (encerrado || iniciado) return;
      if (video.readyState < 2) return;
      if (!temAlpha()) { desistir(); return; }
      iniciado = true;                         // 'canplay' pode repetir

      /* o autoplay pode ter adiantado alguns quadros enquanto o video estava
         invisivel; volta ao cascao vazio para a animacao comecar do inicio */
      try { if (video.currentTime > 0.05) video.currentTime = 0; } catch (e) {}

      var tocar = video.play();
      if (tocar && tocar.then) tocar.then(assumir, desistir);
      else assumir();
    };

    /* so troca poster por video quando ele ja esta realmente desenhando:
       nada de piscada entre os dois */
    var assumir = function () {
      if (encerrado) return;
      caixa.setAttribute('data-estado', 'tocando');
    };

    video.addEventListener('loadeddata', mostrar);
    video.addEventListener('canplay', mostrar);
    video.addEventListener('playing', assumir);
    /* caminho errado, codec recusado ou rede que caiu: os dois elementos
       avisam, dependendo do navegador */
    video.addEventListener('error', desistir);
    fonte.addEventListener('error', desistir);

    /* rede muito lenta sem erro nenhum: o poster nao pode ficar para sempre
       com o cascao vazio — depois de 12 s entra a imagem preenchida */
    window.setTimeout(function () {
      if (!iniciado) desistir();
    }, 12000);

    /* fim: para no ultimo quadro. Sem loop, sem voltar ao inicio — e por
       isso que rolagem, resize e paralaxe nao tocam no video. */
    video.addEventListener('ended', function () {
      encerrado = true;
      try { video.pause(); } catch (e) {}
    });

    fonte.src = fonte.getAttribute('data-src');
    video.load();
    mostrar();                                 // ja pode estar em cache
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
  cascaoAnimado();

  /* --- menu (barra no topo, mesa e celular) --------------------------------
     O item ativo acompanha a secao que cruza a faixa central da tela. A
     marca (curva + bola vermelha) anda por --i, contado so entre os itens
     VISIVEIS: na mesa "Sobre nos" e o 4o item, no celular o 3o. Secao sem
     item no menu (Unidades) apaga a marca em vez de apontar errado.
     "Mais" (so no celular) e um disclosure: abre/fecha por clique, Esc,
     clique fora e ao escolher um destino; o foco vai para o painel e volta
     para o botao.
     --------------------------------------------------------------------- */

  function iniciarDock() {
    var dock = document.querySelector('.dock');
    if (!dock) return;
    var todos = Array.prototype.slice.call(dock.querySelectorAll('.dock__trilho .dock__item'));
    var itens = todos.filter(function (a) { return a.hasAttribute('data-secao'); });
    var mais = dock.querySelector('.dock__mais');
    var painel = document.getElementById('dock-painel');
    var atual = 'inicio';

    var ativar = function (id) {
      atual = id;
      var ativo = null;
      itens.forEach(function (a) {
        if (a.getAttribute('data-secao') === id) {
          a.setAttribute('aria-current', 'location');
          ativo = a;
        } else {
          a.removeAttribute('aria-current');
        }
      });
      var visiveis = todos.filter(function (a) { return window.getComputedStyle(a).display !== 'none'; });
      var idx = ativo ? visiveis.indexOf(ativo) : -1;
      dock.classList.toggle('sem-ativo', idx < 0);
      if (idx >= 0) dock.style.setProperty('--i', idx);
    };
    ativar('inicio');
    // mesa <-> celular muda quais itens aparecem: recoloca a marca
    window.addEventListener('resize', function () { ativar(atual); }, { passive: true });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { if (e.isIntersecting) ativar(e.target.id); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      ['inicio', 'sobre', 'linhas', 'unidades'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }

    itens.forEach(function (a) {
      a.addEventListener('click', function () { ativar(a.getAttribute('data-secao')); });
    });

    if (!mais || !painel) return;

    var aberto = function () { return mais.getAttribute('aria-expanded') === 'true'; };
    var abrirPainel = function (sim, devolverFoco) {
      mais.setAttribute('aria-expanded', sim ? 'true' : 'false');
      painel.hidden = !sim;
      if (sim) {
        var primeiro = painel.querySelector('a');
        if (primeiro) primeiro.focus();
      } else if (devolverFoco) {
        mais.focus();
      }
    };

    mais.addEventListener('click', function () { abrirPainel(!aberto(), false); });
    painel.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) abrirPainel(false, false);
    });
    document.addEventListener('click', function (ev) {
      if (aberto() && !dock.contains(ev.target)) abrirPainel(false, false);
    });
    document.addEventListener('keydown', function (ev) {
      if (aberto() && ev.key === 'Escape') abrirPainel(false, true);
    });
    // o foco saiu do dock (Tab para frente/tras): o painel fecha
    dock.addEventListener('focusout', function (ev) {
      if (aberto() && ev.relatedTarget && !dock.contains(ev.relatedTarget)) abrirPainel(false, false);
    });
  }

  /* --- inercia entre secoes --------------------------------------------------
     Interpretacao propria do preset "inertia" do fullPage.js (o site nao
     usa fullPage nem tem licenca da extensao Effects). O scroll continua
     NATIVO: nada prende wheel/touch e nao ha encaixe por secao.

     Cada camada tem um alvo que depende de onde ela esta na tela: ao
     entrar pela base ela vem alguns px abaixo (e levemente menor); ja
     assentada, fica em 0; saindo pelo topo, sobe um pouco mais que a
     rolagem. O valor mostrado persegue esse alvo com amortecimento
     exponencial (constante de tempo por camada), entao o conteudo
     "acompanha o gesto e se acomoda" quando a rolagem para — e camadas com
     constante maior chegam depois, a defasagem entre blocos.

     Usa as propriedades translate/scale (separadas de transform): nao
     briga com o .reveal nem com o paralaxe, que escrevem transform. O
     laco de rAF so roda enquanto alguma camada ainda nao chegou.
     --------------------------------------------------------------------- */

  function inercia() {
    var celular = window.matchMedia('(max-width: 899px), (pointer: coarse)');
    /* [seletor, amplitude px, escala na entrada, fator de atraso, mexe na
       opacidade]. So camadas SEM fundo proprio: a faixa branca dos marcos
       (.historia__marcos) e fundo estrutural — desloca-la abria um fio azul
       entre ela e a calda das linhas. */
    var conf = [
      ['.historia__deco', 16, 0, 1, true],
      ['.linhas__head', 20, 0, 1, false],
      ['.linhas__board', 24, 0.015, 1.35, true],
      ['.unidades__head', 20, 0, 1, false],
      ['.grade', 24, 0.015, 1.35, true]
    ];
    var camadas = [];
    conf.forEach(function (c) {
      var el = document.querySelector(c[0]);
      if (el) camadas.push({ el: el, amp: c[1], esc: c[2], tau: 150 * c[3], opa: c[4], y: 0, s: 1, o: 1 });
    });
    if (!camadas.length) return;

    var alvo = function (c) {
      var vh = window.innerHeight || 1;
      var r = c.el.getBoundingClientRect();
      var topo = r.top - c.y;                  // posicao sem o nosso deslocamento
      var base = r.bottom - c.y;
      var fraco = celular.matches ? 0.5 : 1;   // no celular, metade do efeito
      // 0 com o topo na base da tela -> 1 quando o topo chega a 58% da altura
      var e = Math.min(1, Math.max(0, (vh - topo) / (vh * 0.42)));
      // 0 -> 1 conforme a base sobe dos 30% da tela ate o topo
      var s = Math.min(1, Math.max(0, (vh * 0.3 - base) / (vh * 0.3)));
      return {
        y: ((1 - e) * c.amp - s * c.amp * 0.5) * fraco,
        s: celular.matches ? 1 : 1 - (1 - e) * c.esc,
        o: c.opa ? 1 - (1 - e) * 0.3 : 1
      };
    };

    var aplicar = function (c) {
      c.el.style.translate = '0 ' + c.y.toFixed(2) + 'px';
      if (c.esc) c.el.style.scale = c.s.toFixed(4);
      if (c.opa) c.el.style.opacity = c.o.toFixed(3);
    };

    var rodando = false;
    var antes = 0;
    var quadro = function (t) {
      var dt = Math.min(64, t - (antes || t)) || 16;
      antes = t;
      var falta = false;
      camadas.forEach(function (c) {
        var a = alvo(c);
        var k = 1 - Math.exp(-dt / c.tau);
        c.y += (a.y - c.y) * k;
        c.s += (a.s - c.s) * k;
        c.o += (a.o - c.o) * k;
        if (Math.abs(a.y - c.y) > 0.05 || Math.abs(a.s - c.s) > 0.0002 || Math.abs(a.o - c.o) > 0.002) falta = true;
        else { c.y = a.y; c.s = a.s; c.o = a.o; }
        aplicar(c);
      });
      if (falta) window.requestAnimationFrame(quadro);
      else { rodando = false; antes = 0; }
    };
    var acordar = function () {
      if (rodando) return;
      rodando = true;
      window.requestAnimationFrame(quadro);
    };

    /* recarregar no meio da pagina: comeca ja no lugar, sem animar */
    camadas.forEach(function (c) {
      var a = alvo(c);
      c.y = a.y; c.s = a.s; c.o = a.o;
      aplicar(c);
    });

    window.addEventListener('scroll', acordar, { passive: true });
    window.addEventListener('resize', acordar, { passive: true });
  }

  /* --- catalogos ----------------------------------------------------------
     Um modal so (#catalogo), alimentado por CATALOGOS. Quem abre e
     qualquer elemento com data-catalogo="picoles|sorvetes|acai": o card da
     linha inteiro e o botao dele. O clique e delegado e resolvido pelo
     closest(), entao card + botao geram UM evento, nunca dois.

     URL: abrir empilha ?catalogo=<chave> no historico; fechar pelo X, pelo
     "Voltar ao site" ou pelo Esc faz history.back(), e quem esconde o modal
     e o popstate — assim o Voltar do navegador fecha do mesmo jeito.
     Entrou direto com ?catalogo=... valido: abre, e fechar so limpa a URL.
     --------------------------------------------------------------------- */

  var CATALOGOS = {
    picoles: {
      titulo: 'Catálogo de Picolés',
      src: 'assets/catalogos/catalogo-picoles-qotimo.png',
      alt: 'Catálogo de picolés Qótimo',
      w: 1711, h: 4476
    },
    sorvetes: {
      titulo: 'Catálogo de Sorvetes',
      src: 'assets/catalogos/catalogo-sorvetes-qotimo.png',
      alt: 'Catálogo de sorvetes Qótimo',
      w: 1711, h: 3700
    },
    acai: {
      titulo: 'Catálogo de Açaí',
      src: 'assets/catalogos/catalogo-acai-qotimo.png',
      alt: 'Catálogo de açaí Qótimo',
      w: 1711, h: 2900
    }
  };

  /* Areas clicaveis desenhadas na propria arte, em px da imagem original
     (1711 de largura). As tres artes tem o mesmo cabecalho e o mesmo
     rodape, entao as coordenadas valem para todas; so a altura muda.
     "fim" mede a partir do pe da imagem. */
  var ZONAS = {
    picoles:  { x: 334,  y: 348, w: 347, h: 84 },
    sorvetes: { x: 681,  y: 348, w: 347, h: 84 },
    acai:     { x: 1028, y: 348, w: 346, h: 84 },
    fechar:   { x: 1570, y: 50,  w: 68,  h: 68 },
    unidades: { x: 1300, fim: 124, w: 322, h: 70 }
  };

  function iniciarCatalogo() {
    var modal = document.getElementById('catalogo');
    if (!modal) return;

    var titulo = modal.querySelector('#catalogo-titulo');
    var rolagem = modal.querySelector('.catalogo__rolagem');
    var folha = modal.querySelector('.catalogo__folha');
    var img = modal.querySelector('.catalog-image');
    var msg = modal.querySelector('.catalogo__msg');
    var tentar = modal.querySelector('.catalogo__tentar');
    var btnFechar = modal.querySelector('.catalogo__fechar');
    var zonas = modal.querySelectorAll('.catalogo__zona');
    var depois = null;       // ancora para ir depois de fechar

    var atual = null;        // chave aberta
    var origem = null;       // quem abriu: recebe o foco de volta
    var empilhado = false;   // esta aberto por um pushState nosso?
    var yFundo = 0;          // rolagem da pagina ao abrir
    var timer = null;

    var valida = function (k) {
      return k && Object.prototype.hasOwnProperty.call(CATALOGOS, k) ? k : null;
    };
    var chaveDaUrl = function () {
      return valida(new URLSearchParams(window.location.search).get('catalogo'));
    };
    var urlCom = function (k) {
      var u = new URL(window.location.href);
      if (k) u.searchParams.set('catalogo', k);
      else u.searchParams.delete('catalogo');
      return u.pathname + u.search + u.hash;
    };
    var botaoDe = function (k) {
      return document.querySelector('button[data-catalogo="' + k + '"]');
    };

    /* --- imagem: sem src enquanto fechado; ao abrir, carrega na hora --- */

    var pronto = function () {
      folha.classList.remove('is-carregando', 'is-erro');
      rolagem.scrollTop = 0;
    };

    /* posiciona os botoes sobre a arte, em % da imagem: acompanham a
       largura em qualquer tela sem recalculo */
    var posicionarZonas = function (c) {
      Array.prototype.forEach.call(zonas, function (b) {
        var nome = b.getAttribute('data-zona');
        var z = ZONAS[nome];
        var y = z.fim ? c.h - z.fim : z.y;
        b.style.left = (z.x / c.w * 100) + '%';
        b.style.width = (z.w / c.w * 100) + '%';
        b.style.top = (y / c.h * 100) + '%';
        b.style.height = (z.h / c.h * 100) + '%';
        if (CATALOGOS[nome]) {
          var ativa = nome === atual;
          b.setAttribute('aria-current', ativa ? 'true' : 'false');
          b.setAttribute('aria-label', ativa
            ? CATALOGOS[nome].titulo + ' (aberto)'
            : 'Ver ' + CATALOGOS[nome].titulo);
        }
      });
    };

    var carregar = function (forcar) {
      var c = CATALOGOS[atual];
      posicionarZonas(c);
      folha.classList.remove('is-erro');
      folha.classList.add('is-carregando');
      msg.textContent = 'Carregando catálogo…';
      tentar.hidden = true;
      img.alt = c.alt;
      img.width = c.w;
      img.height = c.h;
      img.loading = 'eager';
      if (!forcar && img.getAttribute('src') === c.src && img.complete && img.naturalWidth) {
        pronto();
        return;
      }
      img.src = forcar ? c.src + '?tentativa=' + Date.now() : c.src;
    };

    img.addEventListener('load', function () { if (atual) pronto(); });
    img.addEventListener('error', function () {
      if (!atual || !img.getAttribute('src')) return;
      folha.classList.remove('is-carregando');
      folha.classList.add('is-erro');
      msg.textContent = 'Não foi possível carregar o catálogo';
      tentar.hidden = false;
    });
    tentar.addEventListener('click', function () {
      btnFechar.focus();                   // o botao vai sumir
      carregar(true);
    });

    /* --- mostrar / esconder (so a interface, sem mexer no historico) --- */

    var mostrar = function (k, quem, manterFoco) {
      window.clearTimeout(timer);
      if (modal.hidden) {
        origem = quem || document.activeElement;
        yFundo = window.scrollY || window.pageYOffset;
      }
      atual = k;
      titulo.textContent = CATALOGOS[k].titulo;
      modal.hidden = false;
      raiz.classList.add('catalogo-aberto');   // trava a rolagem do fundo
      carregar(false);
      rolagem.scrollTop = 0;
      void modal.offsetWidth;                   // aplica o estado inicial antes da transicao
      modal.classList.add('is-aberto');
      if (!manterFoco) btnFechar.focus({ preventScroll: true });
    };

    var esconder = function () {
      if (modal.hidden) return;
      atual = null;
      modal.classList.remove('is-aberto');
      raiz.classList.remove('catalogo-aberto');
      /* o history.back() deixa o navegador restaurar a rolagem por conta
         propria, e as vezes ele erra: devolve exatamente onde estava */
      if (Math.abs((window.scrollY || window.pageYOffset) - yFundo) > 1) {
        window.scrollTo({ top: yFundo, left: 0, behavior: 'instant' });
      }
      timer = window.setTimeout(function () { modal.hidden = true; }, reduzido ? 0 : 280);
      var volta = origem;
      origem = null;
      var alvo = depois && document.querySelector(depois);
      depois = null;
      if (alvo) {
        /* "Consultar disponibilidade": sai do catalogo direto nas unidades.
           Um tique depois: o navegador ainda restaura a rolagem do
           history.back() e passaria por cima deste scroll. */
        window.setTimeout(function () {
          alvo.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' });
          alvo.setAttribute('tabindex', '-1');
          alvo.focus({ preventScroll: true });
        }, 60);
      } else if (volta && volta.focus && document.contains(volta)) {
        volta.focus({ preventScroll: true });
      }
    };

    /* --- abrir / fechar (interface + historico) --- */

    var abrir = function (k, quem) {
      k = valida(k);
      if (!k || k === atual) return;
      if (!atual) {
        window.history.pushState({ catalogo: k }, '', urlCom(k));
        empilhado = true;
        mostrar(k, quem);
      } else {
        /* troca de aba dentro do modal: mesma entrada do historico (o
           Voltar continua fechando o modal), so a URL muda */
        window.history.replaceState({ catalogo: k, empilhado: empilhado }, '', urlCom(k));
        mostrar(k, null, true);
      }
    };

    var fechar = function () {
      if (modal.hidden) return;
      if (empilhado) {
        window.history.back();              // o popstate esconde
      } else {
        window.history.replaceState(null, '', urlCom(null));
        esconder();
      }
    };

    window.addEventListener('popstate', function (ev) {
      var k = chaveDaUrl();
      if (k) {
        empilhado = !!(ev.state && ev.state.catalogo && ev.state.empilhado !== false);
        if (k !== atual) mostrar(k, botaoDe(k));
      } else {
        empilhado = false;
        esconder();
      }
    });

    /* --- gatilhos --- */

    document.addEventListener('click', function (ev) {
      var g = ev.target.closest('[data-catalogo]');
      if (!g || modal.contains(g)) return;
      ev.preventDefault();
      var k = g.getAttribute('data-catalogo');
      abrir(k, g.matches('button') ? g : (g.querySelector('button[data-catalogo]') || g));
    });

    modal.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-fechar]')) { fechar(); return; }
      var zona = ev.target.closest('[data-zona]');
      if (zona) {
        var nome = zona.getAttribute('data-zona');
        if (nome === 'fechar') fechar();
        else if (nome === 'unidades') { depois = '#unidades'; fechar(); }
        else abrir(nome);
        return;
      }
      // so o fundo azul fecha; a imagem, a folha e a barra nao
      if (ev.target === modal || ev.target === rolagem) fechar();
    });

    document.addEventListener('keydown', function (ev) {
      if (modal.hidden || !atual) return;
      if (ev.key === 'Escape') { ev.preventDefault(); fechar(); return; }
      if (ev.key !== 'Tab') return;
      // foco preso dentro do modal: so o que esta visivel
      var foco = Array.prototype.filter.call(
        modal.querySelectorAll('a[href], button'),
        function (el) { return !el.hidden && el.offsetParent !== null; }
      );
      if (!foco.length) return;
      var i = foco.indexOf(document.activeElement);
      var prox = ev.shiftKey ? i - 1 : i + 1;
      if (i === -1) prox = ev.shiftKey ? foco.length - 1 : 0;
      if (prox < 0) prox = foco.length - 1;
      if (prox >= foco.length) prox = 0;
      ev.preventDefault();
      foco[prox].focus();
    });

    /* entrou direto com ?catalogo=...: abre; parametro invalido e ignorado */
    var inicial = chaveDaUrl();
    if (inicial) {
      empilhado = false;
      mostrar(inicial, botaoDe(inicial));
    }
  }

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

  /* por ultimo: CATALOGOS (var) so recebe valor quando a execucao passa
     por ele, e a abertura direta por ?catalogo= ja precisa dele */
  iniciarCatalogo();
  iniciarDock();
  if (!reduzido) inercia();
}());
