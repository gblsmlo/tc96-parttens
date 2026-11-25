import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonCanvas } from './person-canvas.tsx'
import { personControlArgs } from './person-controls.ts'
import { ComposedPerson } from './person-layouts.tsx'

const meta = {
  decorators: [PersonCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Person/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedPerson {...personControlArgs} />,
}

export const AvatarOnlyValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The avatar alone on the surface, with the name left to the accessible name and the list. For a dense row, such as a card or a table cell, where the name would not fit.',
      },
    },
  },
  render: () => <ComposedPerson {...personControlArgs} display="avatar" />,
}
