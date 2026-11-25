import type {
  Legal7LawsuitFilter,
  Legal7Publication,
  Legal7Sort,
} from '@tc96/ui/blocks/data/legal/legal-7'
import type { LegalSavedViewRecord } from './saved-views.ts'

export const pageSize = 5

export const publications: Legal7Publication[] = [
  {
    availableOn: '2026-11-12',
    excerpt:
      'Intime-se a parte ré para apresentar contestação no prazo de 15 dias, sob pena de revelia.',
    id: 'pub-701',
    kind: 'Intimação',
    lawsuitTitle: 'Ação de cobrança contra fornecedor de farinha',
    lawyers: ['Beatriz Nogueira (OAB 214563/SP)'],
    number: '5001234-18.2026.8.26.9001',
    tribunal: 'TJSP',
    wait: 'há 12 dias',
  },
  {
    availableOn: '2026-11-13',
    excerpt:
      'Vistos. Recebo a petição inicial. Cite-se a reclamada para comparecer à audiência inicial.',
    id: 'pub-702',
    kind: 'Citação',
    lawsuitTitle: null,
    lawyers: ['Rafael Antunes (OAB 187342/SP)'],
    number: '0010988-41.2026.5.02.9011',
    tribunal: 'TRT-2',
    wait: 'há 11 dias',
  },
  {
    availableOn: '2026-11-16',
    excerpt:
      'Defiro a produção de prova pericial contábil. Nomeio perito e fixo prazo comum de 15 dias para quesitos.',
    id: 'pub-703',
    kind: 'Despacho',
    lawsuitTitle: 'Apelação em dissolução parcial de sociedade',
    lawyers: [
      'Thiago Freitas (OAB 301877/SP)',
      'Camila Duarte (OAB 256410/SP)',
    ],
    number: '2109876-54.2026.8.26.9005',
    tribunal: 'TJSP',
    wait: 'há 8 dias',
  },
  {
    availableOn: '2026-11-17',
    excerpt:
      'Julgo parcialmente procedentes os pedidos para condenar a ré ao pagamento de horas extras e reflexos.',
    id: 'pub-704',
    kind: 'Sentença',
    lawsuitTitle: 'Reclamação trabalhista de ex-motorista',
    lawyers: ['Rafael Antunes (OAB 187342/SP)'],
    number: '0010457-62.2026.5.15.9002',
    tribunal: 'TRT-15',
    wait: 'há 7 dias',
  },
  {
    availableOn: '2026-11-18',
    excerpt:
      'Ficam as partes intimadas da inclusão do feito na pauta de julgamento da sessão virtual de dezembro.',
    id: 'pub-705',
    kind: 'Pauta de julgamento',
    lawsuitTitle: null,
    lawyers: ['Camila Duarte (OAB 256410/SP)'],
    number: null,
    tribunal: 'TRF-3',
    wait: 'há 6 dias',
  },
  {
    availableOn: '2026-11-18',
    excerpt:
      'Manifeste-se a impetrante sobre as informações prestadas pela autoridade coatora, em 10 dias.',
    id: 'pub-706',
    kind: 'Intimação',
    lawsuitTitle: 'Mandado de segurança sobre crédito de ICMS',
    lawyers: ['Camila Duarte (OAB 256410/SP)'],
    number: '5003871-40.2026.4.03.9003',
    tribunal: 'TRF-3',
    wait: 'há 6 dias',
  },
  {
    availableOn: '2026-11-19',
    excerpt:
      'Emende a autora a petição inicial para juntar o contrato de locação e a planilha atualizada do débito.',
    id: 'pub-707',
    kind: 'Despacho',
    lawsuitTitle: null,
    lawyers: ['Beatriz Nogueira (OAB 214563/SP)'],
    number: '1000789-21.2026.8.26.9006',
    tribunal: 'TJSP',
    wait: 'há 5 dias',
  },
  {
    availableOn: '2026-11-19',
    excerpt:
      'Acordam os desembargadores em negar provimento ao recurso ordinário da reclamada, mantida a sentença.',
    id: 'pub-708',
    kind: 'Acórdão',
    lawsuitTitle: 'Recurso ordinário sobre horas extras',
    lawyers: [
      'Rafael Antunes (OAB 187342/SP)',
      'Thiago Freitas (OAB 301877/SP)',
    ],
    number: '0011320-08.2026.5.15.9007',
    tribunal: 'TRT-15',
    wait: 'há 5 dias',
  },
  {
    availableOn: '2026-11-20',
    excerpt:
      'Designo audiência de conciliação para o dia 10 de dezembro, às 14h, por videoconferência.',
    id: 'pub-709',
    kind: 'Intimação',
    lawsuitTitle: null,
    lawyers: ['Thiago Freitas (OAB 301877/SP)'],
    number: '1004412-77.2026.8.26.9014',
    tribunal: 'TJSP',
    wait: 'há 4 dias',
  },
  {
    availableOn: '2026-11-20',
    excerpt:
      'Expeça-se edital de leilão dos bens penhorados, com prazo de 30 dias, intimando-se o executado.',
    id: 'pub-710',
    kind: 'Edital',
    lawsuitTitle: 'Execução de título extrajudicial contra distribuidora',
    lawyers: ['Beatriz Nogueira (OAB 214563/SP)'],
    number: '1012006-93.2026.8.26.9020',
    tribunal: 'TJSP',
    wait: 'há 4 dias',
  },
  {
    availableOn: '2026-11-23',
    excerpt:
      'Vista à parte agravada para contraminuta ao agravo de instrumento no prazo legal.',
    id: 'pub-711',
    kind: 'Intimação',
    lawsuitTitle: null,
    lawyers: ['Camila Duarte (OAB 256410/SP)'],
    number: '5010220-15.2026.4.03.9031',
    tribunal: 'TRF-3',
    wait: 'há 1 dia',
  },
  {
    availableOn: '2026-11-24',
    excerpt:
      'Homologo o acordo celebrado entre as partes e julgo extinto o processo com resolução do mérito.',
    id: 'pub-712',
    kind: 'Sentença',
    lawsuitTitle: 'Rescisão indireta de analista financeira',
    lawyers: ['Rafael Antunes (OAB 187342/SP)'],
    number: '0012045-30.2026.5.02.9018',
    tribunal: 'TRT-2',
    wait: 'hoje',
  },
]

