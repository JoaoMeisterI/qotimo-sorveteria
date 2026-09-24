# Tipografia de destaque — Qótimo Sorvetes

Análise e implementação pedidas na `tarefa.md`. Resumo em uma linha: a
Chiquinhorc2 **não foi publicada**, porque não temos autorização para usá-la;
todo o desenho tipográfico foi implementado e está rodando com uma alternativa
licenciada, e a troca para a Chiquinho é um bloco de CSS — já testada.

---

## 1. A questão da licença (leia antes do resto)

O próprio `LEIA-ME.txt` do ZIP avisa que o site da Chiquinho não informou
licença. Fui atrás do que os arquivos dizem de si mesmos:

| O que os arquivos informam | Valor |
|---|---|
| Desenhista / detentora | **Fabio Haag Type / VLF Design Ltda** |
| Família | Chiquinho RC2 — regular, bold, black |
| Versão | 0.910 (numeração de fonte sob encomenda, ainda em série) |
| Licença (`name` ID 13) | **vazio** |
| URL da licença (`name` ID 14) | **ausente** |
| `fsType` | **8** |

Duas conclusões:

1. **É um tipo exclusivo, não um tipo à venda.** Uma fonte batizada com o nome
   da marca, desenhada por uma fundição comercial e numerada 0.910 é encomenda
   fechada da Chiquinho Sorvetes. Não existe versão que se possa comprar.
2. **`fsType 8` não é licença de webfont.** Esse bit é "Editable embedding", e
   trata de embutir a fonte em *documento* (um PDF, um .docx). Ele não diz nada
   sobre servir a fonte como webfont no site de outra empresa, e não substitui
   contrato. Os campos de licença estarem vazios não liberam o uso: significam
   apenas que o arquivo não carrega licença nenhuma.

Some-se o agravante comercial: a Chiquinho Sorvetes é **concorrente direta** da
Qótimo no mesmo mercado. Vestir a Qótimo com o tipo exclusivo da concorrente
seria, além do risco jurídico, um problema de identidade — a marca passaria a
falar com a voz de outra.

**Decisão:** a Chiquinhorc2 não vai ao ar. Os arquivos dela ficaram onde
estavam (`tarefas/tarefa3/site/`) e **não** foram copiados para `assets/`, que é
a pasta publicada — copiá-los para lá já seria o ato de redistribuição que está
em questão.

**O que destrava o uso:** autorização por escrito da Fabio Haag Type / VLF
Design (ou da Chiquinho, se os direitos forem dela) cobrindo uso como webfont
no domínio da Qótimo. Havendo isso, a seção 5 mostra a troca.

### A alternativa licenciada: Fredoka

Comparei quatro candidatas de licença livre contra a Chiquinho Black:

| Candidata | Licença | Veredito |
|---|---|---|
| **Fredoka** | SIL OFL 1.1 | **escolhida** — geométrica de terminais arredondados, mesmo "o" circular, mesma densidade no peso forte |
| Nunito | SIL OFL 1.1 | humanista demais, terminais mais retos, mais estreita |
| Baloo 2 | SIL OFL 1.1 | perto, mas mais leve e mais condensada; "Q" de desenho diferente |
| Quicksand | SIL OFL 1.1 | para bem em Bold (700); leve demais para título de destaque |

Métricas — a Fredoka é quase um decalque vertical da Chiquinho:

| | Chiquinho RC2 | Fredoka | Poppins |
|---|---|---|---|
| Altura de maiúscula | 680 | **700** | 705 |
| Altura de x | 510 | **500** | 558 |
| `fsType` | 8 | **0** (livre) | 0 |
| Acentuação PT-BR | completa | **completa** | completa |

A Fredoka está instalada em `assets/fontes/`, em WOFF2 com WOFF de reserva, um
arquivo por peso, com o texto da licença em `assets/fontes/OFL.txt`.

**A `fl-icons` do ZIP não entrou no projeto.** É fonte de ícones do tema
Flatsome e não é usada em texto nenhum, como pedido.

---

## 2. Onde a fonte de destaque entrou — e por quê

A regra que segui: **destaque onde o texto é curto, grande e serve para dar
personalidade; Poppins onde o texto é para ler.**

