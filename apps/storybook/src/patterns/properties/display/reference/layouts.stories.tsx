import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReferenceCanvas } from './reference-canvas.tsx'
import { referenceControlArgs } from './reference-controls.ts'
import { ComposedReference } from './reference-layouts.tsx'

const meta = {
  decorators: [ReferenceCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Reference/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedReference {...referenceControlArgs} />,
}
