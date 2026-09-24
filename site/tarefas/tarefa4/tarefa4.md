Implemente o arquivo no site da Qótimo Sorvetes.

Na seção “Sobre nós”, coloque o SVG dentro do espaço azul vazio entre as ondas do topo e o início do conteúdo “Uma história feita de sabor”. Ele deve funcionar como decoração sobre o fundo azul existente, ocupando a largura disponível sem cobrir o título, os textos, as fotos ou o selo “Desde 2000”.

Mantenha o SVG transparente e preserve suas cores branca e vermelha. Ajuste o tamanho e o posicionamento de forma responsiva: no desktop, mostre a composição completa; no celular, reduza ou recorte a decoração com cuidado para que o sorvete e a onda continuem legíveis, sem criar rolagem horizontal.

Trate o elemento como puramente decorativo (aria-hidden="true"). Não use a captura de tela como imagem de fundo e não adicione uma borda vermelha: o retângulo da referência era apenas uma marcação da área. Preserve o restante da página, especialmente a home com o cascão, as ondas, os textos e as fotos. Verifique o resultado em desktop e celular.

outro ponto para executar

IMPLEMENTAÇÃO DOS CATÁLOGOS APROVADOS — QÓTIMO SORVETES

Trabalhe diretamente no projeto atual do site da Qótimo, preservando a home, a navegação, as animações, as fontes, as ondas e todos os componentes que já estão funcionando.

OBJETIVO

Implementar a abertura dos três catálogos aprovados quando o usuário clicar na categoria correspondente. Os três arquivos PNG anexos são a referência final e obrigatória:

assets/catalogo-picoles-qotimo.png

assets/catalogo-sorvetes-qotimo.png

assets/catalogo-acai-qotimo.png

Use exatamente esses três arquivos. Não use, não importe e não substitua por nenhuma versão chamada “moderno”, “estilo-home”, “promocional” ou semelhante. Não redesenhe os catálogos e não altere seus produtos, textos, proporções, cores ou composição.

MAPEAMENTO OBRIGATÓRIO DOS CLIQUES

Botão, card ou categoria clicada

Catálogo que deve abrir

Picolés, Picolés cremosos, Picolés de frutas, Picolés premium ou Picolé de açaí

catalogo-picoles-qotimo.png

Sorvetes, Tradicionais, Moreninha, Sundae, Potinho, Potes, Caixas ou Premium em pote

catalogo-sorvetes-qotimo.png

Açaí, Potes de açaí ou Caixas de açaí

catalogo-acai-qotimo.png

Se já existirem cards principais chamados “Picolés”, “Sorvetes” e “Açaí”, o clique no card inteiro e em seu botão deve executar a mesma ação. Não deixe áreas clicáveis duplicadas causando dois eventos.

COMPORTAMENTO DE ABERTURA

Abra o catálogo em um modal de tela inteira, integrado ao site, e não como uma nova página branca nem como o arquivo PNG cru em outra aba.

O modal deve:

Cobrir toda a viewport com fundo azul-marinho rgba(0, 59, 107, 0.94) e leve backdrop-filter: blur(8px) quando suportado.

Ter uma barra superior fixa e discreta com:

nome da categoria;

botão “Voltar ao site”;

botão fechar com ícone X.

Exibir o PNG aprovado centralizado em uma área branca, com largura máxima adequada e sem distorção.

Permitir rolagem vertical dentro do modal para visualizar o catálogo inteiro.

Manter o topo do catálogo visível ao abrir, usando scrollTop = 0.

Fechar pelo X, pelo botão “Voltar ao site”, pela tecla Escape e pelo botão Voltar do navegador.

Bloquear a rolagem da página de fundo enquanto estiver aberto e restaurá-la ao fechar.

Devolver o foco ao elemento que iniciou a abertura.

Não fechar ao clicar na imagem; clique no backdrop pode fechar somente fora do conteúdo.

Usar transição curta e suave: fade do backdrop e entrada vertical de 12 a 20 px, entre 220 e 320 ms.

