/* =========================================================================
   Qótimo Sorvetes — cadastro das unidades

   FONTE UNICA dos cards da secao "Nossas unidades". O HTML nao repete
   nenhum destes dados: o script.js monta os cards a partir daqui.

   Regra: nada inventado. Campo sem dado confirmado fica `null` com o
   comentario PENDENTE, e o card simplesmente nao mostra aquele item
   (sem endereco -> sem "Como chegar"; sem horario -> sem "Aberto agora").

   Campos
     id            identificador (slug)
     name          nome oficial da unidade
     city          uma das cidades de `QOTIMO_CIDADES` (ou null)
     address       logradouro e numero, como deve aparecer no card
     phone         telefone no formato de exibicao, ex. "(47) 3000-0000"
     openingHours  { seg:[["13:00","22:00"]], ter:..., ..., dom:... }
                   (dia ausente = fechado; varios intervalos por dia ok)
     image         { base, alt, position } — base sem o sufixo -LARGURA.webp
     coordinates   { lat, lng } — tem prioridade sobre o endereco no mapa
     mapsUrl       link do Google Maps ja pronto (opcional; se existir, vale ele)
     featured      true = card grande da grade editorial (so um)
   ========================================================================= */

window.QOTIMO_CIDADES = ['Jaraguá do Sul', 'Corupá', 'Massaranduba'];

window.QOTIMO_UNIDADES = [
  {
    id: 'jaragua-99',
    name: 'Jaraguá 99',                   // do nome do arquivo entregue: 06-unidade-jaragua-99
    city: 'Jaraguá do Sul',
    address: null,                        // PENDENTE: endereço oficial
    phone: null,                          // PENDENTE
    openingHours: null,                   // PENDENTE
    image: {
      base: 'assets/unidades/jaragua-99',
      widths: [640, 1200],
      alt: 'Fachada da unidade Jaraguá 99: letreiro Sorveteria Qótimo Açaíteria, vitrine de vidro e mesas de madeira na calçada',
      position: '50% 40%'
    },
    coordinates: null,                    // PENDENTE
    mapsUrl: null,
    featured: true
  },
  {
    id: 'fachada-azul-01',
    name: null,                           // PENDENTE: nome oficial
    city: 'Corupá',                       // confirmado pelo cliente
    address: null,                        // PENDENTE
    phone: null,                          // PENDENTE
    openingHours: null,                   // PENDENTE
    image: {
      base: 'assets/unidades/fachada-azul-01',
      widths: [480, 900],
      alt: 'Fachada de unidade Qótimo com letreiro azul Sorveteria Açaíteria e porta de vidro',
      position: '55% 30%'
    },
    coordinates: null,
    mapsUrl: null,
    featured: false
  },
  {
    id: 'fachada-azul-02',
    name: null,                           // PENDENTE: nome oficial
    city: 'Corupá',                       // confirmado pelo cliente
    address: null,                        // PENDENTE
    phone: null,                          // PENDENTE
    openingHours: null,                   // PENDENTE
    image: {
      base: 'assets/unidades/fachada-azul-02',
      widths: [480, 900],
      alt: 'Fachada de unidade Qótimo com letreiro azul Sorveteria Qótimo Açaíteria e vitrines com fotos de sobremesas',
      position: '50% 20%'
    },
    coordinates: null,
    mapsUrl: null,
    featured: false
  },
  {
    id: 'origem-area-verde',
    name: null,                           // PENDENTE: nome oficial
    city: 'Corupá',                       // confirmado pelo cliente
    address: null,                        // PENDENTE
    phone: null,                          // PENDENTE
    openingHours: null,                   // PENDENTE
    image: {
      base: 'assets/unidades/origem-area-verde',
      widths: [480, 900, 1200],
      alt: 'Casa azul-turquesa da Qótimo com o logotipo na fachada, cercada de gramado, palmeiras e morros',
      position: '60% 55%'
    },
    coordinates: null,
    mapsUrl: null,
    featured: false
  }
];
