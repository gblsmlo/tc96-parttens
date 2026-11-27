import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  type Tasks6Controls,
  tasks6ControlArgs,
  tasks6ControlArgTypes,
} from './tasks-6-controls.ts'
import { ComposedTasks6 } from './tasks-6-layouts.tsx'

const meta = {
  args: tasks6ControlArgs,
  argTypes: tasks6ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks6',
} satisfies Meta<Tasks6Controls>

export default meta

type Story = StoryObj<Tasks6Controls>

export const Tasks6: Story = {
  args: { groupBy: 'status' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect((await canvas.findAllByText('Cancelada'))[0]).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Ordenar' }))
    const newest = await screen.findByRole('menuitemradio', {
      name: 'Mais recentes',
    })
    await userEvent.click(newest)
    await expect(newest).toHaveAttribute('aria-checked', 'true')
  },
}