export const tribunals = [
  ...new Set(publications.map((item) => item.tribunal)),
].sort((a, b) => a.localeCompare(b))

export interface PublicationQueueQuery {
  lawsuit: Legal7LawsuitFilter | null
  page: number
  sort: Legal7Sort
  tribunal: string | null
}

export interface PublicationQueuePage {
  items: Legal7Publication[]
  total: number
  tribunals: string[]
}

export const queryPublications = (
  source: readonly Legal7Publication[],
  { lawsuit, page, sort, tribunal }: PublicationQueueQuery,
): PublicationQueuePage => {
  const matching = source
    .filter((item) =>
      lawsuit === null
        ? true
        : (item.lawsuitTitle !== null) === (lawsuit === 'linked'),
    )
    .filter((item) => tribunal === null || item.tribunal === tribunal)
  const ordered = sort === 'newest' ? [...matching].reverse() : matching
  return {
    items: ordered.slice((page - 1) * pageSize, page * pageSize),
    total: ordered.length,
    tribunals,
  }
}

export interface Legal7SavedViewConfig {
  lawsuit: Legal7LawsuitFilter | null
  sort: Legal7Sort
  tribunal: string | null
}

export const savedViews: LegalSavedViewRecord<Legal7SavedViewConfig>[] = [
  {
    config: { lawsuit: 'unlinked', sort: 'oldest', tribunal: null },
    id: 'view-sem-processo',
    label: 'Sem processo',
  },
  {
    config: { lawsuit: null, sort: 'newest', tribunal: 'TRT-15' },
    id: 'view-trt-15',
    label: 'TRT-15 mais novas',
  },
]
