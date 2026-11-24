import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gauge } from '@tc96/ui/gauge'
import { expect, within } from 'storybook/test'

const meta = {
  component: Gauge,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Gauge/API Reference',
} satisfies Meta<typeof Gauge>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { value: 64 },
  render: (args) => (
    <div className="grid w-64 gap-6">
      <Gauge {...args} aria-label="Bar" />
      <Gauge {...args} aria-label="Segmented" variant="segmented" />
      <Gauge
        {...args}
        aria-label="Ring"
        className="justify-self-center"
        variant="ring"
      >
        <span className="font-medium text-xs tabular-nums">64%</span>
      </Gauge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('meter')).toHaveLength(3)
  },
}
