import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListCanvas } from './list-canvas.tsx'
import {
  type ListControls,
  listControlArgs,
  listControlArgTypes,
} from './list-controls.ts'
import { PlaygroundList } from './list-playground.tsx'

const meta = {
  args: {
    ...listControlArgs,
    emptyGroupLabel: 'Nenhuma tarefa neste grupo.',
    emptyMessage: 'Nenhuma tarefa para exibir.',
  },
  argTypes: {
    ...listControlArgTypes,
    field: {
      control: 'boolean',
      description:
        'Adds a `ListRowField` with the status, priority, due date and assignee properties, all `variant="plain"`; the skeleton follows.',
    },
  },
  decorators: [ListCanvas],
  render: (args) => <PlaygroundList {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/ListView/Playground',
} satisfies Meta<ListControls>

export default meta

type Story = StoryObj<ListControls>

export const Playground: Story = {}
