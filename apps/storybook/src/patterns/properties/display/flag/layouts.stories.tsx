import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagCanvas } from './flag-canvas.tsx'
import { flagControlArgs } from './flag-controls.ts'
import { ComposedFlag } from './flag-layouts.tsx'

const meta = {
  decorators: [FlagCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Flag/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutIcon: Story = {
  render: () => <ComposedFlag {...flagControlArgs} icon={false} />,
}
