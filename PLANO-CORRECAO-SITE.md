# Plano de correção — Site Qótimo Sorvetes

**Data:** 19/09/2026
**Escopo auditado:** `site/index.html` (198 linhas / 122 KB), `site/styles.css` (837 linhas), `site/script.js` (101 linhas), `site/assets/**`
**Referência de verdade:** `identidade/assets-v2/04-referencias-aprovadas/01-home-aprovada.png` (1715×917) e `02-linhas-aprovada.png` (1711×919) — as mesmas duas telas do PDF `Qotimo-Sorvetes-Site-Produtos-Reais.pdf`
**Status:** diagnóstico fechado, nenhuma alteração aplicada ao código.

---

## 1. Resumo do problema em uma frase

O site não foi construído como *layout*; foi construído como **decalque em pixels** da arte de 1711×919 — cada elemento está em `position: absolute` com coordenadas da arte, e toda a escala tipográfica pende de uma variável (`--u`) derivada da **altura do herói**, que por sua vez cresce junto com a **largura da janela**. Resultado: o layout só está correto em uma janela de exatamente 1711×919. Em qualquer outra, tudo cresce (ou encolhe) proporcionalmente sem teto, e os fundos — que são traçados vetoriais gerados a partir do PNG de referência — são recortados em pontos diferentes, virando manchas vermelhas que não existem na arte aprovada.

---

## 2. Diagnóstico com medições reais

Medições feitas no site rodando (`http://127.0.0.1:5510`), via `getBoundingClientRect()`:

| Viewport | Altura do `.hero` | Escala `--u` | Fonte do menu | Título "Descubra seu…" | Board das linhas |
|---|---|---|---|---|---|
| **Arte aprovada** | 919 | 1.000 | 16,7 px | **64 px** | 1654 × 835 |
| 1100 × 800 | 800 | 0,870 | 14,5 px | 39,4 px | 1019 × 514 |
| 1440 × 900 | 900 | 0,979 | 16,3 px | 51,8 px | 1339 × 676 |
| 1920 × 900 | **1031** (115% da tela) | 1,122 | 18,7 px | 69,4 px | 1793 × 905 |
| 2560 × 800 | **1375** (172% da tela) | 1,496 | 25,0 px | **94,1 px** | 2433 × **1228** |

Leitura direta da tabela:

- Em 2560 px de largura o herói ocupa **1,7 tela de altura**, o logo é renderizado a 901 px a partir de um arquivo de 602 px (**upscale de 1,5× em raster** → borrado), e o título da seção sai 47% maior que o aprovado. É exatamente o "tudo muito grande e estourado" dos seus prints.
- Em 1100 px as fontes batem nos pisos `max(24px, …)` enquanto as caixas continuam encolhendo — o texto passa a brigar com o desenho do card.
- O board das linhas (1228 px de altura em 2560×800) **nunca cabe em uma tela**, então as quatro linhas não são mais lidas como uma composição só, que é o ponto da tela 02.

### 2.1 Causas-raiz (ordem de gravidade)

**C1 — A altura do herói é função da largura, e a escala é função da altura.**
`styles.css:64-70`

```css
height: max(100svh, calc(100vw * 919 / 1711));
--u: calc(100cqh / 919);
```

Janela larga → herói mais alto que a tela → `--u > 1` → menu, logo, tagline, botão, pilares e o cone todos ampliados sem limite. Não existe teto (`min(…, 1)`) em lugar nenhum.
*Efeito colateral:* o cálculo usa `100vw` (inclui a barra de rolagem) enquanto o SVG usa 100% do elemento (exclui) — em 1920 px isso dá ~8 px de descasamento vertical entre a onda e o conteúdo.

**C2 — A seção das linhas escala só pela largura, também sem teto.**
`styles.css:353-374`

```css
--u2: calc((100cqw - 2 * var(--m)) / 1654);
.linhas__board{ width: calc(1654 * var(--u2)); height: calc(835 * var(--u2)); }
```

Acima de 1654 px o board simplesmente infla. O título (`64 * --u2`) chega a 94 px. Não há `max-width` e não há trava de altura contra a viewport.

