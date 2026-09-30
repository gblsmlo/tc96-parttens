import {
  DateProperty,
  PersonProperty,
  PropertyCollection,
  SelectProperty,
  type SelectPropertyOption,
  TagsProperty,
} from 'tc96/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CalendarDaysIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  CircleSlashIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
  TagIcon,
  UserCircleIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, screen, userEvent, within } from 'storybook/test'
import { booleanArgType } from '../../../test-utils/story-arg-types'

const pessoas = [
  { label: 'Bruno Lima', value: 'person-1' },
  { label: 'Ana Souza', value: 'person-2' },
] as const

const etiquetas = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
] as const

// Catálogos de status e prioridade pertencem ao consumer; a story só precisa de
// um conjunto fechado com ícone e tom para exercitar a fileira.
const statusOptions: readonly SelectPropertyOption[] = [
  { icon: CircleIcon, label: 'A fazer', tone: 'neutral', value: 'todo' },
  {
    icon: CircleDotIcon,
    label: 'Em andamento',
    tone: 'info',
    value: 'inProgress',
  },
  { icon: CircleCheckIcon, label: 'Concluído', tone: 'success', value: 'done' },
  {
    icon: CircleSlashIcon,
    label: 'Cancelado',
    tone: 'neutral',
    value: 'canceled',
  },
]

const priorityOptions: readonly SelectPropertyOption[] = [
  { icon: SignalHighIcon, label: 'Alta', tone: 'danger', value: 'high' },
  { icon: SignalMediumIcon, label: 'Média', tone: 'warning', value: 'medium' },
  { icon: SignalLowIcon, label: 'Baixa', tone: 'neutral', value: 'low' },
]

const meta = {
  argTypes: {
    readOnly: booleanArgType,
  },
  component: PropertyCollection,
  parameters: {
    docs: {
      description: {
        component:
          'Fileira de propriedades de uma collection com preferência de visibilidade. O catálogo — quais propriedades existem, em que ordem e quais são default — pertence à collection (Tasks, Leads, Campanhas…); o trigger `…` abre o menu que lista o catálogo inteiro para o usuário adicionar ou remover da fileira. Uma propriedade visível e vazia mostra a própria affordance de preenchimento; oculta, é omitida. Ligar e desligar não reordena: a posição segue a ordem do catálogo.',
      },
    },
  },
  tags: ['autodocs', 'storybook-test'],
  title: 'Patterns/Properties/Groups',
} satisfies Meta<typeof PropertyCollection>

export default meta

type Story = StoryObj<typeof PropertyCollection>

/**
 * O registro de uma Task: status e prioridade sempre têm valor (vazio é estado
 * do domínio), responsável e prazo nascem vazios com affordance própria, e
 * etiquetas ficam fora da fileira até o usuário preferir vê-las.
 */
function TaskCollectionExample({
  readOnly = false,
}: Readonly<{ readOnly?: boolean }>) {
  const [status, setStatus] = useState<string | null>('inProgress')
  const [priority, setPriority] = useState<string | null>('high')
  const [assignee, setAssignee] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [tags, setTags] = useState<readonly string[]>([])

  return (
    <PropertyCollection
      ariaLabel="Propriedades da Task"
      items={[
        {
          defaultVisible: true,
          icon: CircleDotIcon,
          id: 'status',
          label: 'Status',
          render: () => (
            <SelectProperty
              ariaLabel="Status"
              onValueChange={setStatus}
              options={statusOptions}
              value={status}
            />
          ),
        },
        {
          defaultVisible: true,
          icon: SignalHighIcon,
          id: 'priority',
          label: 'Prioridade',
          render: () => (
            <SelectProperty
              ariaLabel="Prioridade"
              onValueChange={setPriority}
              options={priorityOptions}
              value={priority}
            />
          ),
        },
        {
          defaultVisible: true,
          icon: UserCircleIcon,
          id: 'assignee',
          label: 'Responsável',
          render: () => (
            <PersonProperty
              ariaLabel="Responsável"
              onValueChange={setAssignee}
              options={pessoas}
              placeholder="Definir responsável"
              value={assignee}
            />
          ),
        },
        {
          defaultVisible: true,
          icon: CalendarDaysIcon,
          id: 'dueDate',
          label: 'Prazo',
          render: () => (
            <DateProperty
              ariaLabel="Prazo"
              fallback="Definir prazo"
              locale="pt-BR"
              onValueChange={setDueDate}
              value={dueDate}
            />
          ),
        },
        {
          icon: TagIcon,
          id: 'tags',
          label: 'Etiquetas',
          render: () => (
            <TagsProperty
              ariaLabel="Etiquetas"
              onValueChange={setTags}
              options={etiquetas}
              value={tags}
            />
          ),
        },
      ]}
      readOnly={readOnly}
    />
  )
}