EXIBIÇÃO CORRETA DAS IMAGENS

Para o catálogo não cortar nem deformar:

.catalog-image {
  display: block;
  width: min(100%, 1711px);
  height: auto;
  margin: 0 auto;
  object-fit: contain;
}

Regras obrigatórias:

Nunca usar object-fit: cover.

Nunca definir altura fixa na imagem.

Nunca usar a imagem como background-image.

Não recortar, esticar, comprimir ou aplicar filtros.

Não colocar texto ou botões por cima das embalagens.

Não rasterizar novamente nem reduzir a resolução dos arquivos.

Manter o fundo claro e todos os espaços internos do próprio catálogo.

RESPONSIVIDADE

Desktop:

conteúdo do modal com largura máxima entre 1200 e 1500 px;

respiro lateral mínimo de 24 px;

barra superior sem cobrir o início do catálogo.

Tablet e celular:

imagem com width: 100% e height: auto;

respiro lateral entre 8 e 12 px;

barra superior compacta e fixa;

rolagem vertical fluida com -webkit-overflow-scrolling: touch;

nenhum zoom automático, corte lateral ou rolagem horizontal.

ACESSIBILIDADE

Use um botão real para cada ação; não use apenas div com onClick.

Modal com role="dialog", aria-modal="true" e título associado por aria-labelledby.

Imagens com textos alternativos:

“Catálogo de picolés Qótimo”;

“Catálogo de sorvetes Qótimo”;

“Catálogo de açaí Qótimo”.

Implemente foco inicial no botão fechar e contenção de foco dentro do modal.

Respeite prefers-reduced-motion.

ORGANIZAÇÃO TÉCNICA

Crie uma única estrutura reutilizável, por exemplo CatalogModal, alimentada por configuração. Não crie três modais independentes com código duplicado.

Estrutura sugerida:

const catalogs = {
  picoles: {
    title: 'Catálogo de Picolés',
    src: '/assets/catalogos/catalogo-picoles-qotimo.png',
    alt: 'Catálogo de picolés Qótimo'
  },
  sorvetes: {
    title: 'Catálogo de Sorvetes',
    src: '/assets/catalogos/catalogo-sorvetes-qotimo.png',
    alt: 'Catálogo de sorvetes Qótimo'
  },
  acai: {
    title: 'Catálogo de Açaí',
    src: '/assets/catalogos/catalogo-acai-qotimo.png',
    alt: 'Catálogo de açaí Qótimo'
  }
};

Adapte os caminhos à estrutura real do projeto, sem quebrar o sistema de build. Copie os três PNGs para a pasta pública de assets usada pelo projeto. Em Vite/React, uma opção segura é public/assets/catalogos/. Em Next.js, use public/assets/catalogos/ e caminhos iniciados por /assets/catalogos/.

Use carregamento preguiçoso para o catálogo fechado, mas carregue imediatamente a imagem quando a abertura for solicitada. Mostre um indicador simples de carregamento até o evento onLoad, sem esconder erros. Se uma imagem falhar, apresente a mensagem “Não foi possível carregar o catálogo” e um botão para tentar novamente.

INTEGRAÇÃO VISUAL

O acionamento e o modal devem combinar com a identidade existente:

azul-marinho: #003B6B;

vermelho: #E52023;

branco: #FFFFFF;

botões arredondados;

tipografia arredondada já usada no site;

ondas orgânicas apenas na interface externa do modal, nunca sobre o catálogo.

Não altere a arte das três imagens para tentar aproximá-las da home. Elas já são os catálogos aprovados.

ESTADO E URL

Quando possível, represente o catálogo aberto na URL sem recarregar a página, por exemplo:

?catalogo=picoles

?catalogo=sorvetes

?catalogo=acai

Ao abrir, registre um estado no histórico. Ao fechar, limpe esse estado. Se a página for acessada diretamente com um desses parâmetros, abra o catálogo correspondente. Parâmetros inválidos devem ser ignorados.