**C3 — Os fundos são traçados do PNG, não vetores desenhados.**
`index.html:122` é **um único `<path>` de 55.847 caracteres** (o arquivo HTML inteiro tem 122 KB por causa disso), com milhares de pontos Bézier de 1 px gerados por auto-trace da imagem de referência. Ele é posicionado ancorado ao board:

```css
.linhas__faixas{ left: calc(-730 * var(--u2)); top: calc(-740 * var(--u2));
                 width: calc(3111 * var(--u2)); height: calc(2319 * var(--u2)); }
```

Como a âncora é o board (largura) e o recorte é a seção (altura variável), **a cada tamanho de janela as faixas vermelhas entram por um lugar diferente** — daí as manchas e o bloco vermelho chapado na base que aparecem no seu print e não existem na arte. Mesmo problema, em menor escala, nos quatro blobs brancos dos cards (`.linha__forma`, 8–9 KB de path cada) que ainda usam `preserveAspectRatio="none"`: eles **esticam de forma não uniforme** quando a proporção do card muda.

**C4 — Layout 100% absoluto, com percentuais individuais por produto.**
Cada imagem tem `left/top/width` próprios em porcentagem (`styles.css:518-562`), mais `rotate` fixo em três picolés. Qualquer mudança de proporção do card desalinha produto e legenda entre si. Não existe nenhuma regra geral — são 45 posições afinadas à mão.

**C5 — Um único ponto de quebra (1023,98 px).**
Entre 1024 e ~1500 px roda o layout absoluto de desktop sem nenhuma adaptação (é a faixa da maioria dos notebooks). Acima de 1711 px não há nada. E o layout empilhado abaixo de 1024 px desliga o desenho dos cards (`.linha__forma{display:none}`), ou seja, **no mobile a identidade visual da tela 02 some** e sobra um card retangular branco.

**C6 — Assets recortados fora do padrão do pacote oficial.**
O `LEIA-ME.md` do pacote define tela simétrica de 1200×1200 por produto e 1600×1200 nos agrupamentos, com margem de segurança. Os arquivos em `site/assets/linhas/*.webp` foram **re-recortados justos** (12 tamanhos diferentes, bbox encostando nas quatro bordas, margem 0 px). Sem margem não há linha de base comum, e por isso cada produto precisou de percentual próprio (C4). O `cone-hero.webp` (700×1302) tem margem de 1 px, ~6,4 mil pixels semitransparentes na silhueta e alguns pontos cinza residuais do recorte — é a "imagem cortada/errada" que você notou.

**C7 — Navegação e links mortos.**

- `#sobre` e `#contato` **não existem no documento**. "Sobre nós", "Contato" e o botão "Peça agora" não fazem nada (o `script.js:92` faz `if (!target) return;`).
- "Produtos" e "Linhas" apontam para o mesmo `#linhas`.
- Os quatro botões "Conheça a linha" apontam para o **id do próprio card** — clicar não leva a lugar nenhum.
- No mobile o menu é uma faixa com rolagem horizontal escondida: em 375 px só aparecem "Início / Produtos / Linh…". Não há menu hambúrguer.

**C8 — Acessibilidade, SEO e robustez.**

- Não existe `<h1>` na página (o nome da marca é `alt` de `<img>`, a tagline é `<p>`, os pilares são `<h2>`).
- `white-space: nowrap` em quase todo texto + `<br>` fixos: em larguras intermediárias o texto não quebra, ele vaza.
- Sem favicon, sem Open Graph, sem rodapé, sem dados de contato (a marca é de Jaraguá do Sul/SC e isso não aparece em lugar nenhum).
- A classe `.js` é adicionada no `<head>` mas quem revela o conteúdo é o `script.js`: se o script falhar em carregar, **cards e fundo ficam em `opacity: 0` para sempre**.
- Fonte Montserrat com `letter-spacing: -.045em` nos títulos é um ajuste para imitar a largura da fonte da arte (geométrica arredondada, família Poppins). Trocar a fonte é mais barato que corrigir a métrica caso a caso.

