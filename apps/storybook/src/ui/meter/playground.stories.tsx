import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type MeterControls,
  meterControlArgs,
  meterControlArgTypes,
} from './meter-controls.ts'
import { MeterCanvas } from './meter-frame.tsx'
import { ComposedMeter } from './meter-layouts.tsx'

const meta = {
  args: meterControlArgs,
  argTypes: meterControlArgTypes,
  decorators: [MeterCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedMeter {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Meter/Playground',
} satisfies Meta<MeterControls>

export default meta

type Story = StoryObj<MeterControls>

export const Playground: Story = {}
