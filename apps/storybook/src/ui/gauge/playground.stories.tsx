import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gauge } from '@tc96/ui/gauge'
import {
  type GaugeControls,
  gaugeControlArgs,
  gaugeControlArgTypes,
} from './gauge-controls.ts'

const meta = {
  args: gaugeControlArgs,
  argTypes: gaugeControlArgTypes,
  decorators: [
    (Story) => (
      <div className="grid w-72 justify-items-center">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  render: ({ content, label, ...args }) => (
    <Gauge {...args} aria-label={label}>
      {content ? (
        <span className="font-medium text-xs tabular-nums">{content}</span>
      ) : null}
    </Gauge>
  ),
  tags: ['!autodocs'],
  title: 'UI/Gauge/Playground',
} satisfies Meta<GaugeControls>

export default meta

type Story = StoryObj<GaugeControls>

export const Playground: Story = {}
