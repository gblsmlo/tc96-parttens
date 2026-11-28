import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup1 as RecordGroup1Block } from '@tc96/ui/blocks/application/record-group/record-group-1'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { taskItems, taskLabels } from '../fixtures/checklist.ts'

function TaskGroup() {
  const [items, setItems] = useState(taskItems)
  const [newItemTitle, setNewItemTitle] = useState('')

  return (
    <RecordGroup1Block
      items={items}
      labels={taskLabels}
      locale="pt-BR"
      newItemTitle={newItemTitle}
      onCreate={(title, completed) => {
        setItems((current) => [
          ...current,
          { completed, id: `item-${current.length + 1}`, title },
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
      onItemDelete={(id) =>
        setItems((current) => current.filter((item) => item.id !== id))
      }
      onItemMove={(id, targetIndex) =>
        setItems((current) => {
          const moving = current.find((item) => item.id === id)
          if (!moving) return current
          const rest = current.filter((item) => item.id !== id)
          return [
            ...rest.slice(0, targetIndex),
            moving,
            ...rest.slice(targetIndex),
          ]
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

const meta = {
  component: TaskGroup,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup1',
} satisfies Meta<typeof TaskGroup>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup1: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A task checklist inside an inset group: the items, the draft title of a new item and the six checklist callbacks (create, complete, delete, move, rename and draft change) come in as props, and every change leaves through them. The checklist is editable and renders in plain, so its rows take the row height of the group.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const tasks = within(
      within(canvasElement).getByRole('region', { name: 'Tarefas' }),
    )

    await expect(
      tasks.getByRole('checkbox', { name: 'Baixar extratos de 2024' }),
    ).toBeChecked()
    await expect(
      tasks.getByRole('checkbox', { name: 'Redigir contestação' }),
    ).not.toBeChecked()
  },
}
