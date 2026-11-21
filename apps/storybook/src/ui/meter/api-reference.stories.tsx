import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@tc96/ui/meter'
import { Slot } from '../../test-utils/anatomy-slot'
import { MeterCanvas } from './meter-frame.tsx'

const meta = {
  args: { value: 60 },
  component: Meter,
  decorators: [MeterCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Meter/API Reference',
} satisfies Meta<typeof Meter>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Meter {...args}>
      <div className="flex items-center gap-2">
        <MeterLabel>
          <Slot name="MeterLabel" />
        </MeterLabel>
        <MeterValue className="ms-auto">
          {() => <Slot name="MeterValue" />}
        </MeterValue>
      </div>
      <MeterTrack className="flex h-6 items-center">
        <MeterIndicator className="flex shrink-0 items-center px-2 text-primary-foreground text-xs">
          MeterIndicator
        </MeterIndicator>
        <span className="px-2 text-foreground text-xs">MeterTrack</span>
      </MeterTrack>
    </Meter>
  ),
}
