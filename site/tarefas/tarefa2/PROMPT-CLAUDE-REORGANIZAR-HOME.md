# Implementação da nova ordem da Home — Qótimo Sorvetes

Trabalhe no repositório:

`https://github.com/JoaoMeisterI/qotimo-sorveteria`

Analise primeiro `site/index.html`, `site/styles.css`, `site/script.js` e os assets existentes. Depois implemente a reorganização descrita abaixo com alterações mínimas, localizadas e responsivas.

## Regra mais importante: não alterar o Hero

NÃO altere absolutamente nada da parte superior da página, onde estão:

- navbar;
- ondas azuis, vermelhas e brancas;
- logo Qótimo;
- texto “Mais sabor em cada momento!”;
- botão “Explore Nossos Sabores”;
- cascão central;
- animação de preenchimento do cascão, caso já esteja implementada;
- posição, escala, recorte, proporção ou parallax do cascão;
- bloco branco dos três pilares: “Ingredientes de Qualidade”, “Frescor e Cremosidade” e “Feito com Amor”;
- responsividade e altura do primeiro viewport.

Não edite a estrutura interna de `.hero`, `.hero__palco`, `.hero__cascao`, `.hero__base`, `.topo` ou `.nav`. Não substitua assets do Hero. Não redesenhe o topo e não tente aproximá-lo novamente da imagem de referência: ele já está aprovado.

Se for necessário ajustar uma transição entre seções, faça o ajuste somente no começo da nova segunda seção. Não modifique o Hero para encaixar a seção seguinte.

## Nova ordem obrigatória das seções

A página deve ficar nesta ordem:

1. Hero — `section.hero#inicio` — manter exatamente como está.
2. Nossas linhas — `section.linhas#linhas`.
3. Sobre nossa história — `section.historia#sobre`.
4. Nossas unidades — `section.unidades#unidades`.

Atualmente o projeto possui a História antes das Linhas. Mova o bloco COMPLETO de `section.linhas#linhas` para imediatamente depois do fechamento do Hero. Em seguida deve vir o bloco COMPLETO de `section.historia#sobre`.

Não copie nem duplique as seções. Apenas mova os blocos existentes e adapte o CSS estritamente necessário para a nova ordem.

Preserve os IDs `inicio`, `linhas`, `sobre` e `unidades`, pois eles são usados pela navegação, CTAs, acessibilidade e JavaScript.

## Segunda seção: Nossas linhas

Somente a segunda parte da Home deve receber o novo trabalho visual.

Use `referencias/00-home-aprovada.png` como referência principal de composição e continuidade visual entre o Hero e a seção de produtos.

Use `referencias/01-secao-linhas-aprovada.png` como referência aproximada da linguagem visual da seção isolada:

- fundo azul-marinho da Qótimo;
- faixa vermelha orgânica;
- cards brancos orgânicos;
- títulos em azul;
- CTAs vermelhos;
- fotos de produtos agrupadas;
- visual moderno, limpo e coerente com o Hero.

A imagem de referência mostra três cards por limitação do enquadramento, mas a implementação deve conter as QUATRO linhas existentes. Não remova “Tradicionais”.

As quatro linhas obrigatórias são:

1. Tradicionais
2. Picolés
3. Sorvetes em pote
4. Açaí

Use as imagens transparentes fornecidas:

- `assets-grupos/01-tradicionais-agrupados.png`
- `assets-grupos/02-picoles-agrupados.png`
- `assets-grupos/03-sorvetes-em-pote-agrupados.png`
- `assets-grupos/04-acai-agrupados.png`

Copie esses arquivos para uma pasta apropriada dentro de `site/assets/`, com nomes claros e sem apagar os produtos individuais já existentes.

Cada linha deve manter seu conteúdo e destino coerentes. Não invente sabores diferentes dos produtos exibidos nas imagens.

Sabores/produtos representados:

- Tradicionais: sundae de morango, Moreninha e sundae de chocolate.
- Picolés: Chocolate, Blue Ice e Coco.
- Sorvetes em pote: Napolitano, Pistache e Super Flocos.
- Açaí: individual, picolé de açaí com leitinho e pote tradicional de 1 litro.

Não gere novas embalagens e não altere logotipos, rótulos ou cores das imagens fornecidas.

