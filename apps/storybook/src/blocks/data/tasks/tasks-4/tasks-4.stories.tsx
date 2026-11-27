import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, within } from 'storybook/test'
import {
  expectColumnsSectionLabel,
  expectEveryTasksLayout,
} from '../tasks-story.ts'
import {
  type Tasks4Controls,
  tasks4ControlArgs,
  tasks4ControlArgTypes,
} from './tasks-4-controls.ts'
import { ComposedTasks4 } from './tasks-4-layouts.tsx'

const meta = {
  args: tasks4ControlArgs,
  argTypes: tasks4ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTasks4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Tasks/Tasks4',
} satisfies Meta<Tasks4Controls>

export default meta

type Story = StoryObj<Tasks4Controls>

export const Tasks4: Story = {
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
