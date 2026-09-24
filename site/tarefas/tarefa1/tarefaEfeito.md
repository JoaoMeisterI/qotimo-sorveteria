Você está trabalhando no repositório:

https://github.com/JoaoMeisterI/qotimo-sorveteria

Implemente a animação de preenchimento do sorvete no Hero da página inicial.

ARQUIVO FORNECIDO

O arquivo WebM anexado possui:

* Codec: VP9
* Transparência real com canal alpha
* Resolução: 930 × 2226 px
* Proporção compatível com a imagem atual de 1017 × 2430 px
* 30 fps
* Duração aproximada: 5,06 segundos
* Tamanho aproximado: 2,3 MB
* Começa com o cascão vazio
* Mostra o bico preenchendo o sorvete
* Termina com o sorvete completamente preenchido

Renomeie e coloque o arquivo em:

site/assets/hero/cascao-preenchendo.webm

OBJETIVO PRINCIPAL

Quando o usuário entrar no site, o Hero deve aparecer normalmente, mas o cascão deve começar vazio e ser preenchido pela animação.

A animação deve acontecer uma única vez por carregamento da página.

Não pode aparecer o sorvete já preenchido antes de a animação começar.

Não pode haver flash da imagem atual `cascao-hero-1017.webp` atrás das partes transparentes do vídeo.

Ao terminar, o último frame preenchido deve permanecer visível, sem reiniciar e sem desaparecer.

PRESERVAR O DESIGN ATUAL

Antes de alterar qualquer coisa, analise:

* `site/index.html`
* `site/styles.css`
* `site/script.js`
* `site/assets/hero/cascao-hero-1017.webp`
* As variantes responsivas do cascão

Preserve rigorosamente:

* Posição atual do cascão
* Escala atual
* Centralização
* Proporção
* Corte inferior feito pela onda branca
* Camadas e z-index do Hero
* Ondas azul e vermelha
* Textos, botões e navegação
* Comportamento responsivo
* Aparência das outras seções
* Parallax suave já existente

Faça uma alteração mínima e localizada. Não redesenhe o Hero nem altere elementos que não sejam necessários.

ESTRUTURA DA MÍDIA

Substitua a exibição direta da imagem por um contêiner de mídia que possa acomodar:

1. Um poster do cascão vazio
2. O vídeo WebM transparente
3. A imagem preenchida atual como fallback

O vídeo deve usar:

* `autoplay`
* `muted`
* `playsinline`
* `preload="auto"`
* Sem `controls`
* Sem `loop`
* `aria-hidden="true"`

Inclua um `<source>` com:

`type="video/webm; codecs=vp9"`

Não use a imagem preenchida posicionada diretamente atrás do vídeo durante a animação, pois ela apareceria através das áreas transparentes e destruiria o efeito do cascão vazio.

POSTER INICIAL

Extraia do próprio WebM um frame inicial, enquanto o cascão ainda está completamente vazio, preservando o canal alpha.

Salve como:

site/assets/hero/cascao-vazio-poster.png

Use esse arquivo como estado visual inicial enquanto o vídeo carrega.

O poster deve ocupar exatamente a mesma posição, largura e proporção do vídeo. Não deve causar mudança de layout quando o vídeo aparecer.

Se usar FFmpeg, force a decodificação VP9 com alpha ao extrair o frame. Verifique que o PNG resultante realmente possui transparência e não um fundo preto.

CARREGAMENTO E TRANSIÇÕES

Implemente os seguintes estados:

* Inicial: poster transparente do cascão vazio visível
* Vídeo pronto: iniciar o vídeo e fazer uma transição curta de opacidade entre poster e vídeo
* Durante a reprodução: somente o vídeo deve representar o cascão
* Final: manter o vídeo parado no último frame
* Erro ou formato incompatível: mostrar `cascao-hero-1017.webp`

A transição deve ser discreta, aproximadamente entre 120 e 200 ms.

Não permita:

