import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelCanvas } from './icon-label-canvas.tsx'
import { iconLabelControlArgs } from './icon-label-controls.ts'
import { ComposedIconLabel } from './icon-label-layouts.tsx'

const meta = {
  decorators: [IconLabelCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/IconLabel/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedIconLabel {...iconLabelControlArgs} />,
}