**C9 — Peso.**
122 KB de HTML (≈98% disso são os paths traçados) antes de qualquer imagem, sem `srcset`, sem `preload` do cone, com `cone.webp` (176 KB) duplicando o `cone-hero.webp` e 10 arquivos `sabor-*`/`scoop-*` que não são usados por nenhuma linha do CSS ou do HTML.

---

## 3. Princípios da correção

1. **A arte de 1711×919 é o alvo em 1440–1711 px, não uma planta em escala.** Acima disso cresce o espaço em volta, não o conteúdo.
2. **Nada em `position: absolute` que possa ser fluxo.** Grid e flex para tudo que é conteúdo; absoluto só para camadas decorativas de fundo.
3. **Tipografia com piso e teto** (`clamp()`), teto = valor da arte.
4. **Fundo é vetor desenhado, não traçado.** Ondas com 4–8 pontos de curva, full-bleed, `preserveAspectRatio="none"` (esticar uma onda é invisível; esticar um blob de card não é — esse ganha proporção controlada).
5. **Produtos usam a tela oficial 1200×1200 com `object-fit: contain` e linha de base comum.** Zero percentual por produto.
6. **Mobile mantém a identidade**: blob, número, gotas e faixas continuam existindo em 375 px, só reorganizados.
7. **Regras invioláveis do `LEIA-ME.md`:** nunca esticar produto; paleta `#003B6B` / `#E52023` / `#FFFFFF`; ondas, cards e botões em CSS/SVG; não alterar rótulos, volumes ou sabores das embalagens.

---

## 4. Plano de execução por fase

### Fase 0 — Rede de segurança

- Inicializar git no projeto (hoje não é repositório) e commitar o estado atual antes de tocar em qualquer coisa.
- Congelar `site/` atual em `site-v1/` como comparativo visual.

### Fase 1 — Fundação de escala (resolve C1, C2)

- Criar tokens em `:root`: `--maxw: 1711px`, `--content: 1440px`, `--gutter: clamp(20px, 4vw, 64px)`.
- **Remover `--u`, `--nu`, `--cu`, `--bu`, `--u2` e todo cálculo `calc(N * var(--u))`.**
- Escala tipográfica com teto na arte:
  - menu: `clamp(.85rem, 1.15vw, 1.05rem)` (teto ~16,8 px)
  - tagline do herói: `clamp(1.15rem, 2.1vw, 1.85rem)` (teto ~29 px)
  - título de seção: `clamp(2rem, 4.4vw, 4rem)` (**teto 64 px**)
  - nome da linha: `clamp(1.5rem, 2.6vw, 2.44rem)` (teto ~39 px)
  - corpo: `clamp(.95rem, 1.2vw, 1.19rem)`
- Espaçamentos em `clamp()` também; nenhum `calc(N * escala)` sobrevive.
- **Critério de aceite:** em 2560×1440, nenhum texto passa do valor de teto; a página é idêntica à de 1711 px exceto pelas margens laterais maiores.

### Fase 2 — Herói (resolve C1, C3 parcial, C6)

- `min-height: clamp(560px, 92svh, 900px)`; **remover** `height: max(100svh, calc(100vw * 919/1711))` e o `container-type: size`.
- Estrutura: grid de 2 colunas `[copy 1fr | cone minmax(280px, 42%)]` acima de 900 px; 1 coluna empilhada abaixo, com o cone antes dos pilares.
- Três camadas de fundo, todas full-bleed e independentes da altura do conteúdo:
  1. base navy sólida;
  2. `waves-hero.svg` — duas faixas vermelhas, `viewBox="0 0 1440 900"`, `preserveAspectRatio="none"`, 6 pontos de curva cada;
  3. `wave-white.svg` — onda branca inferior, `viewBox="0 0 1440 140"`, colada na base do herói, `z-index` **acima** do cone. Isso é obrigatório, não estético: é a onda que "corta" o cascão, como na arte (ver §5.2). Linha da onda a ≈72% da altura do herói.
