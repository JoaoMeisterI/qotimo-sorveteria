# Implementação das seções “Nossa história” e “Nossas unidades” — Qótimo Sorvetes

Analise o projeto existente antes de alterar qualquer arquivo. Preserve integralmente as seções já aprovadas da home e de produtos. Implemente duas novas seções no mesmo site: **Nossa história** e **Nossas unidades**.

As telas em `01-mockups/` são a referência visual principal. Os arquivos em `02-fundos/` são fundos prontos, sem conteúdo, e devem ser usados apenas como camada de fundo. As fotografias originais em `03-referencias/` são a fonte de verdade para as imagens das unidades e da história.

## Regras obrigatórias para as duas seções

- Manter a identidade do site: azul-marinho `#003B6B`, vermelho `#E52023` e branco `#FFFFFF`.
- Usar a mesma família tipográfica, pesos, botões arredondados, espaçamentos e linguagem de curvas já presentes na home.
- Não redesenhar nem alterar logos, fachadas, letreiros ou arquitetura das fotografias.
- Não usar fotos recriadas por IA quando houver uma fotografia real correspondente.
- Não inserir textos, cards ou botões dentro das imagens de fundo. Tudo deve ser HTML/CSS real e acessível.
- Não esticar imagens. Usar `object-fit: cover` nos cards fotográficos e definir `object-position` individualmente quando necessário para preservar o letreiro.
- Evitar cortes em logos, fachadas e elementos importantes.
- Não inventar endereço, telefone, horário, cidade ou número de unidade. Buscar os dados no projeto atual. Quando um dado não estiver disponível, omitir ou marcar como pendente no código, sem exibir informação fictícia ao usuário.
- As seções devem ocupar espaço suficiente para que uma não apareça prematuramente enquanto o usuário ainda observa a anterior.
- Usar HTML semântico, responsividade real, navegação por teclado, contraste adequado e `alt` descritivo nas fotos.
- Respeitar `prefers-reduced-motion` e remover animações para quem solicitar redução de movimento.

## Organização dos arquivos visuais

### Mockups

- `01-mockups/01-mockup-nossa-historia.png`: referência final da composição da história.
- `01-mockups/02-mockup-nossas-unidades.png`: referência final da composição das unidades.

### Fundos

- `02-fundos/fundo-nossa-historia.webp`: versão recomendada para produção.
- `02-fundos/fundo-nossa-historia.png`: versão PNG de referência em alta qualidade.
- `02-fundos/fundo-nossas-unidades.webp`: versão recomendada para produção.
- `02-fundos/fundo-nossas-unidades.png`: versão PNG de referência em alta qualidade.

Use os fundos com `background-size: cover`, `background-position: center` e sem repetição. Em telas muito largas, considere manter o fundo centralizado e limitar a largura interna do conteúdo, sem deformar as ondas.

## Seção 1 — Nossa história

### Objetivo

Criar uma seção emocional e institucional que explique a origem da Qótimo sem parecer um bloco corporativo pesado. A foto histórica deve ser protagonista e os números devem facilitar a leitura rápida da trajetória.

### Estrutura visual no desktop

1. Seção com `min-height` entre `900px` e `100svh`, conforme a estrutura atual do projeto.
2. Aplicar `fundo-nossa-historia.webp` como fundo da seção.
3. Conteúdo interno centralizado, com largura máxima aproximada de `1560px` e margens laterais responsivas.
4. Coluna esquerda ocupando aproximadamente 34% a 38%:
   - Eyebrow: `SOBRE NÓS`.
   - Título forte: `Uma história feita de sabor`.
   - Subtítulo curto: `Mais que sorvetes, uma trajetória de sonhos.`
   - Texto da história dividido em três parágrafos curtos. Reutilizar o conteúdo real da página atual em `03-referencias/02-historia-atual.png`; não resumir de forma que altere fatos.
   - Botão vermelho: `Conheça nossas unidades` com seta, levando à seção de unidades.
5. Área visual à direita ocupando aproximadamente 58% a 62%:
   - Foto principal: `03-foto-historica-fachada.png`, em moldura branca grande, cantos arredondados e leve rotação de no máximo 1,5 grau.
   - Foto secundária superior: `04-unidade-origem-area-verde.png`.
   - Foto secundária inferior: `05-interior-retro.png`.
   - As fotos menores podem se sobrepor levemente à principal, mas não devem esconder a marca ou o produto histórico.
   - Selo circular vermelho `DESDE 2000`, em HTML/CSS, posicionado entre as fotografias.
6. Faixa inferior branca com três marcos:
   - `2000` — ano de fundação.
   - `600 m²` — parque fabril próprio.
   - `6 sorveterias` — presença física atual, apenas se essa informação continuar confirmada no conteúdo do projeto.
7. Usar pequenos grafismos de gotas vermelhas somente como apoio, no máximo dois grupos.

### Comportamento responsivo

- Tablet: transformar a composição em duas linhas; texto acima e fotos abaixo.
- Mobile: uma coluna; título e texto primeiro, foto histórica principal depois, fotos secundárias em carrossel ou grade de duas colunas.
- No mobile, os três marcos devem formar uma lista ou carrossel horizontal com snap.
- Reduzir sobreposições e rotações em telas menores que `768px`.

