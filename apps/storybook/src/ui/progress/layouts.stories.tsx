import type { Meta, StoryObj } from '@storybook/react-vite'
import { progressControlArgs } from './progress-controls.ts'
import { ProgressCanvas } from './progress-frame.tsx'
import { ComposedProgress, ValueBesideProgress } from './progress-layouts.tsx'

const meta = {
  decorators: [ProgressCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Progress/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const BarOnly: Story = {
  render: () => (
    <ComposedProgress
      {...progressControlArgs}
      showLabel={false}
      showValue={false}
    />
  ),
}

export const WithoutValue: Story = {
  render: () => <ComposedProgress {...progressControlArgs} showValue={false} />,
}

export const ValueBeside: Story = {
  render: () => <ValueBesideProgress />,
}
