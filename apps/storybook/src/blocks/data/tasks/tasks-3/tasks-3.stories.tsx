import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  type Tasks3Controls,
  tasks3ControlArgs,
  tasks3ControlArgTypes,
} from './tasks-3-controls.ts'
import { ComposedTasks3 } from './tasks-3-layouts.tsx'

const meta = {
  args: tasks3ControlArgs,
  argTypes: tasks3ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks3',
} satisfies Meta<Tasks3Controls>

export default meta

type Story = StoryObj<Tasks3Controls>

export const Tasks3: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [trigger] = await canvas.findAllByRole('button', {
      name: /Alterar status/,
    })
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Concluída' }),
    )
    await expect(
      (await canvas.findAllByRole('button', { name: /Alterar status/ }))[0],
    ).toHaveAccessibleName('Status: Concluída. Alterar status')
  },
}