### Animação

- Entrada suave do texto com `opacity` e `translateY` de pequena amplitude.
- Fotos entram em sequência com atraso curto, sem zoom exagerado.
- Os números podem fazer contagem apenas uma vez quando entrarem no viewport; respeitar redução de movimento.
- Não usar parallax intenso nem prender o scroll.

## Seção 2 — Nossas unidades

### Objetivo

Permitir que o visitante encontre rapidamente uma unidade, mantendo as fotos como protagonistas. A página deve parecer comercial e útil, e não uma galeria solta.

### Estrutura visual no desktop

1. Seção com altura automática e `min-height` próxima de `100svh`.
2. Aplicar `fundo-nossas-unidades.webp` como fundo.
3. Manter espaçamento vertical claro entre o final da história e o início das unidades. Não permitir que os cards desta seção invadam visualmente a seção anterior.
4. Cabeçalho centralizado:
   - Eyebrow vermelho: `ONDE ESTAMOS`.
   - Título: `Encontre a Qótimo mais perto de você`.
   - Subtítulo: `Sabor, carinho e momentos especiais em cada unidade.`
5. Filtros em pills: `Todas`, `Jaraguá do Sul`, `Corupá` e `Massaranduba`.
   - Filtrar os cards sem recarregar a página.
   - Estado ativo vermelho; inativos brancos com texto azul.
6. Grade editorial:
   - Um card principal maior à esquerda, usando `06-unidade-jaragua-99.png` quando essa correspondência estiver confirmada no projeto.
   - Três cards menores à direita usando `07-unidade-fachada-azul-01.png`, `08-unidade-fachada-azul-02.png` e a foto real restante associada pelo cadastro do projeto.
   - Cada card contém foto, nome oficial, endereço confirmado, cidade, status de funcionamento quando calculável e ação `Como chegar`.
   - O botão `Ver no mapa` deve abrir Google Maps usando coordenadas ou endereço real do cadastro, nunca um link genérico.
7. Botão inferior central `Ver todas as unidades` somente se houver uma página ou modal com a lista completa.

### Dados

- Criar uma única fonte de dados para as unidades, por exemplo `units.ts`, `units.json` ou equivalente ao framework existente.
- Campos sugeridos: `id`, `name`, `city`, `address`, `phone`, `openingHours`, `image`, `coordinates`, `mapsUrl`, `featured`.
- Não duplicar conteúdo manualmente no componente.
- Se o projeto possuir backend/API, consumir os dados existentes. Não criar dados fictícios para preencher a grade.

### Comportamento responsivo

- Tablet: card principal ocupando toda a largura e demais cards em duas colunas.
- Mobile: uma coluna ou carrossel horizontal com `scroll-snap`; cada card deve mostrar foto, nome, cidade e ação principal sem exigir hover.
- Filtros devem permitir rolagem horizontal sem quebrar linha de forma desordenada.
- Manter altura consistente das fotos e preservar letreiros com `object-position` específico.

### Animação

- Cards surgem com leve deslocamento vertical, em sequência curta.
- Ao trocar o filtro, usar transição rápida de opacidade e posição; não animar a altura da página de forma brusca.
- Hover desktop: elevação de 4 a 8 px e aumento da foto de no máximo 2%.
- Não alterar cores ou logos das fotografias durante hover.

## Conexão entre as seções

- O botão `Conheça nossas unidades` deve fazer scroll suave até a seção de unidades.
- A onda branca inferior da história deve criar uma pausa visual antes da próxima seção.
- Adicionar espaço estrutural real entre as seções; não resolver a distância apenas inserindo margem dentro das imagens.
- Se houver navegação fixa, compensar sua altura com `scroll-margin-top`.

## Componentização sugerida

- `HistorySection`
- `HistoryPhotoStack`
- `HistoryMilestones`
- `UnitsSection`
- `UnitFilters`
- `FeaturedUnitCard`
- `UnitCard`
- `UnitsGrid`

Adapte os nomes ao padrão existente. Não instalar bibliotecas novas se CSS e recursos já presentes resolverem a implementação.

## Critérios de aceitação

- As duas novas seções parecem pertencer à mesma identidade da home aprovada.
- A composição acompanha os mockups sem transformar toda a tela em uma única imagem.
- Fundos são usados somente como fundo; textos e componentes permanecem HTML/CSS.
- Fotografias reais são preservadas e não apresentam esticamento nem cortes nos letreiros.
- Nenhum endereço, horário ou telefone é inventado.
- As seções funcionam em desktop, tablet e mobile.
- A navegação por teclado, foco visível, textos alternativos e contraste estão corretos.
- Não há sobreposição entre seções, salto de layout ou conteúdo da próxima tela aparecendo antes do momento correto.
- A primeira e a segunda telas existentes continuam inalteradas.
- Executar lint, testes e build disponíveis no projeto e corrigir erros relacionados à implementação.

## Entrega esperada do Claude

Ao concluir, informe:

1. Arquivos criados e alterados.
2. Como os dados reais das unidades foram obtidos.
3. Quais informações ficaram pendentes por não estarem confirmadas.
4. Como testar filtros, links de mapa e responsividade.
5. Resultado do lint, testes e build.

