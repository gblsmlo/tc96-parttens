import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextCanvas } from './text-canvas.tsx'
import { textControlArgs } from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'

const meta = {
  decorators: [TextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedText {...textControlArgs} />,
}

export const InlineField: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A field takes the place of the value inside the surface from the first render, after the icon. For a value the user edits often, where an add button would cost a click.',
      },
    },
  },
  render: () => <ComposedText {...textControlArgs} editing="inline" />,
}
