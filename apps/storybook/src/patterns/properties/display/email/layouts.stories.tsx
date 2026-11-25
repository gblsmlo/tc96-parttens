import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailCanvas } from './email-canvas.tsx'
import { emailControlArgs } from './email-controls.ts'
import {
  ComposedEmail,
  InlineFieldEmail,
  ListInPopoverEmail,
} from './email-layouts.tsx'

const meta = {
  decorators: [EmailCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Email/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedEmail {...emailControlArgs} />,
}

export const ListInPopover: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One trigger with the mail icon, the first address and a count of the others, and the whole list edited in its popup. For a table cell or a dense row, where a row of chips would not fit or two `+` side by side would not say which property they add to.',
      },
    },
  },
  render: () => <ListInPopoverEmail {...emailControlArgs} />,
}

export const InlineField: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The chips row with a field in place of the add trigger, adding one address at a time with no popup. For a detail panel where typing in place is quicker than opening a popup.',
      },
    },
  },
  render: () => <InlineFieldEmail {...emailControlArgs} />,
}
