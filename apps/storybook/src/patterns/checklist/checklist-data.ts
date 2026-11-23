import type { ChecklistItem } from '@tc96/parttens'

export const authorOptions = [
  { fallback: 'GM', label: 'Gabriel Melo', value: 'gabriel' },
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
]

export const dueDateFromToday = (dayOffset: number) => {
  const now = new Date()
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + dayOffset,
      12,
    ),
  ).toISOString()
}

export const behaviorItems: ChecklistItem[] = [
  { completed: false, id: 'first', title: 'Primeira etapa' },
  { completed: true, id: 'second', title: 'Segunda etapa' },
]

interface SampleItemOptions {
  author: boolean
  dueDate: boolean
}

export const sampleItems = ({
  author,
  dueDate,
}: Readonly<SampleItemOptions>): ChecklistItem[] => [
  {
    authorId: author ? 'gabriel' : undefined,
    completed: false,
    dueDate: dueDate ? dueDateFromToday(-1) : undefined,
    id: 'first',
    title: 'Primeira etapa',
  },
  {
    authorId: author ? 'ana' : undefined,
    completed: true,
    dueDate: dueDate ? dueDateFromToday(0) : undefined,
    id: 'second',
    title: 'Segunda etapa',
  },
  {
    authorId: author ? 'ana' : undefined,
    completed: false,
    dueDate: dueDate ? dueDateFromToday(1) : undefined,
    id: 'third',
    title: 'Terceira etapa',
  },
]

export const dealTasks = (): ChecklistItem[] => [
  {
    authorId: 'gabriel',
    completed: false,
    dueDate: dueDateFromToday(-1),
    id: 'call',
    title: 'Ligar amanhã',
  },
  {
    authorId: 'gabriel',
    completed: false,
    dueDate: dueDateFromToday(0),
    id: 'deal',
    title: '@Deal test Ligue para a monique amanhã',
  },
  {
    authorId: 'gabriel',
    completed: false,
    dueDate: dueDateFromToday(0),
    id: 'tests',
    title: '@Deal test Testes, para a uma task',
  },
]

export const subtaskItems: ChecklistItem[] = [
  {
    authorId: 'gabriel',
    completed: true,
    id: 'fields',
    title: 'Mapear os campos do formulário de cadastro',
  },
  {
    authorId: 'ana',
    completed: true,
    id: 'endpoint',
    title: 'Criar o endpoint de validação',
  },
  {
    authorId: 'gabriel',
    completed: false,
    id: 'masks',
    title: 'Aplicar máscara de CPF e telefone',
  },
  {
    authorId: null,
    completed: false,
    id: 'errors',
    title: 'Exibir os erros dentro de cada campo',
  },
  {
    authorId: 'ana',
    completed: false,
    id: 'tests',
    title: 'Cobrir o fluxo com testes de interface',
  },
  {
    authorId: null,
    completed: false,
    id: 'docs',
    title: 'Atualizar a documentação do componente',
  },
]