- Cone: largura ≈20,7% da largura do herói, topo do objeto a ≈15% da altura, `object-fit: contain`. A ponta fica atrás da onda branca. Arquivo: `identidade/assets-v2/03-elementos-hero/qotimo-cascao-hero-1000.webp` (+ `-1400` no `srcset`).
- Pilares: grid de 3 colunas com `gap` fluido e divisórias em `border-inline-start`; abaixo de 760 px vira 1 coluna. Tirar todo `white-space: nowrap` e os `<br>`.
- **Critério de aceite:** em 1366×768, 1440×900, 1920×1080 e 2560×1440 o herói inteiro (menu → pilares) cabe em uma tela sem rolagem, e a onda branca cruza a ponta do cascão nas quatro.

### Fase 3 — Seção Linhas (resolve C2, C3, C4, C5)

- **Apagar o path de 55.847 caracteres** e os quatro paths de blob traçados.
- Fundo: `waves-linhas.svg` full-bleed na seção inteira (não ancorado ao board), duas faixas vermelhas diagonais, `preserveAspectRatio="none"`, altura 100% da seção.
- Board: `max-width: 1654px; margin-inline: auto;` + grid `repeat(2, minmax(0, 1fr))` com `gap: clamp(24px, 3vw, 56px)`; 1 coluna abaixo de 900 px.
- Card: proporção travada (`aspect-ratio: 865 / 332` no desktop, livre no mobile), blob branco como camada SVG única reaproveitada (`viewBox` fixo, 8 pontos), com variação por card via `transform: scaleX(-1)` ou pequena rotação — não quatro paths distintos.
- Interior do card: grid `[texto minmax(200px, 38%) | produtos 1fr]`. Produtos em flex `align-items: flex-end`, cada item `flex: 1 1 0`, imagem `height: clamp(88px, 11vw, 168px); object-fit: contain; object-position: bottom`, legenda no fluxo abaixo. **Zero percentual por produto.**
- Gotas vermelhas: um SVG decorativo de 3 gotas posicionado por card com `inset` percentual (~1 KB).
- **Critério de aceite:** em 1440×900 as quatro linhas cabem em uma tela; em 375 px cada card mantém blob, número, gotas e os três produtos alinhados pela base; nenhuma imagem de produto distorce em nenhuma largura.

### Fase 4 — Assets (resolve C6, C9)

- Trocar `site/assets/linhas/*.webp` pelos oficiais `identidade/assets-v2/01-produtos-individuais/**` (1200×1200), reexportados para WebP em duas medidas (600 e 1200) com `srcset`, **mantendo a tela simétrica**.
- Substituir `cone-hero.webp` pelos arquivos já normalizados em `identidade/assets-v2/03-elementos-hero/qotimo-cascao-hero-{700,1000,1400}.webp` (ver §5.2), com `fetchpriority="high"` + `preload`.
- Trocar `logo-transparente.webp` pelo **SVG** do logo, com o viewBox recentrado (ver §5.1).
- Apagar do repositório: `cone.webp`, `logo.webp`, `sabor-*.webp` (5), `scoop-*.webp` (5) — nenhum é referenciado.
- Meta de peso: **HTML < 20 KB**, CSS < 30 KB, herói acima da dobra < 350 KB.

### Fase 5 — Navegação e seções que faltam (resolve C7)

Decidir entre as duas saídas (recomendo a **A**):

- **A — completar o mínimo institucional:** adicionar `#sobre` (3 parágrafos + foto), `#contato` (WhatsApp, e-mail, endereço em Jaraguá do Sul/SC, mapa opcional, formulário simples ou link direto) e um rodapé com CNPJ/redes. Aí todos os links do menu passam a existir.
- **B — enxugar:** remover "Sobre nós" e "Contato" do menu e apontar "Peça agora" direto para o WhatsApp (`https://wa.me/55…`).
- "Produtos" e "Linhas" não podem apontar para o mesmo destino: ou vira um item só, ou "Produtos" leva a uma seção de catálogo.
- "Conheça a linha" precisa de destino real (página/seção da linha, ou WhatsApp com mensagem pré-preenchida).
- Menu mobile: botão hambúrguer + painel, com `aria-expanded`, foco preso no painel e fechamento por `Esc`. Sem rolagem horizontal.
- Header `sticky` com fundo sólido ao rolar — hoje o menu some junto com o herói.

