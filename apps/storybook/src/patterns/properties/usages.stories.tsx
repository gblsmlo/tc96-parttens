import {
  CalendarDotsIcon,
  CellSignalHighIcon,
  CellSignalLowIcon,
  CellSignalMediumIcon,
  CheckCircleIcon,
  CircleIcon,
  ProhibitIcon,
  RadioButtonIcon,
  TagIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  PersonProperty,
  type PersonPropertyOption,
  PropertyCollection,
  type PropertyOption,
  SelectProperty,
  TagsProperty,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import {
  ptBRPropertyLabels,
  ptBRPropertyPlaceholders,
} from './properties-labels.ts'

const statusOptions: readonly PropertyOption[] = [
  { icon: CircleIcon, label: 'A fazer', tone: 'neutral', value: 'todo' },
  {
    icon: RadioButtonIcon,
    label: 'Em andamento',
    tone: 'info',
    value: 'inProgress',
  },
  { icon: CheckCircleIcon, label: 'Concluída', tone: 'success', value: 'done' },
  {
    icon: ProhibitIcon,
    label: 'Cancelada',
    tone: 'neutral',
    value: 'canceled',
  },
]

const priorityOptions: readonly PropertyOption[] = [
  { icon: CellSignalHighIcon, label: 'Alta', tone: 'danger', value: 'high' },
  {
    icon: CellSignalMediumIcon,
    label: 'Média',
    tone: 'warning',
    value: 'medium',
  },
  { icon: CellSignalLowIcon, label: 'Baixa', tone: 'neutral', value: 'low' },
]

const people: readonly PersonPropertyOption[] = [
  { label: 'Bruno Lima', value: 'bruno' },
  { label: 'Ana Souza', value: 'ana' },
]

const tagOptions: readonly PropertyOption[] = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
]

const meta = {
  decorators: [
    (Story) => (
      <div className="min-h-96 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Task: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The header of a task, on the [Default](?path=/story/patterns-properties-layouts--default) layout: status, priority, assignee and due date under the title. Tags stays in the catalog, off, until the menu turns it on.',
      },
    },
  },
  render: function Task() {
    const [status, setStatus] = useState<string | null>('inProgress')
    const [priority, setPriority] = useState<string | null>('high')
    const [assignee, setAssignee] = useState<string | null>(null)
    const [dueDate, setDueDate] = useState<string | null>(null)
    const [tags, setTags] = useState<readonly string[]>([])

    return (
      <header className="flex max-w-xl flex-col gap-2">
        <h2 className="font-semibold text-lg">Revisar o contrato da Acme</h2>
        <PropertyCollection
          ariaLabel="Propriedades da tarefa"
          items={[
            {
              defaultVisible: true,
              icon: RadioButtonIcon,
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
              icon: CellSignalHighIcon,
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
                  options={people}
                  placeholder={ptBRPropertyPlaceholders.person}
                  value={assignee}
                />
              ),
            },
            {
              defaultVisible: true,
              icon: CalendarDotsIcon,
              id: 'dueDate',
              label: 'Prazo',
              render: () => (
                <DateProperty
                  ariaLabel="Prazo"
                  labels={{
                    ...ptBRPropertyLabels.date,
                    fallback: 'Definir prazo',
                  }}
                  locale="pt-BR"
                  onValueChange={setDueDate}
                  value={dueDate}
                />
              ),
            },
            {
              icon: TagIcon,
              id: 'tags',
              label: 'Tags',
              render: () => (
                <TagsProperty
                  ariaLabel="Tags"
                  labels={ptBRPropertyLabels.tags}
                  onValueChange={setTags}
                  options={tagOptions}
                  placeholder={ptBRPropertyPlaceholders.tags}
                  value={tags}
                />
              ),
            },
          ]}
          labels={ptBRPropertyLabels.collection}
        />
      </header>
    )
  },
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Propriedades da tarefa',
    })

    await expect(group).toHaveTextContent('Em andamento')
    await expect(group).toHaveTextContent('Sem responsável')
  },
}

export const Lead: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The header of a lead, on the [Default](?path=/story/patterns-properties-layouts--default) layout: status, owner and tags beside the contact. Próximo contato stays in the catalog, off, until the menu turns it on.',
      },
    },
  },
  render: function Lead() {
    const [status, setStatus] = useState<string | null>('todo')
    const [owner, setOwner] = useState<string | null>('ana')
    const [nextContact, setNextContact] = useState<string | null>('2026-08-28')
    const [tags, setTags] = useState<readonly string[]>(['return'])

    return (
      <header className="flex max-w-xl flex-col gap-2">
        <h2 className="font-semibold text-lg">Marina Costa · Northwind</h2>
        <PropertyCollection
          ariaLabel="Propriedades do lead"
          items={[
            {
              defaultVisible: true,
              icon: RadioButtonIcon,
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
                  options={people}
                  placeholder="Sem dono"
                  value={owner}
                />
              ),
            },
            {
              defaultVisible: true,
              icon: TagIcon,
              id: 'tags',
              label: 'Tags',
              render: () => (
                <TagsProperty
                  ariaLabel="Tags"
                  labels={ptBRPropertyLabels.tags}
                  onValueChange={setTags}
                  options={tagOptions}
                  placeholder={ptBRPropertyPlaceholders.tags}
                  value={tags}
                />
              ),
            },
            {
              icon: CalendarDotsIcon,
              id: 'nextContact',
              label: 'Próximo contato',
              render: () => (
                <DateProperty
                  ariaLabel="Próximo contato"
                  labels={{
                    ...ptBRPropertyLabels.date,
                    fallback: 'Agendar contato',
                  }}
                  locale="pt-BR"
                  onValueChange={setNextContact}
                  value={nextContact}
                />
              ),
            },
          ]}
          labels={ptBRPropertyLabels.collection}
        />
      </header>
    )
  },
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Propriedades do lead',
    })

    await expect(group).toHaveTextContent('Ana Souza')
    await expect(group).toHaveTextContent('Retorno')
  },
}