* Fundo preto
* Retângulo no vídeo
* Flash do sorvete preenchido
* Piscada entre poster e vídeo
* Mudança de escala
* Salto de posição
* Repetição automática
* Reinício ao rolar a página
* Controles de vídeo visíveis

JAVASCRIPT

Atualize `site/script.js` para:

* Iniciar a animação quando o vídeo estiver realmente pronto
* Tratar a Promise retornada por `video.play()`
* Manter o último frame quando ocorrer `ended`
* Ativar o fallback se houver `error`
* Ativar o fallback se o codec não for suportado
* Não reiniciar o vídeo durante scroll, resize ou parallax
* Não reproduzir novamente ao voltar para o Hero
* Respeitar `prefers-reduced-motion`
* Respeitar `navigator.connection.saveData`, quando disponível

Antes de mostrar o vídeo, valide o canal alpha desenhando um frame inicial em um canvas temporário e verificando a transparência de um pixel do canto.

Se o navegador decodificar o fundo como opaco/preto em vez de transparente, não exiba o vídeo. Mostre a imagem estática preenchida como fallback.

Remova o canvas depois da verificação.

MOVIMENTO REDUZIDO E FALLBACK

Quando `prefers-reduced-motion: reduce` estiver ativo:

* Não reproduza o vídeo
* Mostre diretamente a imagem estática preenchida
* Preserve o posicionamento original

Quando `Save-Data` estiver habilitado:

* Não baixe ou reproduza desnecessariamente o vídeo
* Mostre a imagem estática preenchida

A imagem atual deve continuar existindo como fallback:

site/assets/hero/cascao-hero-1017.webp

CSS E RESPONSIVIDADE

A imagem, o poster e o vídeo devem compartilhar exatamente:

* Mesma largura
* Mesma altura visual
* Mesmo eixo central
* Mesmo posicionamento
* Mesmo corte pelas ondas
* Mesmo comportamento responsivo

Utilize `display: block`, `width: 100%`, `height: auto` e `object-fit: contain` quando apropriado.

Defina a proporção do contêiner com base em 930 / 2226 para impedir layout shift.

No desktop, preserve o posicionamento visual atual de `.hero__cascao`.

No mobile, preserve a largura e o fluxo atuais.

O vídeo transparente deve ficar no mesmo nível de camada da imagem atual. Não altere os z-index das ondas sem necessidade.

PARALLAX

O parallax atual é aplicado em `.hero__cascao img`.

Adapte-o para movimentar o contêiner de mídia ou um elemento comum que contenha poster, vídeo e fallback.

Não aplique transformações independentes no vídeo e no poster.

A troca de estado não pode modificar a transformação ou causar deslocamento.

ACESSIBILIDADE

A animação é decorativa:

* O vídeo deve ser ignorado por leitores de tela
* Não devem existir controles
* Preserve um texto alternativo apropriado na imagem de fallback
* Não adicione foco por teclado ao vídeo

VALIDAÇÃO OBRIGATÓRIA

Teste pelo menos:

* Desktop na proporção aproximada de 1713 × 918
* Notebook
* Tablet
* Mobile estreito
* Chrome/Edge
* Firefox
* Navegador sem suporte adequado ao alpha
* `prefers-reduced-motion`
* `Save-Data`
* Carregamento lento
* Falha proposital no caminho do WebM

Confirme visualmente:

1. A tela abre com o cascão vazio.
2. Não aparece sorvete preenchido antes da animação.
3. Não aparece fundo preto ou retangular.
4. O preenchimento ocorre uma única vez.
5. O bico entra e sai conforme o vídeo.
6. O último frame permanece preenchido.
7. A onda branca continua cortando a ponta do cascão no mesmo local.
8. O Hero mantém a composição atual.
9. Nenhuma segunda seção fica indevidamente exposta.
10. Não existe overflow horizontal.
11. Mobile e desktop mantêm a proporção correta.
12. O fallback funciona sem quebrar o layout.

ENTREGA

Depois da implementação:

* Liste os arquivos alterados e criados
* Explique resumidamente a lógica dos estados
* Informe os testes executados
* Mostre o diff final
* Não faça commit nem push sem autorização