### Fase 6 — Acessibilidade, SEO e robustez (resolve C8)

- `<h1>` real no herói ("Qótimo Sorvetes — mais sabor em cada momento"), visualmente combinado com o logo.
- Remover `white-space: nowrap` e `<br>` decorativos de todo texto corrido.
- Contraste: `--body: #335F97` sobre branco fica em ~4,4:1 — escurecer para passar 4,5:1.
- Foco visível em todos os interativos, `prefers-reduced-motion` mantido.
- **Inverter a lógica do `.js`:** conteúdo visível por padrão; a animação só se aplica depois que o `script.js` de fato executar (classe adicionada pelo script, não pelo `<head>`).
- `favicon`, `apple-touch-icon`, Open Graph + Twitter card com imagem 1200×630, `<meta name="theme-color">`, JSON-LD `LocalBusiness` com endereço e horário.
- `alt` descritivo em todos os produtos (hoje bons; manter ao trocar os arquivos).

### Fase 7 — QA obrigatório antes de considerar pronto

| Largura × altura | O que checar |
|---|---|
| 360 × 640 | menu hambúrguer, cards empilhados, nada cortado |
| 375 × 812 | idem + blob e gotas presentes |
| 768 × 1024 | transição 1→2 colunas, cone não some |
| 1024 × 768 | faixa crítica de hoje: sem sobreposição texto/produto |
| 1280 × 800 | notebook padrão: herói em 1 tela |
| 1440 × 900 | **deve ficar idêntico à arte aprovada** |
| 1711 × 919 | comparação lado a lado com os PNGs de referência |
| 1920 × 1080 | nada maior que o teto |
| 2560 × 1440 | só as margens crescem |
| 3440 × 1440 | idem, sem faixa vermelha fora de lugar |

Checagens automáticas em cada uma: `document.documentElement.scrollWidth === innerWidth` (sem rolagem horizontal), nenhum elemento com `getBoundingClientRect().right > innerWidth`, altura do herói ≤ altura da viewport, `.linhas__title` ≤ 64 px, console sem erro, Lighthouse ≥ 90 em Performance e ≥ 95 em Acessibilidade.

---

## 5. Imagens que preciso que você gere

| # | Arquivo | Para quê | Situação em 19/09 |
|---|---|---|---|
| 1 | `logo-qotimo.svg` | Logo em vetor, substitui o WebP de 602 px que borra em telas grandes | ✅ **Entregue e aprovado** (ver §5.1) |
| 2 | `cascao-hero-limpo.png` | Cone do herói sem franja, com ponta completa e margem de segurança | ✅ **Entregue e aprovado** (ver §5.2) |
| 3 | `og-qotimo.jpg` | Cartão de compartilhamento 1200×630 | Pendente, prioridade média |
| 4 | `favicon.png` | 512×512, o "Q" sobre navy | Pendente, prioridade média |
| 5 | `fachada-fabrica.jpg` | Só se formos fazer a seção "Sobre nós" (Fase 5A) | Condicional |

### 5.1 Logo SVG — aprovado, com dois ajustes de 1 minuto

`logo-qotimo.svg` (49 KB, viewBox 640×250, três paths: navy, branco, vermelho, sem raster embutido). Renderizado a 300, 600 e 900 px sobre o navy: fiel à arte aprovada, contorno branco e o "SORVETES" preservados, nítido onde o WebP atual já estava borrado. **Pode entrar no lugar do `logo-transparente.webp`.**

Dois ajustes a fazer na implementação (não precisa gerar de novo):

1. **Recentrar o viewBox.** O desenho ocupa x 18,5→612,5 e y 16,5→241,5 dentro de um viewBox de 640×250 — sobra 18,5 px à esquerda contra 27,5 à direita, e 16,5 em cima contra 8,5 embaixo. Trocar para `viewBox="18.5 16.5 594 225"` para o logo alinhar certo na coluna do herói.
2. **Passar o SVGO** (deve cair para ~25–30 KB) e inserir inline no HTML, não como `<img>`, para permitir `currentColor` em versões monocromáticas do rodapé.

