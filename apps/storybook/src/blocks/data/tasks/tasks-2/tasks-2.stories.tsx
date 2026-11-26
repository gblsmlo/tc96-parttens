import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  type Tasks2Controls,
  tasks2ControlArgs,
  tasks2ControlArgTypes,
} from './tasks-2-controls.ts'
import { ComposedTasks2 } from './tasks-2-layouts.tsx'

const meta = {
  args: tasks2ControlArgs,
  argTypes: tasks2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks2',
} satisfies Meta<Tasks2Controls>

export default meta

type Story = StoryObj<Tasks2Controls>

export const Tasks2: Story = {
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