| Elemento | Fonte e peso | Motivo |
|---|---|---|
| `.hero__tagline` "Mais sabor em cada momento!" | **Destaque 900** | O melhor lugar do site. Fica logo abaixo do logotipo, que já é desenhado numa arredondada de "o" circular — a frase passa a falar a mesma língua que a marca. Corpo de 29u → 31u, porque a de destaque é mais estreita e a frase ficava curta sob um logo de largura fixa. |
| `.pilar__texto h2` (3 títulos) | **Destaque 900** | Títulos de duas ou três palavras, em navy sobre branco: é o formato em que a fonte rende. Teto de quebra remedido (175u → 165u) para "Ingredientes / de Qualidade" continuar quebrando onde quebrava. |
| `.historia__titulo` | **Destaque 900** | Título curto de seção, o maior tipo da área. Teto 9.5em → 7.6em para manter a quebra "Uma história / feita de sabor". |
| `.linhas__titulo` | **Destaque 900** | Idem. O teto de 8.7em já servia às duas fontes e não foi tocado. |
| `.unidades__titulo` | **Destaque 900** | Idem, em uma linha. |
| `.linha__nome` (Tradicionais / Picolés / Sorvetes em pote / Açaí) | **Destaque 900** | A aplicação mais forte do site: quatro nomes de produto, curtos e sozinhos no card, ao lado de embalagens que já trazem o logotipo Qótimo arredondado. Corpo remedido (teto 39px → 43px) porque a de destaque é mais estreita. |
| `.linha__num` (01–04) | **Destaque 700** | Algarismos redondos dentro do círculo vermelho; acompanham o nome logo abaixo. |
| `.selo strong` "2000" | **Destaque 900** | É um selo, não texto — o algarismo redondo reforça o ar de carimbo. O "DESDE" continua em Poppins (ver abaixo). |
| `.card__nome` (nome da unidade) | **Destaque 700** (900 no card em destaque) | Título curto do card. Mantém a seção viva sem tocar em nenhuma informação de serviço. |

### Onde a Chiquinho/Fredoka **não** entrou — e por quê

Isto é metade do trabalho: a fonte piora essas partes.

| Elemento | Continua | Motivo |
|---|---|---|
| `.nav__links`, `.nav__cta` | Poppins 700 | Navegação é elemento funcional, em ~17px. Uma arredondada de altura de x baixa perde definição nesse corpo, e o menu é onde a legibilidade vale mais que a personalidade. **O pedido citava a navegação; a resposta é um não fundamentado.** |
| `.marco__num` (2000 / 600 m² / 6 sorveterias) | Poppins 800 | São números **animados** — o `script.js` conta 1980→2000 quadro a quadro. Isso só não treme porque a regra usa `tabular-nums`, e a Fredoka **não tem** algarismos tabulares (o "1" mede 379 contra 565 do "0"). Com ela o número balançaria durante a contagem. É leitura de dado, não manchete. |
| `.historia__eyebrow`, `.linhas__eyebrow`, `.unidades__eyebrow`, `.selo span`, `.rolar__texto` | Poppins 700 | Caixa-alta miúda com espacejamento largo (`.14em`–`.22em`). Arredondadas se desmontam nessa combinação. O `.historia__eyebrow` ainda é o que roda a animação de "se escrever". |
| `.historia__sub`, `.unidades__sub`, `.linhas__sub` | Poppins | Ficam coladas nos títulos de destaque; dois blocos de destaque empilhados pesam e a hierarquia some. |
| `.historia__corpo p`, `.pilar__texto p`, `.linha__desc` | Poppins | Parágrafo é para ler. |
| `.card__end`, `.card__status`, `.card__link`, `.filtro` | Poppins | Informação de serviço das unidades e controles — exatamente o que a tarefa pedia para preservar. |
| `.btn`, `.btn-pill`, `.linha__btn` | Poppins 600 | Rótulo de botão: corpo pequeno, função de interface. |
| **Logotipo do herói** | **imagem, intocada** | `.hero__logo` continua sendo o `<img>` de sempre. Nada no herói foi substituído por texto. |

---

## 3. O que foi ajustado de medida (e só isso)

A troca de fonte muda a largura das palavras. Estes foram os únicos ajustes —
cada um existe para **manter** a composição aprovada, não para mudá-la:

