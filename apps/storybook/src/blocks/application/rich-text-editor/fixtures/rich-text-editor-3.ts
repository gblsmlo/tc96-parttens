import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'

export const redlineAuthor = { id: 'ana', name: 'Ana Souza' }

export const redlineAuthors = [
  redlineAuthor,
  { id: 'marcos', name: 'Marcos Lima' },
  { id: 'julia', name: 'Júlia Prado' },
]

export const redlineTime = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date)

interface Mark {
  at: string
  id: string
  userId: string
}

const stamp = ({ at, id, userId }: Mark, type: 'insert' | 'remove') => ({
  suggestion: true,
  [`suggestion_${id}`]: { createdAt: Date.parse(at), id, type, userId },
})

const inserted = (mark: Mark, text: string) => ({
  text,
  ...stamp(mark, 'insert'),
})
const removed = (mark: Mark, text: string) => ({
  text,
  ...stamp(mark, 'remove'),
})

const deadline: Mark = {
  at: '2026-11-18T14:30:00Z',
  id: 'prazo',
  userId: 'marcos',
}
const penalty: Mark = {
  at: '2026-11-19T09:05:00Z',
  id: 'multa',
  userId: 'julia',
}
const scope: Mark = {
  at: '2026-11-20T16:45:00Z',
  id: 'escopo',
  userId: 'marcos',
}

export const redlineChangeCount = 3

export function contractValue(changes = redlineChangeCount): RichTextValue {
  const shown = (index: number) => index < changes
  return [
    { children: [{ text: 'Contrato de prestação de serviços' }], type: 'h2' },
    {
      children: [
        {
          text: 'Pelo presente instrumento, a CONTRATANTE e a CONTRATADA ajustam as condições abaixo.',
        },
      ],
      type: 'p',
    },
    { children: [{ text: 'Cláusula 1. Objeto' }], type: 'h3' },
    {
      children: [
        { text: 'A CONTRATADA prestará serviços de consultoria em ' },
        ...(shown(0)
          ? [
              removed(scope, 'planejamento'),
              inserted(scope, 'gestão de projetos'),
            ]
          : [{ text: 'planejamento' }]),
        { text: ' ao longo da vigência deste contrato.' },
      ],
      type: 'p',
    },
    { children: [{ text: 'Cláusula 2. Prazo e pagamento' }], type: 'h3' },
    {
      children: [
        { text: 'O pagamento será feito em até ' },
        ...(shown(1)
          ? [removed(deadline, '30 dias'), inserted(deadline, '45 dias')]
          : [{ text: '30 dias' }]),
        { text: ' após a emissão da nota fiscal, pelo valor mensal acordado.' },
      ],
      type: 'p',
    },
    {
      children: [
        {
          text: 'O atraso no pagamento sujeita a CONTRATANTE à correção monetária',
        },
        ...(shown(2)
          ? [inserted(penalty, ' e a multa de 2% sobre o saldo')]
          : []),
        { text: '.' },
      ],
      type: 'p',
    },
    { children: [{ text: 'Cláusula 3. Confidencialidade' }], type: 'h3' },
    {
      children: [
        {
          text: 'As partes manterão sigilo sobre as informações trocadas durante a execução dos serviços.',
        },
      ],
      type: 'p',
    },
  ] as RichTextValue
}

export const cleanContractValue = (): RichTextValue => contractValue(0)