## Layout responsivo da segunda seção

No desktop, apresente os quatro agrupamentos de maneira equilibrada. Escolha a solução que preserve melhor a leitura sem reduzir excessivamente os produtos:

- grade 2 × 2; ou
- quatro cards horizontais em um grid com largura suficiente, caso o breakpoint comporte.

Não use um carrossel obrigatório no desktop.

No tablet, use preferencialmente grade 2 × 2.

No mobile, empilhe os cards em uma coluna ou use scroll horizontal acessível com `scroll-snap`, desde que todos os cards continuem acessíveis sem JavaScript.

Evite:

- produtos cortados;
- textos sobre as embalagens;
- cards apertados;
- overflow horizontal da página;
- imagens esticadas;
- mudanças bruscas de altura durante o carregamento;
- segunda seção aparecendo dentro do primeiro viewport do Hero;
- alterações globais de CSS que afetem o topo aprovado.

Reserve o espaço das imagens com `aspect-ratio`, use `object-fit: contain` e forneça `width` e `height` quando possível para evitar layout shift.

## Terceira seção: Sobre nossa história

Mova `section.historia#sobre` para depois da seção de Linhas.

Preserve integralmente:

- todos os textos;
- as três fotografias;
- o selo “Desde 2000”;
- os marcos de ano, parque fabril e sorveterias;
- botão “Conheça nossas unidades”;
- IDs, classes, alt texts e atributos de acessibilidade.

Não redesenhe a História. Faça somente os ajustes de transição visual estritamente necessários por ela agora começar depois de `#linhas` em vez de começar depois do Hero.

Elementos decorativos de transição que dependam da seção anterior devem ser revisados para não criar ondas duplicadas, faixas cortadas, espaços vazios ou sobreposições.

## Navegação e comportamento

Depois da mudança, confirme:

- “Produtos” e “Linhas” continuam levando para `#linhas`;
- “Sobre nós” continua levando para `#sobre`;
- o botão do Hero continua levando para `#linhas`;
- “Role para ver as linhas” leva para a nova segunda seção;
- “Conheça nossas unidades” continua levando para `#unidades`;
- nenhum ID foi duplicado;
- a rolagem não para em posições incorretas por causa do header fixo;
- animações com `IntersectionObserver` continuam funcionando na nova ordem;
- `prefers-reduced-motion` continua respeitado;
- o menu mobile continua funcionando.

## Restrições

- Não altere a identidade vermelho, azul e branco da Qótimo.
- Não substitua a fonte do projeto.
- Não altere textos do Hero ou da História.
- Não remova produtos existentes da base.
- Não altere o cascão ou sua animação.
- Não mexa em unidades, dados de cidades ou contatos.
- Não crie uma segunda Home.
- Não transforme cada seção em uma página HTML separada.
- A Home continua sendo uma única página com seções verticais.
- Não faça commit nem push sem autorização.

## Validação obrigatória

Teste a página nas seguintes larguras:

- 360 × 800
- 390 × 844
- 768 × 1024
- 1366 × 768
- 1440 × 900
- 1920 × 1080

Confirme visualmente:

1. O Hero permanece idêntico ao estado anterior.
2. O cascão não mudou de tamanho, posição, recorte ou comportamento.
3. A animação do cascão continua funcionando, se já estiver implementada.
4. “Nossas linhas” é a segunda seção.
5. As quatro linhas aparecem e usam as quatro imagens fornecidas.
6. “Sobre nossa história” é a terceira seção.
7. “Nossas unidades” permanece depois da História.
8. Não há espaços brancos indesejados nas transições.
9. Não há barras de rolagem horizontais.
10. Os links do menu e CTAs chegam às seções corretas.
11. O layout não apresenta saltos durante o carregamento das imagens.
12. O site permanece acessível por teclado e com leitores de tela.

## Entrega esperada

Ao finalizar:

1. Liste os arquivos alterados e criados.
2. Explique como a ordem das seções foi modificada.
3. Confirme explicitamente que nenhum código do Hero/cascão foi alterado.
4. Informe como as quatro imagens agrupadas foram utilizadas.
5. Mostre o diff final.
6. Informe os testes responsivos realizados.
7. Pare antes de fazer commit ou push.
