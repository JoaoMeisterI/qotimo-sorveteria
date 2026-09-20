# Ajuste final do herói — 3 correções

O herói já está quase certo. Medi a sua captura (1710×1307) contra a arte
`identidade/assets-v2/04-referencias-aprovadas/01-home-aprovada.png` pixel a pixel.
**Já bate e NÃO deve ser tocado:**

| Item | Arte | Atual |
|---|---|---|
| Faixa vermelha do topo (x=5) | y 83→219 | y 84→215 |
| Faixa vermelha de baixo (x=1692) | y 409→672 | y 405→668 |
| Logo | x 77→659, w 583, y 255→469 | x 78→654, w 577, y 255→469 |
| Tagline | y 486→522 | y 480→521 |
| CTA "Peça agora" | 161×42 | 159×42 |
| Ícones dos pilares | x 145 / 646 / 1168, Ø110, y 738 | x 144 / 641 / 1161, Ø108, y 729 |

Só falta o que está abaixo. Tudo em `u` (a variável `--u` do herói).

---

## 1. Tirar a linha vermelha horizontal

Existe uma linha de 1px atravessando a página inteira logo abaixo da onda branca.
Na captura ela está em **y = 700**, cor medida **rgb(236, 88, 90)** — ou seja,
`#E52023` misturado com branco, não uma borda de verdade.

**Causa:** a borda superior da faixa branca (`.hero__base`) cai numa coordenada
fracionária (≈700,4px). O navegador pinta essa linha como mistura da faixa
vermelha que está atrás com o branco que começa em seguida. Não adianta procurar
`border` no CSS — não existe.

**Correção:** eliminar a emenda com 1px de sobreposição, não com arredondamento.

- `.hero__onda` → `inset-block-end: calc(100% - 1px)` (a onda entra 1px na faixa branca)
- `.hero__base` → `margin-block-start: -1px` e fundo branco opaco
- garantir `display:block` nos SVGs de onda (SVG inline é `inline` por padrão e
  gera o mesmo tipo de fresta por causa do baseline)
- conferir a mesma emenda entre a faixa branca e a seção Linhas (`.linhas__onda`)

**Verificação:** nas linhas 690–710, fora da área do cascão, nenhum pixel pode ter
`R − B > 20`. Repetir com zoom do navegador em 90%, 100%, 110% e 125% e com
devicePixelRatio 1, 1.5 e 2 — é nesses valores que a fresta aparece e some.

---

## 2. Trocar o cascão pelo arquivo certo

O cascão em uso (`cascao-arte*`) não é o modelo escolhido. Use o arquivo entregue
na pasta `cascao-hero/` deste pacote. É o mesmo cascão que já existe no repo em
`identidade/assets-v2/03-elementos-hero/qotimo-cascao-hero.png`, apenas aparado
com margem de segurança:

- `cascao-hero.png` — 1017×2430 RGBA (mestre). Objeto em x 40→976, y 40→2389
  (937 × 2350). Margem de 40px nos quatro lados.
- `cascao-hero-{500,760,1017}.webp` — para o srcset.

Copie para `site/assets/hero/`, atualize `srcset`, `sizes`, `preload` e
`width="1017" height="2430"`. **Apague** `cascao-arte*` e os `cascao-hero-*.webp`
antigos (700/1000/1400) — aqueles tinham a ponta encostando na borda do arquivo.

### Posição (valores já validados por render)

    .hero__cascao     { left: calc(678 * var(--u)); top: calc(86 * var(--u)) }
    .hero__cascao img { width: calc(365 * var(--u)) }

Resultado geométrico, que é o que precisa ser conferido:

| Medida do OBJETO (não do arquivo) | Alvo |
|---|---|
| Topo do sorvete | y = 100u |
| Largura máxima (onde a calda abre) | 336u |
| Borda esquerda / direita | x 692u → 1028u (eixo em 860u) |
| Início da casquinha (fim do sorvete) | y ≈ 613u |
| Ponta da casquinha | y ≈ 943u — **fora da vista, atrás da faixa branca** |
| Onda branca cruza a casquinha em | y ≈ 680u, deixando ≈ 65u de waffle à vista |

### Regras de camada (é o que faz o corte acontecer)
- A onda branca e a faixa branca são desenhadas **na frente** do cascão.
  Quem corta o cascão é a onda, em qualquer viewport.
- O cascão **não** pode ser cortado por `overflow` acima da linha da onda: ele
  segue inteiro por trás do branco. Se o `overflow:hidden` do herói cortar o que
  sobra abaixo da faixa branca, tudo bem — ali já está escondido.
- Nunca esticar: só `width`, com `height:auto`.

Se algum dia o arquivo do cascão mudar, o que vale é a tabela acima: topo do
objeto em 100u, largura 336u, eixo em 860u, e a onda cruzando a casquinha.

---

## 3. Faixa branca dos pilares: 210u, não 268u

Na captura em 1710×1307 a faixa branca vai de ~700 a 968 (**268u**) e sobra um
vazio embaixo dos pilares. Na arte ela tem **210u**.

- Travar a altura da faixa em `calc(210 * var(--u))` no desktop.
- Pilares centralizados verticalmente dentro dela (ícone com o topo em ~737u,
  como na arte).
- Abaixo de 1100px de largura a faixa pode crescer para caber o texto em duas
  linhas — aí a altura volta a ser automática, com `min-height` de 210u.

---

## Verificação final (obrigatória)

1. Captura em 1713×918 + overlay 50% com a arte. Conferir: linha vermelha ausente,
   cascão nas coordenadas da tabela (±8u), faixa branca com 210u.
2. Matriz: 360×640, 390×844, 768×1024, 1024×768, 1366×768, 1440×900, 1710×1307,
   1920×950, 2560×1310, 3440×1300. Em todas: a onda cruza a casquinha; nenhuma
   linha vermelha em nenhuma emenda; sem rolagem lateral; nada cortado no topo.
3. Na composição empilhada (<900px), o mesmo cascão, mesma regra: cortado pela
   onda, nunca por `overflow`.
4. Console sem erros.

## Não faça
- Não mexa nos paths das ondas nem nas faixas vermelhas — já estão corretos.
- Não reposicione logo, tagline, botão, menu ou pilares — já estão dentro da
  tolerância.
- Não troque o cascão por outro arquivo nem gere um novo com IA.
- Não resolva a linha vermelha pintando algo por cima; resolva a emenda.
