import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Checklist,
  type ChecklistItem,
  type ChecklistProps,
} from '@tc96/parttens'
import { useState } from 'react'
import { fn } from 'storybook/test'

const dueDate = (dayOffset: number) => {
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

const authorOptions = [
  { value: 'gabriel', label: 'Gabriel Melo', fallback: 'GM' },
  { value: 'ana', label: 'Ana Souza', fallback: 'AS' },
]

const initialItems: ChecklistItem[] = [
  {
    id: 'call',
    title: 'Ligar amanhã',
    completed: false,
    authorId: 'gabriel',
    dueDate: dueDate(-1),
  },
  {
    id: 'deal',
    title: '@Deal test Ligue para a monique amanhã',
    completed: false,
    authorId: 'gabriel',
    dueDate: dueDate(0),
  },
  {
    id: 'tests',
    title: '@Deal test Testes, para a uma task',
    completed: false,
    authorId: 'gabriel',
    dueDate: dueDate(0),
  },
]

const meta = {
  title: 'Patterns/Checklist',
  component: Checklist,
  args: {
    ariaLabel: 'Tasks',
    authorOptions,
    items: initialItems,
    newItemTitle: '',
    title: 'Tasks',
    onCreate: () => undefined,
    onItemClick: fn(),
    onItemAuthorChange: () => undefined,
    onItemCompletionChange: () => undefined,
    onItemDelete: () => undefined,
    onItemDueDateChange: () => undefined,
    onItemMove: () => undefined,
    onItemRename: () => undefined,
    onNewItemTitleChange: () => undefined,
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['md', 'sm'] },
    readOnly: { control: 'boolean' },
    progress: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl p-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => <InteractiveChecklist {...args} />,
} satisfies Meta<typeof Checklist>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { items: [] } }
export const Compact: Story = { args: { density: 'sm', progress: true } }
export const ReadOnly: Story = { args: { readOnly: true } }

function InteractiveChecklist(args: ChecklistProps) {
  const [items, setItems] = useState(args.items)
  const [newItemTitle, setNewItemTitle] = useState('')
  return (
    <Checklist
      {...args}
      items={items}
      newItemTitle={newItemTitle}
      onCreate={(title, completed) => {
        setItems((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            title,
            completed,
            authorId: null,
            dueDate: null,
          },
        ])
        setNewItemTitle('')
      }}
      onItemCompletionChange={(id, completed) =>
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, completed } : item,
          ),
        )
      }
      onItemAuthorChange={(id, authorId) =>
        setItems((current) =>
          current.map((item) =>
            item.id === id ? { ...item, authorId } : item,
          ),
        )
      }
      onItemDueDateChange={(id, dueDate) =>
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, dueDate } : item)),
        )
      }
      onItemDelete={(id) =>
        setItems((current) => current.filter((item) => item.id !== id))
      }
      onItemMove={(id, targetIndex) =>
        setItems((current) => {
          const next = [...current]
          const sourceIndex = next.findIndex((item) => item.id === id)
          if (sourceIndex < 0 || targetIndex < 0 || targetIndex >= next.length)
            return current
          const [item] = next.splice(sourceIndex, 1)
          if (!item) return current
          next.splice(targetIndex, 0, item)
          return next
        })
      }
      onItemRename={(id, title) =>
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, title } : item)),
        )
      }
      onNewItemTitleChange={setNewItemTitle}
    />
  )
}
