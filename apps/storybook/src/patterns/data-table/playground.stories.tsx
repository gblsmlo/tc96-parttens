import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTableCanvas } from './data-table-canvas.tsx'
import {
  type DataTableControls,
  dataTableControlArgs,
  dataTableControlArgTypes,
} from './data-table-controls.ts'
import { PlaygroundDataTable } from './data-table-playground.tsx'

const meta = {
  args: {
    ...dataTableControlArgs,
    emptyMessage: 'Nenhuma tarefa para exibir.',
  },
  argTypes: {
    ...dataTableControlArgTypes,
    footer: {
      control: 'boolean',
      description:
        'Gives Tarefa and Estimativa `meta.aggregations`, which adds the footer with a count and a sum.',
    },
  },
  decorators: [DataTableCanvas],
  render: (args) => <PlaygroundDataTable {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/DataTable/Playground',
} satisfies Meta<DataTableControls>

export default meta

type Story = StoryObj<DataTableControls>

export const Playground: Story = {}