O QUE NÃO FAZER

Não gerar novos catálogos.

Não usar as versões modernas ou promocionais.

Não misturar produtos de um catálogo em outro.

Não abrir os três catálogos juntos.

Não usar carrossel para uma imagem longa.

Não transformar o catálogo em fundo da página.

Não adicionar preços, produtos ou sabores dentro das artes.

Não modificar o restante do site sem necessidade.

VALIDAÇÃO FINAL OBRIGATÓRIA

Antes de concluir, teste:

Clique em Picolés: abre somente o catálogo de picolés.

Clique em Sorvetes: abre somente o catálogo de sorvetes.

Clique em Açaí: abre somente o catálogo de açaí.

O início da imagem aparece no topo, sem corte.

É possível rolar até o rodapé completo do catálogo.

A imagem mantém a proporção em desktop, tablet e celular.

X, Voltar ao site, Escape e Voltar do navegador fecham corretamente.

Ao fechar, o usuário retorna ao mesmo ponto da página.

Nenhuma versão antiga ou alternativa aparece no build final.

Não existem erros no console, links quebrados ou rolagem horizontal.

Implemente, execute o projeto, revise visualmente as três aberturas e corrija qualquer corte, deformação, sobreposição ou inconsistência antes de entregar.


outra tarefa

IMPLEMENTAÇÃO DOS CATÁLOGOS APROVADOS — QÓTIMO SORVETES

Trabalhe diretamente no projeto atual do site da Qótimo, preservando a home, a navegação, as animações, as fontes, as ondas e todos os componentes que já estão funcionando.

OBJETIVO

Implementar a abertura dos três catálogos aprovados quando o usuário clicar na categoria correspondente. Os três arquivos PNG anexos são a referência final e obrigatória:

assets/catalogo-picoles-qotimo.png

assets/catalogo-sorvetes-qotimo.png

assets/catalogo-acai-qotimo.png

Use exatamente esses três arquivos. Não use, não importe e não substitua por nenhuma versão chamada “moderno”, “estilo-home”, “promocional” ou semelhante. Não redesenhe os catálogos e não altere seus produtos, textos, proporções, cores ou composição.

MAPEAMENTO OBRIGATÓRIO DOS CLIQUES

Botão, card ou categoria clicada

Catálogo que deve abrir

Picolés, Picolés cremosos, Picolés de frutas, Picolés premium ou Picolé de açaí

catalogo-picoles-qotimo.png

Sorvetes, Tradicionais, Moreninha, Sundae, Potinho, Potes, Caixas ou Premium em pote

catalogo-sorvetes-qotimo.png

Açaí, Potes de açaí ou Caixas de açaí

catalogo-acai-qotimo.png

Se já existirem cards principais chamados “Picolés”, “Sorvetes” e “Açaí”, o clique no card inteiro e em seu botão deve executar a mesma ação. Não deixe áreas clicáveis duplicadas causando dois eventos.

COMPORTAMENTO DE ABERTURA

Abra o catálogo em um modal de tela inteira, integrado ao site, e não como uma nova página branca nem como o arquivo PNG cru em outra aba.

O modal deve:

Cobrir toda a viewport com fundo azul-marinho rgba(0, 59, 107, 0.94) e leve backdrop-filter: blur(8px) quando suportado.

Ter uma barra superior fixa e discreta com:

nome da categoria;

botão “Voltar ao site”;

botão fechar com ícone X.

Exibir o PNG aprovado centralizado em uma área branca, com largura máxima adequada e sem distorção.

Permitir rolagem vertical dentro do modal para visualizar o catálogo inteiro.

Manter o topo do catálogo visível ao abrir, usando scrollTop = 0.

Fechar pelo X, pelo botão “Voltar ao site”, pela tecla Escape e pelo botão Voltar do navegador.

Bloquear a rolagem da página de fundo enquanto estiver aberto e restaurá-la ao fechar.

