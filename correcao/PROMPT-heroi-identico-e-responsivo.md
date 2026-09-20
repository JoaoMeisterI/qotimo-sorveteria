# Tarefa: herói idêntico à arte aprovada + site 100% responsivo

## Objetivo
Deixar a primeira dobra (menu, faixas, logo, tagline, botão, cascão, onda branca, pilares)
igual à arte aprovada em qualquer tela, e fechar a responsividade do resto do site.
Projeto: HTML/CSS/JS puro em `site/`. Preview: `python servir.py 5510`.

## Fonte da verdade
`identidade/assets-v2/04-referencias-aprovadas/01-home-aprovada.png` (1715×917).
Trate como o quadro 1713×918 que o CSS já usa (diferença < 0,2%).
Todas as medidas abaixo são px nesse quadro.

## Diagnóstico (já medido por pixel; não ajuste no olho)
1. Em 1713×918 as duas faixas vermelhas e a onda branca já batem com a arte
   (erro < 0,6%). NÃO mexa nos paths dos SVGs.
2. Diferenças que restam nessa resolução (site → arte):
   - menu 751×67 → 857×59; links peso 600 → 700
   - logo 530px visíveis → 588px
   - botão 345×69 com borda branca → 295×47 SEM borda
   - ícones dos pilares Ø76 com glifo ~38% do círculo → Ø109 com glifo ~55%;
     pilares ~30px mais baixos que na arte
   - cascão: o asset atual (5 voltas finas, proporção 0,40) não é o da arte
     (4 voltas grossas, proporção 0,545)
3. Fora dessa proporção a composição desmonta porque cada elemento tem fórmula
   própria (min/max misturando vw e svh) e o herói tem `min-height:100svh`.
   Em 1710×1307 (janela real do cliente): herói 1307px, cascão 456px (arte 340),
   faixa branca 299px (arte 210), pilares soltos no branco.
4. Abaixo de 900px: menu quebra em 3 linhas (125px de altura), logo alinhado à
   esquerda com tagline/botão centralizados, cascão com 126px.

## Arquitetura obrigatória: UMA unidade de escala

    body{container-type:inline-size}
    body>*{--u:min(100cqw / 1713, 100svh / 918, 1.25px)}

- Toda medida do herói E do menu vira `calc(N * var(--u))`, N = px da arte.
  Apague as fórmulas individuais (--faixa-h, o max() do cascão, clamps em vw do
  logo/tagline/botão/nav/pilares).
- Atenção: `<header class="topo">` está FORA de `.hero`. Por isso o container é
  o body e `--u` é definido em `body>*`.
- Use cqw, não 100vw (100vw inclui a barra de rolagem; isso já causou 8px de
  descasamento na v1).
- A v1 usava unidade única e estourou em telas grandes. O erro foi a falta de
  teto e o `max(100svh, …)`, não a ideia. Aqui há teto (1.25) e é min() nos
  dois eixos.
- Herói: SEM 100svh. Palco azul = 708u; base branca `min-height:210u`.
  Janela mais alta que a proporção → a próxima seção aparece abaixo (intencional).
  Janela mais larga → palco de 1713u centralizado; faixas e onda seguem
  full-bleed com alturas em u (344u, 514u, 68u).
- Pisos de fonte: `max(piso, N*u)`. Menu 13px, tagline 17px, botão 13px,
  título do pilar 14px, corpo do pilar 12,5px. Entre 900 e 1100px a base branca
  pode crescer para caber o texto; o palco azul não muda.
- Isso já foi prototipado sobre o CSS atual e bateu: nav 864×59 (arte 857×59),
  logo 34,1% da largura (arte 34,3%), texto do botão 14,0% (arte 13,9%).

## Medidas-alvo (× --u)

| Elemento | Alvo |
|---|---|
| Menu (pílula) | top 27, altura 59, centralizado, largura pelo conteúdo (~857); padding esq 54, dir 38 |
| Links | fonte 18 / peso 700; gap entre links 53; gap links→CTA 37 |
| CTA "Peça agora" | 160×42, fonte 18/700 |
| Logo (caixa do webp) | left 71, top 262, largura 600 |
| Tagline | x 82, topo das letras y≈501, fonte ≈29/700 (texto ≈463 de largura) |
| Botão | x 80, y 545, ≈295×47, sem borda, fonte 17/600, seta 22 |
| Cascão (objeto visível) | x 692→1028, topo y 140, ponta y≈755 (atrás da onda); eixo em 50,2% |
| Onda branca | 68 de altura sobre a base; na arte crista 645 / vale 713 (hoje 640/708: pode descer 5) |
| Base branca | começa em y 708, altura 210 |
| Ícones pilares | Ø109, top y 737, x = 146 / 648 / 1170; gap ícone→texto 27 |
| Glifos | ~55% do círculo, traço ≈5 (folha e coração: vermelho com contorno branco; floco branco grosso) |
| Texto pilares | título 23,5/800; corpo 17,5, line-height 1.35 |
| Quebras (desktop) | "Ingredientes / de Qualidade"; "…os melhores / ingredientes para o seu sabor."; "…fresquinhos / e irresistíveis."; "…é pensado / para tornar seu dia melhor." Use max-width em u, não `<br>` |
| Divisórias | x≈592 e x≈1117, ~95 de altura, #DCE5EF |

