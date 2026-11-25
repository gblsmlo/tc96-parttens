import type {
  Agenda1Entry,
  Agenda1Person,
} from '@tc96/ui/blocks/data/agenda/agenda-1'

export const agendaAnchor = '2026-11-25'
export const agendaNow = '2026-11-25T13:00:00.000Z'
export const agendaTimeZone = 'America/Sao_Paulo'

export const owners: Agenda1Person[] = [
  { id: 'beatriz', label: 'Beatriz Nogueira' },
  { id: 'rafael', label: 'Rafael Antunes' },
  { id: 'camila', label: 'Camila Duarte' },
  { id: 'thiago', label: 'Thiago Freitas' },
]

export const entries: Agenda1Entry[] = [
  {
    allDay: false,
    end: '2026-11-18T17:00:00.000Z',
    id: 'tarefa-organizar-arquivo',
    kind: 'task',
    ownerId: 'thiago',
    start: '2026-11-18T15:00:00.000Z',
    title: 'Organizar o arquivo de contratos',
  },
  {
    allDay: false,
    caption: 'Moinho Santa Clara Ltda.',
    end: '2026-11-23T13:00:00.000Z',
    id: 'reuniao-alinhamento',
    kind: 'appointment',
    modality: 'video',
    ownerId: 'beatriz',
    start: '2026-11-23T12:00:00.000Z',
    title: 'Reunião de alinhamento com o Moinho',
  },
  {
    allDay: false,
    completed: true,
    end: '2026-11-23T17:30:00.000Z',
    id: 'tarefa-revisar-contrato',
    kind: 'task',
    ownerId: 'rafael',
    start: '2026-11-23T16:00:00.000Z',
    title: 'Revisar contrato de fornecimento',
  },
  {
    allDay: false,
    end: '2026-11-24T19:30:00.000Z',
    id: 'visita-jundiai',
    kind: 'appointment',
    location: 'Av. Antônio Frederico Ozanam, 1200 – Jundiaí',
    modality: 'in-person',
    ownerId: 'rafael',
    start: '2026-11-24T17:00:00.000Z',
    title: 'Visita técnica à fábrica de Jundiaí',
  },
  {
    allDay: false,
    end: '2026-11-25T12:30:00.000Z',
    id: 'tarefa-pauta',
    kind: 'task',
    ownerId: 'camila',
    start: '2026-11-25T11:30:00.000Z',
    title: 'Preparar pauta da reunião mensal',
  },
  {
    allDay: false,
    end: '2026-11-25T14:30:00.000Z',
    id: 'ligacao-contador',
    kind: 'appointment',
    modality: 'phone',
    ownerId: 'camila',
    start: '2026-11-25T14:00:00.000Z',
    title: 'Ligação com o contador',
  },
  {
    allDay: false,
    caption: 'TransVale Logística S.A.',
    end: '2026-11-25T19:00:00.000Z',
    id: 'proposta-transvale',
    kind: 'appointment',
    modality: 'video',
    ownerId: 'beatriz',
    start: '2026-11-25T18:00:00.000Z',
    title: 'Apresentação da proposta comercial',
  },
  {
    allDay: false,
    end: null,
    id: 'vencimento-relatorio-horas',
    kind: 'due',
    ownerId: 'beatriz',
    start: '2026-11-25T21:00:00.000Z',
    title: 'Enviar relatório de horas',
  },
  {
    allDay: true,
    end: '2026-11-27T03:00:00.000Z',
    id: 'treinamento-atendimento',
    kind: 'appointment',
    location: 'Sala 3',
    modality: 'in-person',
    ownerId: 'thiago',
    start: '2026-11-26T03:00:00.000Z',
    title: 'Treinamento da equipe de atendimento',
  },
  {
    allDay: true,
    caption: 'Clínica Vida Plena',
    end: '2026-11-27T03:00:00.000Z',
    id: 'prazo-declaracao-anual',
    kind: 'deadline',
    ownerId: 'camila',
    start: '2026-11-26T03:00:00.000Z',
    title: 'Entrega da declaração anual',
  },
  {
    allDay: false,
    end: '2026-11-27T15:00:00.000Z',
    id: 'tarefa-planilha-custos',
    kind: 'task',
    ownerId: 'thiago',
    start: '2026-11-27T13:00:00.000Z',
    title: 'Atualizar planilha de custos',
  },
  {
    allDay: false,
    end: '2026-11-27T17:00:00.000Z',
    id: 'almoco-parceiros',
    kind: 'appointment',
    location: 'Restaurante Figueira',
    modality: 'in-person',
    ownerId: 'rafael',
    start: '2026-11-27T15:30:00.000Z',
    title: 'Almoço com parceiros',
  },
  {
    allDay: false,
    end: null,
    id: 'vencimento-fatura-ti',
    kind: 'due',
    ownerId: 'thiago',
    start: '2026-11-27T20:00:00.000Z',
    title: 'Pagar fatura do fornecedor de TI',
  },
  {
    allDay: true,
    end: '2026-11-28T03:00:00.000Z',
    id: 'prazo-alvara',
    kind: 'deadline',
    start: '2026-11-27T03:00:00.000Z',
    title: 'Renovação do alvará de funcionamento',
  },
  {
    allDay: false,
    end: '2026-12-01T14:00:00.000Z',
    id: 'planejamento-2027',
    kind: 'appointment',
    modality: 'video',
    ownerId: 'beatriz',
    start: '2026-12-01T13:00:00.000Z',
    title: 'Reunião de planejamento de 2027',
  },
]

export const entriesBetween = (
  items: readonly Agenda1Entry[],
  from: string,
  to: string,
) => {
  const start = Date.parse(from)
  const end = Date.parse(to)
  return items.filter((entry) => {
    const entryStart = Date.parse(entry.start)
    const entryEnd = entry.end ? Date.parse(entry.end) : entryStart
    return entryStart < end && (entryEnd > start || entryStart >= start)
  })
}
