import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectCanvas } from './select-canvas.tsx'
import { selectControlArgs } from './select-controls.ts'
import { ComposedSelect } from './select-layouts.tsx'

const meta = {
  decorators: [SelectCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedSelect {...selectControlArgs} />,
}