| Ajuste | De → Para | Por quê |
|---|---|---|
| `size-adjust` no `@font-face` | — → 105% | As duas de destaque têm altura de x menor que a Poppins. Resolvido de uma vez no `@font-face`, em vez de espalhar correção de `font-size` por dezenas de regras. |
| `.hero__tagline` corpo | 29u → 31u | Compensa a largura menor sob um logotipo de largura fixa. Mede 441u nos 631u livres — `nowrap` garantido. |
| `.hero__tagline` (empilhado) | 19um → 20um | Idem no celular. |
| `.pilar:nth-child(1) h2` teto | 175u → 165u | Manter a quebra depois de "Ingredientes". |
| `.historia__titulo` teto | 9.5em → 7.6em | Manter a quebra depois de "história". |
| `--fs-linha` | `clamp(1.5rem,2.35vw,2.44rem)` → `clamp(1.62rem,2.55vw,2.69rem)` | "Tradicionais" volta a ocupar a mesma mancha na coluna de texto do card (239px de 255, contra 245 de 255 da Poppins). |
| `letter-spacing` de `.historia__titulo` e `.unidades__titulo` | `-.01em` → `normal` | O valor negativo existia para fechar a Poppins. Numa arredondada ele encosta os contornos redondos uns nos outros. |
| `line-height` dos títulos de destaque | +0.02 a +0.04 | Folga para os acentos e para a cauda do "Q". |

**O que não foi tocado:** as medidas do herói em `--u`, a posição e o tamanho do
cascão, as ondas, as faixas, o logotipo, as cores, as imagens, o conteúdo e a
ordem das seções.

---

## 4. Conferência em desktop, tablet e celular

Varredura automatizada em **15 larguras** (360, 390, 414, 560, 680, 768, 834,
900, 1024, 1100, 1280, 1366, 1440, 1600, 1920), comparando o antes e o depois
elemento por elemento:

- **Estouro lateral da página:** 0 px em todas as larguras, antes e depois.
- **Texto cortado ou fora do viewport:** nenhum.
- **Quebras de linha:** **nenhuma mudou.** Todos os títulos, a chamada do herói,
  os três pilares e os quatro nomes de linha ocupam exatamente o mesmo número de
  linhas de antes, em todas as larguras.

Capturas do antes e do depois, lado a lado, em `capturas/` — herói, linhas,
história e unidades, nos três formatos (12 arquivos).

Contraste: nenhuma cor mudou, então as relações de contraste da paleta
azul/vermelho/branco seguem as mesmas.

---

## 5. Como trocar para a Chiquinhorc2, se a autorização vier

Está tudo pronto no topo do `site/styles.css`. As duas fontes são declaradas com
o **mesmo nome de família** (`"Qotimo Destaque"`) e os **mesmos pesos** (700 e
900), então nenhuma outra regra do projeto sabe qual das duas está no ar.

1. Copiar os quatro arquivos `chiquinhorc2-bold/black.woff2/.woff` de
   `tarefas/tarefa3/site/` para `site/assets/fontes/`.
2. Comentar os dois `@font-face` da Fredoka.
3. Descomentar o bloco da Chiquinho logo abaixo.
4. Trocar os dois `<link rel="preload">` no `index.html` para os arquivos novos.

**Esse caminho foi executado e testado**, não apenas escrito: com a Chiquinho no
ar, em 390/834/1280/1440/1600/1920px, o resultado é idêntico ao da Fredoka —
nenhuma quebra de linha diferente, nenhum estouro, nenhum corte. (Os arquivos da
Chiquinho foram removidos de `assets/` ao fim do teste.)

O bloco comentado carrega junto o único número que muda entre as duas: a
Chiquinho é ~10% mais larga que a Fredoka, então ela vem com seu próprio
`--fs-linha`. Todas as outras medidas calibradas foram escolhidas dentro da
janela que serve às duas fontes e valem sem retoque.

---

## 6. Arquivos alterados

| Arquivo | O que mudou |
|---|---|
| `site/styles.css` | Bloco `@font-face` + tokens `--fonte-texto` / `--fonte-destaque`; fonte de destaque em 9 seletores; medidas recalibradas da seção 3 |
| `site/index.html` | Dois `<link rel="preload">` para os WOFF2 de destaque. Nada mais. |
| `site/assets/fontes/fredoka-bold.woff2` / `.woff` | novo (peso 700 do papel de destaque) |
| `site/assets/fontes/fredoka-black.woff2` / `.woff` | novo (peso 900) |
| `site/assets/fontes/OFL.txt` | novo — licença SIL OFL da Fredoka |
| `site/tarefas/tarefa3/capturas/` | novo — 12 comparações antes/depois |
| `site/tarefas/tarefa3/RELATORIO.md` | este documento |

Peso somado dos quatro arquivos de fonte servidos: **~32 KB** em WOFF2
(subconjunto latino), com WOFF de reserva para navegadores antigos.
