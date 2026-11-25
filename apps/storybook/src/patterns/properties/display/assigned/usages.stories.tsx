import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { TaskOwnerRow, TeamTaskList } from './assigned-layouts'

const meta = {
  decorators: [
    (Story) => (
      <div className="min-h-80 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Assigned/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TaskOwner: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The owner of a task card, on the [Default](?path=/story/patterns-properties-display-assigned-layouts--default) layout: the assignee on the end of the card, with the list aligned to its end and Atribuir while no one is set.',
      },
    },
  },
  render: () => <TaskOwnerRow />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Responsável: Gabriel Melo',
      }),
    ).toBeVisible()
  },
}

export const TeamTasks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The assignees of a team task list, on the [Default](?path=/story/patterns-properties-display-assigned-layouts--default) layout as read-only `AssignedPropertyBadge` values: one per task, and Sem responsável on the task no one owns.',
      },
    },
  },
  render: () => <TeamTaskList />,
  play: async ({ canvasElement }) => {
    const list = within(
      within(canvasElement).getByRole('list', { name: 'Tarefas da equipe' }),
    )

    await expect(list.getAllByRole('listitem')).toHaveLength(3)
    await expect(list.getByText('Sem responsável')).toBeVisible()
  },
}