Observação técnica sem impacto prático: o arquivo é um *trace* em polígonos (3.597 pontos, 2.142 comandos `L`, zero curvas Bézier), não um vetor redesenhado. Nos tamanhos que o site usa (máx. ~600 px de largura depois do teto de escala) isso é invisível. Se um dia quiser aplicação em grande formato — fachada, veículo, brinde — vale pedir ao cliente o vetor original (.ai/.eps/.pdf).

### 5.2 Cone do herói — RESOLVIDO: `cascao-hero-limpo.png` aprovado

> Atualização de 19/09 19h. A primeira tentativa (`…18_49_25.png`) tinha o cascão cortado e foi recusada. O arquivo `cascao-hero-limpo.png` (1600 × 2800) **passou em todos os critérios e é o que vai para o site.** O histórico abaixo fica registrado porque explica a regra de implementação que saiu dele.

**Por que o arquivo precisa do cone inteiro se no PDF ele aparece cortado.** Medindo a arte aprovada linha a linha na faixa do cone: a largura do waffle cai de 148 px em y=650 para 88 em y=660, 61 em y=680, 35 em y=690, 11 em y=710 e 0 em y=720. **Ele não é cortado — ele afina até virar ponta.** O que dá a impressão de corte é a onda branca, que cruza em y≈665: dali para baixo o fundo já é branco e a ponta clara do cascão quase some contra ele. Ou seja, quem "corta" o cone na arte é a onda, não o arquivo de imagem. Se o corte vier embutido no PNG, ele só cai no lugar certo em uma largura de tela — é exatamente a classe de bug que este plano existe para eliminar. Com o cone inteiro, a onda corta onde quiser, em qualquer viewport.

**Validação do arquivo novo** (`auditoria/mock-hero.png`: arte aprovada em cima, cone novo no meio, cone atual limpo embaixo — os dois montados na mesma posição com a onda branca por cima):

| Critério | Exigido | `cascao-hero-limpo.png` |
|---|---|---|
| Formato | PNG RGBA | ✅ 1600 × 2800 RGBA |
| Margem de segurança | ≥ 6% | ✅ 8% em cima e embaixo (laterais 20,7%, sobra que a normalização apara) |
| Ponta completa | < 3% da largura na última linha | ✅ **1,4%** |
| Borda | sem franja nem serrilhado | ✅ 118 px cinza em 4,5 M (o atual é serrilhado — ver `auditoria/zoom-antes-depois.png`, onde nem o reprocessamento resolve) |
| Silhueta na composição | igual à arte | ✅ com a onda na frente, o mock reproduz a tela aprovada |

O objeto é mais alongado que o da arte (proporção 0,40 contra 0,54), mas isso **deixa de existir na composição**: a parte extra do cascão fica atrás da onda branca. O mock comprova.

**Arquivos já normalizados e guardados em `identidade/assets-v2/03-elementos-hero/`** (tela aparada para 8% de margem nos quatro lados, objeto centralizado):

- `qotimo-cascao-hero.png` — original 1600×2800 recebido
- `qotimo-cascao-hero-1400.webp` — 397 KB, para densidade 2×
- `qotimo-cascao-hero-1000.webp` — 255 KB (172 KB se reexportar em qualidade 82) — **principal**
- `qotimo-cascao-hero-700.webp` — 159 KB, fallback
- `qotimo-logo.svg` — o logo vetorial, na mesma pasta

**Regra de implementação que sai daqui (vale para a Fase 2):** a onda branca é desenhada **na frente** do cone (`z-index` maior). O cone entra com largura ≈ 20,7% da largura do herói (355/1711), topo do objeto a ≈ 15% da altura (138/919), e a linha da onda a ≈ 72% (665/919). A ponta fica escondida atrás da onda — se quiser o detalhe da arte, em que a ponta aparece ~2% abaixo da linha da onda, é só descer o cone 2–3%.

---

### 5.2-histórico — por que a primeira versão foi recusada

Comparativo lado a lado em `auditoria/comparativo-cones.png` (novo · atual · recorte da tela aprovada):