Ordem de camadas: navy → faixas vermelhas → copy + cascão → onda/base branca
(na frente do cascão) → menu.

## Cascão: já vem recortado
Os arquivos estão na pasta `cascao-arte/` entregue junto com este prompt. É o
cascão da própria arte (`identidade/cascao-original.png`, que era RGB com o
xadrez de transparência embutido), recortado e aparado:

- `cascao-arte.png` — 944×1640 RGBA, mestre
- `cascao-arte-{460,700,944}.webp` — para o srcset
- `zoom-bordas-do-recorte.png` — conferência da borda sobre navy, vermelho e branco

Copie para `site/assets/hero/`, monte srcset/sizes, preload e width/height
corretos, e apague do HTML as referências ao `cascao-hero-*` antigo.
O arquivo tem margem esq 40, topo 32 → **width 366u, left 677u, top 128u**
(valores obtidos por casamento de imagem contra a arte). Nunca estique.
Se preferir regerar o recorte: flood fill a partir das bordas sobre pixels
neutros (|R−G|<9, |G−B|<12, R>120), dilatar 2px, preencher buracos, manter o
maior componente, blur 1,2px no alfa. Chroma key simples não serve — o creme é
quase branco.

## Logo
O webp tem 602px e será exibido a 600u: serve a 1×, borra em tela 2× e com u>1.
Não retrace nem redesenhe. Mantenha e me avise no relatório; se eu entregar um
logo ≥1500px ou vetor limpo, só troca o arquivo.

## Fonte
A arte parece Montserrat; o projeto decidiu Poppins (comentário no topo do CSS).
Mantenha Poppins. Se o overlay mostrar que Montserrat 700/800 casa melhor nas
larguras de texto, me pergunte antes de trocar.

## Composição empilhada: largura < 900px, ou retrato com largura < 1100px
Não existe arte mobile. Derive da desktop com as MESMAS camadas e a mesma
técnica: `--um:min(100cqw / 390, 1.7px)`, quadro de 390 de largura.

- Menu: pílula com botão hambúrguer + CTA "Peça agora". Painel com os 5 links,
  `aria-expanded`, fecha com Esc e ao clicar em link, foco preso no painel,
  sem rolagem horizontal. Acima do breakpoint, o menu da arte.
- Tudo em UM eixo central: logo (≈74% da largura), tagline, botão, cascão
  (objeto ≈55% da largura) com 15–20% da altura escondida atrás da onda branca.
- Logo sempre sobre o navy; faixa vermelha de cima acima dele; faixa de baixo
  subindo à direita, atrás do cascão.
- Pilares FORA do palco, em fluxo, 1 coluna, ícone 56–64px.
- Tablet retrato usa essa composição com o teto de --um (hoje sobra um vazio
  azul enorme em 768×1024).
- Me mostre 390×844 e 820×1180 antes de refinar.

## Resto do site
- Seção Linhas: confira estouro de texto com `scrollWidth > clientWidth` em cada
  `.linha__texto`. Nas capturas em 1100 e 1710 o título "Tradicionais" parece
  entrar por baixo do sundae (caixa de texto com ~156px em 1100).
  Sem sobreposição texto×produto em nenhuma largura.
- Nenhuma rolagem lateral de 320 a 3440px (scrollWidth == clientWidth).
- Tipografia fluida com teto; imagens com srcset/sizes/width/height; lazy só
  abaixo da dobra.
- Manter reveal e paralaxe: em scrollY=0 o deslocamento é zero (o herói tem que
  bater com a arte parado) e a paralaxe nunca pode abrir fresta entre faixa e onda.
- Manter prefers-reduced-motion, foco visível, link "pular", e o padrão de
  progressive enhancement do script.js.

## Verificação (obrigatória antes de dizer que terminou)
1. Em 1713×918: screenshot + overlay 50% com a arte em `auditoria/comparacao/`,
   e medir o bounding box de cada item da tabela. Tolerância ±6px.
2. Matriz: 360×640, 390×844, 412×915, 768×1024, 820×1180, 1024×768, 1280×720,
   1366×768, 1440×900, 1536×864, 1710×1307, 1920×950, 2560×1310, 3440×1300.
   Em cada uma: sem rolagem lateral; onda cortando o cascão; botão nunca sob a
   onda; logo nunca sobre o vermelho; nenhum texto abaixo do piso; nada sobreposto.
3. No desktop, conferir que logo/cascão/menu/pilares mantêm a MESMA razão entre
   si em 1366×768, 1710×1307 e 2560×1310 (é o que prova a unidade única).
4. Console sem erros.

## Não faça
- Não ajuste no olho nem crie novos clamp()/min()/max() por elemento no herói.
- Não altere os paths das ondas, a paleta (#003B6B, #E52023, #FFFFFF), textos,
  rótulos ou sabores. Não rasterize ondas. Não estique imagens.
- Não toque em `site-v1/`. Não crie seções novas (Sobre/Contato ficam p/ depois).

## Entrega
Commits pequenos (unidade única → medidas → cascão → mobile/menu → Linhas → QA),
comentários em português como no resto do CSS, e um relatório final com a tabela
alvo × medido em 1713×918 e as capturas da matriz.
