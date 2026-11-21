import type { Meta, StoryObj } from '@storybook/react-vite'
import { meterControlArgs } from './meter-controls.ts'
import { MeterCanvas } from './meter-frame.tsx'
import { ComposedMeter, ValueBesideMeter } from './meter-layouts.tsx'

const meta = {
  decorators: [MeterCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Meter/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const BarOnly: Story = {
  render: () => (
    <ComposedMeter {...meterControlArgs} showLabel={false} showValue={false} />
  ),
}

export const WithoutLabel: Story = {
  render: () => <ComposedMeter {...meterControlArgs} showLabel={false} />,
}

export const WithoutValue: Story = {
  render: () => <ComposedMeter {...meterControlArgs} showValue={false} />,
}

export const ValueBeside: Story = {
  render: () => <ValueBesideMeter />,
}
