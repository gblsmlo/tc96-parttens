import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  expectColumnsSectionLabel,
  expectEveryTasksLayout,
} from '../tasks-story.ts'
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

export const OnlyChosenSorts: Story = {
  args: { sorts: ['due', 'title'] },
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Visualização' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: /Ordenar por/ }),
    )
    await expect(
      await screen.findByRole('menuitemradio', { name: 'Prazo' }),
    ).toBeVisible()
    await expect(
      screen.getByRole('menuitemradio', { name: 'Título' }),
    ).toBeVisible()
    for (const name of ['Prioridade', 'Projeto', 'Atualização'])
      await expect(
        screen.queryByRole('menuitemradio', { name }),
      ).not.toBeInTheDocument()
  },
}

export const EveryLayout: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await expectEveryTasksLayout(canvasElement)
  },
}

export const ColumnsSectionLabel: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    await expectColumnsSectionLabel(canvasElement)
  },
}
