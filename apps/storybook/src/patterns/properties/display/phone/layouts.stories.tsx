import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneCanvas } from './phone-canvas.tsx'
import { phoneControlArgs } from './phone-controls.ts'
import { ComposedPhone, ListInPopoverPhone } from './phone-layouts.tsx'

const meta = {
  decorators: [PhoneCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedPhone {...phoneControlArgs} />,
}

export const ListInPopover: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One trigger with the phone icon, the first number and a count of the others, and the whole list edited in its popup. For a table cell or a dense row, where a row of chips would not fit or two `+` side by side would not say which property they add to.',
      },
    },
  },
  render: () => <ListInPopoverPhone {...phoneControlArgs} />,
}
