import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@tc96/ui/meter'
import {
  expect,
  isInaccessible,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { meterControlArgs } from './meter-controls.ts'
import { MeterCanvas } from './meter-frame.tsx'
import {
  AdjustableMeter,
  ComposedMeter,
  StorageMeter,
} from './meter-layouts.tsx'

const meta = {
  decorators: [MeterCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Meter/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const partIn = (container: HTMLElement, slot: string) => {
  const part = container.querySelector(`[data-slot="${slot}"]`)
  if (!(part instanceof HTMLElement))
    throw new Error(`The part ${slot} did not render.`)
  return part
}

const rangeArgs = { ...meterControlArgs, max: 80, min: 20 }

export const NamedByLabel: Story = {
  render: () => <ComposedMeter {...meterControlArgs} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Label text',
    })
    const label = partIn(canvasElement, 'meter-label')
    await expect(meter).toHaveAttribute('aria-labelledby', label.id)
  },
}

export const RangeAttributes: Story = {
  render: () => <ComposedMeter {...rangeArgs} value={35} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter')
    await expect(meter).toHaveAttribute('aria-valuemin', '20')
    await expect(meter).toHaveAttribute('aria-valuemax', '80')
    await expect(meter).toHaveAttribute('aria-valuenow', '35')
  },
}

export const ScalesToRange: Story = {
  render: () => <ComposedMeter {...rangeArgs} value={35} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter')
    await expect(meter).toHaveAttribute('aria-valuetext', '25%')
    await expect(partIn(meter, 'meter-value')).toHaveTextContent('25%')
    await expect(partIn(meter, 'meter-indicator').style.width).toBe('25%')
  },
}

export const ValueTextHidden: Story = {
  render: () => <ComposedMeter {...meterControlArgs} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Label text',
    })
    const value = partIn(meter, 'meter-value')
    await expect(value).toHaveTextContent('60%')
    await expect(isInaccessible(value)).toBe(true)
    await expect(isInaccessible(meter)).toBe(false)
  },
}

export const ClampsToRange: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ComposedMeter {...rangeArgs} label="Above max" value={150} />
      <ComposedMeter {...rangeArgs} label="Below min" value={5} />
      <ComposedMeter {...rangeArgs} label="Not a number" value={NaN} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const expected = [
      ['Above max', '80', '100%'],
      ['Below min', '20', '0%'],
      ['Not a number', '20', '0%'],
    ] as const
    for (const [name, now, share] of expected) {
      const meter = canvas.getByRole('meter', { name })
      await expect(meter).toHaveAttribute('aria-valuenow', now)
      await expect(meter).toHaveAttribute('aria-valuetext', share)
      await expect(partIn(meter, 'meter-indicator').style.width).toBe(share)
    }
  },
}

export const RawValueInCallbacks: Story = {
  render: () => <StorageMeter used={12} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', { name: 'Storage' })
    await expect(meter).toHaveAttribute('aria-valuenow', '10')
    await expect(partIn(meter, 'meter-indicator').style.width).toBe('100%')
    await expect(meter).toHaveAttribute('aria-valuetext', '12 of 10 GB used')
    await expect(partIn(meter, 'meter-value')).toHaveTextContent('12 / 10 GB')
  },
}

export const FormattedValueInCallbacks: Story = {
  render: () => (
    <Meter
      getAriaValueText={(formattedValue) => `Usage ${formattedValue}`}
      value={150}
    >
      <div className="flex items-center gap-2">
        <MeterLabel>Label text</MeterLabel>
        <MeterValue className="ms-auto">
          {(formattedValue) => `Usage ${formattedValue}`}
        </MeterValue>
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter')
    await expect(meter).toHaveAttribute('aria-valuetext', 'Usage 100%')
    await expect(partIn(meter, 'meter-value')).toHaveTextContent('Usage 100%')
  },
}

export const BuiltInTrack: Story = {
  render: () => <Meter aria-label="Label text" value={60} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Label text',
    })
    const track = partIn(meter, 'meter-track')
    const indicator = partIn(track, 'meter-indicator')
    await expect(indicator.style.width).toBe('60%')
    await expect(track.getBoundingClientRect().height).toBe(8)
    await expect(indicator.getBoundingClientRect().height).toBe(8)
  },
}

export const ChildrenReplaceTrack: Story = {
  render: () => (
    <Meter value={60}>
      <MeterLabel>Label text</MeterLabel>
      <MeterValue />
    </Meter>
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Label text',
    })
    await expect(meter).toHaveAttribute('aria-valuenow', '60')
    await expect(meter.querySelector('[data-slot="meter-track"]')).toBeNull()
    await expect(
      meter.querySelector('[data-slot="meter-indicator"]'),
    ).toBeNull()
  },
}

export const PartSlots: Story = {
  render: () => <ComposedMeter {...meterControlArgs} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter')
    await expect(meter).not.toHaveAttribute('data-slot')
    for (const slot of [
      'meter-label',
      'meter-value',
      'meter-track',
      'meter-indicator',
    ])
      await expect(
        meter.querySelectorAll(`[data-slot="${slot}"]`),
      ).toHaveLength(1)
  },
}

export const FormatsValue: Story = {
  render: () => (
    <Meter
      format={{ style: 'unit', unit: 'megabyte' }}
      locale="en-US"
      max={512}
      value={502}
    >
      <div className="flex items-center gap-2">
        <MeterLabel>Label text</MeterLabel>
        <MeterValue className="ms-auto" />
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter')
    await expect(meter).toHaveAttribute('aria-valuetext', '502 MB')
    await expect(partIn(meter, 'meter-value')).toHaveTextContent('502 MB')
  },
}

export const FollowsValue: Story = {
  render: () => <AdjustableMeter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const meter = canvas.getByRole('meter', { name: 'Label text' })
    const indicator = partIn(meter, 'meter-indicator')
    const value = partIn(meter, 'meter-value')
    await expect(meter).toHaveAttribute('aria-valuenow', '0')
    await expect(value).toHaveTextContent('0%')
    await expect(indicator.style.width).toBe('0%')
    const add = canvas.getByRole('button', { name: 'Add 25' })
    await userEvent.click(add)
    await userEvent.click(add)
    await expect(meter).toHaveAttribute('aria-valuenow', '50')
    await expect(meter).toHaveAttribute('aria-valuetext', '50%')
    await expect(value).toHaveTextContent('50%')
    await expect(indicator.style.width).toBe('50%')
    const track = partIn(meter, 'meter-track').getBoundingClientRect()
    await waitFor(() =>
      expect(indicator.getBoundingClientRect().width).toBeCloseTo(
        track.width / 2,
        0,
      ),
    )
  },
}
