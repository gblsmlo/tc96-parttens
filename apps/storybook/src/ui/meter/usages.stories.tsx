import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@tc96/ui/meter'
import { expect, within } from 'storybook/test'
import { MeterCanvas } from './meter-frame.tsx'
import { PasswordStrengthMeter, StorageMeter } from './meter-layouts.tsx'

const meta = {
  decorators: [MeterCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Meter/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const StorageUsage: Story = {
  render: () => <StorageMeter used={7.2} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', { name: 'Storage' })
    await expect(meter).toHaveAttribute('aria-valuetext', '7.2 of 10 GB used')
    await expect(within(canvasElement).getByText('7.2 / 10 GB')).toBeVisible()
  },
}

export const PasswordStrength: Story = {
  render: () => <PasswordStrengthMeter />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('meter', { name: 'Password strength' }),
    ).toHaveAttribute('aria-valuetext', 'Too weak')
  },
}

export const Bandwidth: Story = {
  render: () => (
    <Meter
      getAriaValueText={(_formatted, value) => `${value} Mbps`}
      max={1000}
      min={500}
      value={700}
    >
      <div className="flex items-center gap-2">
        <MeterLabel>Bandwidth</MeterLabel>
        <MeterValue className="ms-auto">
          {(_formatted, value) => `${value} Mbps`}
        </MeterValue>
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
      <div className="flex justify-between gap-3 text-muted-foreground text-xs">
        <span>500 Mbps</span>
        <span>1000 Mbps</span>
      </div>
    </Meter>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('meter', { name: 'Bandwidth' }),
    ).toHaveAttribute('aria-valuetext', '700 Mbps')
  },
}

export const TeamSeats: Story = {
  render: () => (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-medium text-sm">Team plan</p>
        <p className="text-muted-foreground text-sm">18 of 25 seats</p>
      </div>
      <Meter aria-label="Seats used: 18 of 25" max={25} value={18} />
      <p className="text-muted-foreground text-sm">
        7 seats left. Add seats before you invite more members.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('meter', {
        name: 'Seats used: 18 of 25',
      }),
    ).toHaveAttribute('aria-valuenow', '18')
  },
}