| | Novo (`ChatGPT Image …18_49_25.png`) | Atual (`cone-hero.webp`) | Arte aprovada |
|---|---|---|---|
| Resolução | 1162 × 1354 | 700 × 1302 | — |
| Alfa / borda | **limpa**, 0 pixel cinza residual | **serrilhada**, com franja clara na silhueta (`auditoria/zoom-atual.png`, ampliação 3×) | — |
| Margem de segurança | L188 R186 **T48 B30** | 1 px nos quatro lados | — |
| Cascão | **cortado na base, sem ponta** | ponta completa e afilada | ponta completa e afilada |
| Proporção do objeto | 0,62 (baixo e largo) | 0,54 | **0,54** |

O arquivo novo acertou exatamente o que o atual erra (borda e resolução) e errou o que o atual acerta (silhueta). Como está, ele **reintroduz o problema que estamos corrigindo**: um cascão cortado só funciona se a onda branca cobrir a linha do corte em todas as larguras — é frágil e muda a composição aprovada.

**Prompt corrigido para regerar (use o `site/assets/cone-hero.webp` ou a tela 01 aprovada como imagem de referência anexa):**

> Mesma casquinha de sorvete da imagem de referência, recriada em alta resolução. Sorvete soft de creme com espiral branca alta e **três voltas completas de calda de morango vermelha brilhante** escorrendo pelas laterais em gotas, sobre **cone waffle dourado longo e afilado, terminando em ponta fina e completa** (não cortado, não achatado). Silhueta esbelta e vertical, proporção aproximada de 1 de largura para 1,85 de altura. Fotografia de produto em estúdio, luz suave frontal, altíssima nitidez, sem sombra embutida.
> **Fundo 100% transparente (PNG RGBA), recorte limpo, sem halo branco, sem franja cinza e sem serrilhado na borda.** Objeto inteiro dentro da tela, centralizado, com ~8% de margem vazia em todos os lados, **incluindo abaixo da ponta do cone**. Tela de 1400 × 2600 px, orientação vertical.

Critério de aceite do arquivo (dá para conferir antes de implementar): PNG RGBA, ≥ 1200 px de largura, bbox do alfa com pelo menos 6% de margem nos quatro lados, largura do objeto na última linha visível menor que 3% da largura total (= ponta afilada), zero pixel cinza opaco na silhueta.

**Plano B se a regeração não sair boa:** manter o `cone-hero.webp` atual (a silhueta está certa e bate com a arte), reprocessando só a borda — remoção de matte + suavização de alfa — e reexportando numa tela de 1000 × 1860 com margem. Não ganha resolução real, mas depois do teto de escala da Fase 1 o cone renderiza no máximo a ~420 px de largura, então 700 px de origem já cobre densidade 1,6×.

**Prompt para o item 3 (Open Graph):**

> Composição horizontal 1200×630 px: fundo azul-marinho #003B6B com duas faixas vermelhas #E52023 onduladas atravessando na diagonal, casquinha de sorvete com calda de morango à direita, área livre à esquerda para o logo. Sem texto na imagem.

**Prompt para o item 5 (fachada, se a Fase 5A for aprovada):**

> Fachada de fábrica de sorvetes de porte médio no sul do Brasil, dia claro, céu azul, prédio branco e limpo com detalhes em azul-marinho, caminhão de entrega estacionado, fotografia institucional realista, 2000×1300 px, sem texto e sem logotipos legíveis.

**Não precisa gerar:** as 49 embalagens de produto — o pacote `identidade/assets-v2/01-produtos-individuais/**` já está correto em 1200×1200 RGBA e vai ser usado direto.

---

## 6. Prompt de correção (cole no Claude)