Devolver o foco ao elemento que iniciou a abertura.

Não fechar ao clicar na imagem; clique no backdrop pode fechar somente fora do conteúdo.

Usar transição curta e suave: fade do backdrop e entrada vertical de 12 a 20 px, entre 220 e 320 ms.

BOTÃO PARA BAIXAR O CATÁLOGO OFICIAL EM PDF

O pacote inclui o arquivo assets/catalogo-qotimo-produtos.pdf. Copie-o para a pasta pública do projeto, preferencialmente em:

/assets/catalogos/catalogo-qotimo-produtos.pdf

Adicione um botão real com o texto “Baixar catálogo completo (PDF)” em dois pontos do modal:

Na barra superior fixa, ao lado do botão “Voltar ao site”.

No final do conteúdo, depois da imagem longa do catálogo, como CTA de encerramento.

Os dois botões devem baixar o mesmo PDF completo. Não use o endereço externo como destino final e não abra uma visualização dentro do modal. O arquivo deve estar hospedado junto do site para evitar bloqueios de domínio, links quebrados e comportamento diferente entre navegadores.

Exemplo em React/JSX:

<a
  className="catalog-download-button"
  href="/assets/catalogos/catalogo-qotimo-produtos.pdf"
  download="catalogo-qotimo-produtos.pdf"
  aria-label="Baixar catálogo completo de produtos Qótimo em PDF"
>
  <DownloadIcon aria-hidden="true" />
  Baixar catálogo completo (PDF)
</a>

Se o projeto não utilizar React, implemente o mesmo comportamento com um elemento <a> real e o atributo download. Não use window.open() como ação principal.

Estilo obrigatório:

fundo #E52023;

texto branco;

ícone simples de download;

altura mínima de 44 px;

bordas totalmente arredondadas;

foco visível para teclado;

hover ligeiramente mais escuro, sem aumentar ou deslocar o layout;

no celular, mostrar o botão em largura total no rodapé do modal;

não sobrepor o botão à imagem nem esconder produtos.

Configuração recomendada:

const catalogPdf = {
  src: '/assets/catalogos/catalogo-qotimo-produtos.pdf',
  filename: 'catalogo-qotimo-produtos.pdf'
};

O PDF contém as nove páginas oficiais, incluindo história, linhas tradicional e premium, picolés, potes, caixas, açaí e contato. Preserve o arquivo exatamente como fornecido; não converta suas páginas em JPG e não reconstrua o PDF a partir das imagens longas dos três catálogos.

EXIBIÇÃO CORRETA DAS IMAGENS

Para o catálogo não cortar nem deformar:

.catalog-image {
  display: block;
  width: min(100%, 1711px);
  height: auto;
  margin: 0 auto;
  object-fit: contain;
}

Regras obrigatórias:

Nunca usar object-fit: cover.

Nunca definir altura fixa na imagem.

Nunca usar a imagem como background-image.

Não recortar, esticar, comprimir ou aplicar filtros.

Não colocar texto ou botões por cima das embalagens.

Não rasterizar novamente nem reduzir a resolução dos arquivos.

Manter o fundo claro e todos os espaços internos do próprio catálogo.

RESPONSIVIDADE

Desktop:

conteúdo do modal com largura máxima entre 1200 e 1500 px;

respiro lateral mínimo de 24 px;

barra superior sem cobrir o início do catálogo.

Tablet e celular:

imagem com width: 100% e height: auto;

respiro lateral entre 8 e 12 px;

barra superior compacta e fixa;

rolagem vertical fluida com -webkit-overflow-scrolling: touch;

nenhum zoom automático, corte lateral ou rolagem horizontal.

ACESSIBILIDADE

Use um botão real para cada ação; não use apenas div com onClick.

Modal com role="dialog", aria-modal="true" e título associado por aria-labelledby.

Imagens com textos alternativos:

“Catálogo de picolés Qótimo”;

“Catálogo de sorvetes Qótimo”;

“Catálogo de açaí Qótimo”.

