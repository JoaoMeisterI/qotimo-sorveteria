# Qótimo — assets transparentes para implementação

Este pacote contém 49 produtos individuais em PNG RGBA, quatro agrupamentos prontos,
o cascão da abertura, um elemento decorativo e as duas telas aprovadas como referência.

## Regras de uso

- Use `object-fit: contain`; nunca estique ou comprima os produtos.
- Os produtos individuais usam tela transparente simétrica de 1200 × 1200 px, adequada para web em alta densidade.
- Os agrupamentos usam tela transparente de 1600 × 1200 px e já têm hierarquia/overlap definidos.
- Mantenha a paleta do site: azul-marinho `#003B6B`, vermelho `#E52023` e branco `#FFFFFF`.
- Construa ondas, fundos, cards e botões em CSS/SVG; não rasterize esses elementos.
- Preserve os rótulos e logos presentes nas imagens. Não altere nomes, volumes ou sabores.
- As telas 01 e 02 da pasta de referências são as composições aprovadas e devem orientar o restante.

## Agrupamentos recomendados

- Tradicionais: Sundae Morango, Moreninha e Sundae Chocolate.
- Picolés: Blue Ice, Chocolate e Coco.
- Sorvetes: Pistache, Napolitano e Super Flocos.
- Açaí: individual, pote de 1 L e picolé.

## Observação de fidelidade

Os produtos são representações visuais produzidas para a proposta do site e não substituem
fotografias oficiais nem artes técnicas de embalagem. Use o arquivo `manifest.json` para obter
caminhos, categorias, dimensões e validação de transparência.
