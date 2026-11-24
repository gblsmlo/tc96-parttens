import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gauge, GaugeStack } from '@tc96/ui/gauge'

const meta = {
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Gauge/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Bar: Story = {
  render: () => <Gauge aria-label="Storage used" value={64} />,
}

export const Segmented: Story = {
  render: () => (
    <Gauge
      aria-label="Returning leads"
      max={252}
      segments={30}
      tone="success"
      value={198}
      variant="segmented"
    />
  ),
}

export const RingWithValue: Story = {
  render: () => (
    <Gauge
      aria-label="Course progress"
      className="mx-auto"
      size="lg"
      value={72}
      variant="ring"
    >
      <span className="font-medium text-xs tabular-nums">72%</span>
    </Gauge>
  ),
}

export const Stack: Story = {
  render: () => (
    <GaugeStack
      aria-label="Subscribers by plan"
      parts={[
        { id: 'free', label: 'Free 58%', value: 58 },
        { id: 'pro', label: 'Pro 31%', value: 31 },
        { id: 'enterprise', label: 'Enterprise 11%', value: 11 },
      ]}
    />
  ),
}
