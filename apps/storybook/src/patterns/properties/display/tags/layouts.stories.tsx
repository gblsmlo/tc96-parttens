import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsCanvas } from './tags-canvas.tsx'
import { tagsControlArgs } from './tags-controls.ts'
import { ComposedTags } from './tags-layouts.tsx'

const meta = {
  decorators: [TagsCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Tags/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedTags {...tagsControlArgs} />,
}

export const Count: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'One surface with a tag icon and the number of applied tags in place of the chips and the add chip; the surface opens the same list. For a dense row, such as a table cell, where the chips would not fit.',
      },
    },
  },
  render: () => <ComposedTags {...tagsControlArgs} display="count" />,
}