Implemente foco inicial no botão fechar e contenção de foco dentro do modal.

Respeite prefers-reduced-motion.

ORGANIZAÇÃO TÉCNICA

Crie uma única estrutura reutilizável, por exemplo CatalogModal, alimentada por configuração. Não crie três modais independentes com código duplicado.

Estrutura sugerida:

const catalogs = {
  picoles: {
    title: 'Catálogo de Picolés',
    src: '/assets/catalogos/catalogo-picoles-qotimo.png',
    alt: 'Catálogo de picolés Qótimo'
  },
  sorvetes: {
    title: 'Catálogo de Sorvetes',
    src: '/assets/catalogos/catalogo-sorvetes-qotimo.png',
    alt: 'Catálogo de sorvetes Qótimo'
  },
  acai: {
    title: 'Catálogo de Açaí',
    src: '/assets/catalogos/catalogo-acai-qotimo.png',
    alt: 'Catálogo de açaí Qótimo'
  }
};

Adapte os caminhos à estrutura real do projeto, sem quebrar o sistema de build. Copie os três PNGs para a pasta pública de assets usada pelo projeto. Em Vite/React, uma opção segura é public/assets/catalogos/. Em Next.js, use public/assets/catalogos/ e caminhos iniciados por /assets/catalogos/.

Use carregamento preguiçoso para o catálogo fechado, mas carregue imediatamente a imagem quando a abertura for solicitada. Mostre um indicador simples de carregamento até o evento onLoad, sem esconder erros. Se uma imagem falhar, apresente a mensagem “Não foi possível carregar o catálogo” e um botão para tentar novamente.

INTEGRAÇÃO VISUAL

O acionamento e o modal devem combinar com a identidade existente:

azul-marinho: #003B6B;

vermelho: #E52023;

branco: #FFFFFF;

botões arredondados;

tipografia arredondada já usada no site;

ondas orgânicas apenas na interface externa do modal, nunca sobre o catálogo.

Não altere a arte das três imagens para tentar aproximá-las da home. Elas já são os catálogos aprovados.

ESTADO E URL

Quando possível, represente o catálogo aberto na URL sem recarregar a página, por exemplo:

?catalogo=picoles

?catalogo=sorvetes

?catalogo=acai

Ao abrir, registre um estado no histórico. Ao fechar, limpe esse estado. Se a página for acessada diretamente com um desses parâmetros, abra o catálogo correspondente. Parâmetros inválidos devem ser ignorados.

O QUE NÃO FAZER

Não gerar novos catálogos.

Não usar as versões modernas ou promocionais.

Não misturar produtos de um catálogo em outro.

Não abrir os três catálogos juntos.

Não usar carrossel para uma imagem longa.

Não transformar o catálogo em fundo da página.

Não adicionar preços, produtos ou sabores dentro das artes.

Não modificar o restante do site sem necessidade.

VALIDAÇÃO FINAL OBRIGATÓRIA

Antes de concluir, teste:

Clique em Picolés: abre somente o catálogo de picolés.

Clique em Sorvetes: abre somente o catálogo de sorvetes.

Clique em Açaí: abre somente o catálogo de açaí.

O início da imagem aparece no topo, sem corte.

É possível rolar até o rodapé completo do catálogo.

A imagem mantém a proporção em desktop, tablet e celular.

X, Voltar ao site, Escape e Voltar do navegador fecham corretamente.

Ao fechar, o usuário retorna ao mesmo ponto da página.

Nenhuma versão antiga ou alternativa aparece no build final.

Não existem erros no console, links quebrados ou rolagem horizontal.

O botão “Baixar catálogo completo (PDF)” aparece no topo e no final do modal.

O download salva catalogo-qotimo-produtos.pdf, sem abrir uma nova aba.

O PDF baixado abre corretamente e contém nove páginas completas.

Implemente, execute o projeto, revise visualmente as três aberturas e corrija qualquer corte, deformação, sobreposição ou inconsistência antes de entregar.