/**
 * O registro de um Lead compartilha as mesmas Properties com outro catálogo:
 * sem prioridade, status restrito ao funil e um default diferente. A diferença
 * entre collections mora no registro, nunca em variações das Properties.
 */
function LeadCollectionExample() {
  const [status, setStatus] = useState<string | null>('todo')
  const [owner, setOwner] = useState<string | null>('person-2')
  const [nextContact, setNextContact] = useState<string | null>('2026-08-28')
  const [tags, setTags] = useState<readonly string[]>(['return'])

  return (
    <PropertyCollection
      ariaLabel="Propriedades do Lead"
      items={[
        {
          defaultVisible: true,
          icon: CircleDotIcon,
          id: 'status',
          label: 'Status',
          render: () => (
            <SelectProperty
              ariaLabel="Status"
              onValueChange={setStatus}
              options={statusOptions}
              value={status}
            />
          ),
        },
        {
          defaultVisible: true,
          icon: UserCircleIcon,
          id: 'owner',
          label: 'Dono',
          render: () => (
            <PersonProperty
              ariaLabel="Dono"
              onValueChange={setOwner}
              options={pessoas}
              placeholder="Definir dono"
              value={owner}
            />
          ),
        },
        {
          defaultVisible: true,
          icon: TagIcon,
          id: 'tags',
          label: 'Etiquetas',
          render: () => (
            <TagsProperty
              ariaLabel="Etiquetas"
              onValueChange={setTags}
              options={etiquetas}
              value={tags}
            />
          ),
        },
        {
          icon: CalendarDaysIcon,
          id: 'nextContact',
          label: 'Próximo contato',
          render: () => (
            <DateProperty
              ariaLabel="Próximo contato"
              fallback="Agendar contato"
              locale="pt-BR"
              onValueChange={setNextContact}
              value={nextContact}
            />
          ),
        },
      ]}
    />
  )
}

export const Task: Story = {
  play: async ({ canvas }) => {
    const grupo = await canvas.findByRole('group', {
      name: 'Propriedades da Task',
    })

    await expect(grupo.textContent).toContain('Em andamento')
    await expect(grupo.textContent).toContain('Definir responsável')
    await expect(canvas.queryByLabelText('Etiquetas')).toBe(null)
    await expect(
      canvas.getByRole('button', { name: 'Ajustar propriedades' }),
    ).toBeTruthy()
  },
  parameters: {
    docs: {
      description: {
        story:
          'Defaults visíveis com dois vazios (responsável e prazo) mostrando a affordance da própria Property; etiquetas só entram pelo trigger.',
      },
    },
  },
  render: (args) => <TaskCollectionExample readOnly={args.readOnly} />,
}

export const Lead: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mesmo pattern, outro catálogo: o registro por collection decide quais propriedades existem, a ordem e os defaults.',
      },
    },
  },
  render: () => <LeadCollectionExample />,
}

export const ReadOnly: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Ajustar propriedades' }),
    ).toBe(null)
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sem o trigger de preferência a fileira mostra somente os visíveis.',
      },
    },
  },
  render: () => <TaskCollectionExample readOnly />,
}

/**
 * Nenhuma propriedade default: a fileira nasce só com o trigger, que é o
 * caminho de preenchimento — o zero da collection é uma ação, não um aviso.
 */
export const SemDefaults: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Ajustar propriedades' }),
    )

    // O popup é portalado para fora do canvas; o menu se consulta pelo document.
    const menu = within(await screen.findByRole('menu'))
    const opcoes = menu.getAllByRole('menuitemcheckbox')
    await expect(
      opcoes.map((opcao) => opcao.getAttribute('aria-checked')),
    ).toEqual(['false', 'false'])
  },
  render: () => (
    <PropertyCollection
      ariaLabel="Propriedades"
      items={[
        {
          icon: CircleDotIcon,
          id: 'status',
          label: 'Status',
          render: () => (
            <SelectProperty
              ariaLabel="Status"
              options={statusOptions}
              readOnly
              value="todo"
            />
          ),
        },
        {
          icon: CalendarDaysIcon,
          id: 'dueDate',
          label: 'Prazo',
          render: () => (
            <DateProperty
              ariaLabel="Prazo"
              fallback="Definir prazo"
              locale="pt-BR"
              readOnly
              value={null}
            />
          ),
        },
      ]}
    />
  ),
}
