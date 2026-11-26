import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  type Tasks5Controls,
  tasks5ControlArgs,
  tasks5ControlArgTypes,
} from './tasks-5-controls.ts'
import { ComposedTasks5 } from './tasks-5-layouts.tsx'

const meta = {
  args: tasks5ControlArgs,
  argTypes: tasks5ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks5',
} satisfies Meta<Tasks5Controls>

export default meta

type Story = StoryObj<Tasks5Controls>

export const Tasks5: Story = {
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
