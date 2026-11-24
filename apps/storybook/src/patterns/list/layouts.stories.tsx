import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListCanvas } from './list-canvas.tsx'
import { listControlArgs } from './list-controls.ts'
import {
  ComposedList,
  DividedRowsFormation,
  LinkRowsFormation,
  MultipleChoiceRowsFormation,
  SingleChoiceRowsFormation,
  StackedRowsFormation,
} from './list-layouts.tsx'

const meta = {
  decorators: [ListCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/List/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedList {...listControlArgs} />,
}

export const StackedRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Outline rows in a list, 8px apart, each with its own border and its actions at the end. For a short list on a page or in a card body.',
      },
    },
  },
  render: () => <StackedRowsFormation />,
}

export const DividedRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Plain rows in one bordered list, with a line between them. For a longer list that reads as one block.',
      },
    },
  },
  render: () => <DividedRowsFormation />,
}

export const LinkRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Plain rows in one bordered list, each row a link with a chevron at the end. For a list of destinations or calls to action, where the whole row is the target.',
      },
    },
  },
  render: () => <LinkRowsFormation />,
}

export const SingleChoiceRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Outline rows in a `RadioGroup`, each row a `label` with a `Radio` at the end; the checked row takes the primary border. For one choice among options that need an icon and a line of detail.',
      },
    },
  },
  render: () => <SingleChoiceRowsFormation />,
}

export const MultipleChoiceRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Outline rows in a `CheckboxGroup`, each row a `label` with a `Checkbox` at the end; every checked row takes the primary border. For several choices that need an icon and a line of detail.',
      },
    },
  },
  render: () => <MultipleChoiceRowsFormation />,
}
