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
  render: () => <TeamTaskList />,
  play: async ({ canvasElement }) => {
    const list = within(
      within(canvasElement).getByRole('list', { name: 'Tarefas da equipe' }),
    )

    await expect(list.getAllByRole('listitem')).toHaveLength(3)
    await expect(list.getByText('Sem responsável')).toBeVisible()
  },
}