> Você vai corrigir o site em `C:\Users\joaop\OneDrive\Desktop\Projetos\Clientes\QOtimoSorveteria\site`. Leia antes: `PLANO-CORRECAO-SITE.md` (diagnóstico completo), `identidade/assets-v2/LEIA-ME.md` (regras de uso dos assets) e as duas telas aprovadas em `identidade/assets-v2/04-referencias-aprovadas/` — elas são a verdade visual; o PDF é a mesma coisa.
>
> **Objetivo:** manter exatamente o visual aprovado e torná-lo responsivo de 360 px a 3440 px. A arte de 1711×919 é o alvo na faixa 1440–1711 px; acima disso só as margens crescem.
>
> **Regras rígidas:**
> 1. Reescreva `index.html`, `styles.css` e `script.js` do zero a partir da referência — não tente remendar o decalque atual. Faça backup do `site/` em `site-v1/` antes.
> 2. Proibido: `position: absolute` para conteúdo, coordenada em pixel da arte, `calc(N * var(--escala))`, `white-space: nowrap` em texto corrido, `<br>` decorativo.
> 3. Proibido: qualquer `<path>` com mais de ~1.500 caracteres. Todas as ondas e blobs são vetores desenhados à mão com 4–8 pontos de curva. Apague o path de 55.847 caracteres do `index.html` atual.
> 4. Tipografia só com `clamp()`, teto igual ao valor da arte (título de seção 64 px; menu 16,7 px; nome de linha 39 px).
> 5. Layout: CSS Grid/Flex. Herói em 2 colunas (≥900 px) → 1 coluna. Linhas em grid 2×2 (≥900 px) → 1 coluna, board com `max-width: 1654px`.
> 6. Produtos: use os originais de `identidade/assets-v2/01-produtos-individuais/**` (1200×1200), `object-fit: contain`, alinhados pela base, **sem percentual individual por produto**. Nunca esticar.
> 6b. Herói: use `identidade/assets-v2/03-elementos-hero/qotimo-logo.svg` (com o viewBox recentrado, §5.1) e `qotimo-cascao-hero-{700,1000,1400}.webp` no `srcset`. A onda branca é desenhada **na frente** do cone — é ela que corta o cascão (§5.2). Os arquivos antigos `cone-hero.webp` e `logo-transparente.webp` saem.
> 7. O mobile mantém blob, número, gotas e faixas — não desligue a identidade abaixo de 1024 px.
> 8. Conteúdo visível por padrão; animação só como progressive enhancement depois que o JS rodar.
> 9. Paleta fixa: `#003B6B`, `#E52023`, `#FFFFFF`. Fonte: teste Poppins (mais próxima da arte) contra Montserrat comparando com os PNGs, escolha uma e justifique em uma linha.
> 10. **Nesta rodada, execute só as Fases 0 a 4.** Mantenha os seis itens do menu exatamente como na arte aprovada — dar destino real a `#sobre`, `#contato`, "Peça agora" e "Conheça a linha" é a Fase 5 e depende de dados que ainda não tenho. Deixe um comentário `<!-- TODO Fase 5: destino -->` em cada link sem destino, e não invente páginas, textos ou telefones.
>
> **Execute nesta ordem** (Fases 0 a 4 do plano), rodando `preview_start` com a configuração `qotimo-site` e **verificando no navegador a cada fase** nas larguras 375, 768, 1024, 1440, 1711, 1920 e 2560. Em cada verificação me mostre: altura do herói vs. altura da viewport, `font-size` computado do título das linhas, e se `scrollWidth > innerWidth`. Não passe de fase com critério de aceite falhando.
>
> **Não faça:** não invente texto novo além do que está nas telas aprovadas; não redesenhe o logo; não altere rótulos, volumes ou sabores das embalagens; não crie as seções Sobre/Contato nesta rodada; não publique nada.
>
> Ao terminar a Fase 4, pare e me mostre o resultado nas sete larguras antes de qualquer coisa da Fase 5.

---

## 7. Ordem recomendada de trabalho

1. ✅ Feito — logo e cone já estão em `identidade/assets-v2/03-elementos-hero/` (`qotimo-logo.svg`, `qotimo-cascao-hero*.{png,webp}`), validados na §5.1 e §5.2.
2. Roda o prompt da §6 para as Fases 0–4 (fundação + herói + linhas + assets). Isso já entrega as duas telas aprovadas, responsivas.
3. Decide entre Fase 5A (site institucional completo) e 5B (enxugar o menu) — só aí faz sentido gerar os itens 3, 4 e 5.
4. Fases 6 e 7 fecham o trabalho.
