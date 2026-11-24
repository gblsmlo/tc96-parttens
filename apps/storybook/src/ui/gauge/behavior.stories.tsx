import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gauge, GaugeRing, GaugeStack, gaugeTones } from '@tc96/ui/gauge'
import { expect, within } from 'storybook/test'

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
  title: 'UI/Gauge/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const slotIn = (root: Element, slot: string) => {
  const element = root.querySelector(`[data-slot="${slot}"]`)
  if (!(element instanceof HTMLElement)) throw new Error(`No ${slot}.`)
  return element
}

export const AnnouncesTheValueAsAMeter: Story = {
  render: () => <Gauge aria-label="Storage used" max={200} value={50} />,
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Storage used',
    })
    await expect(meter).toHaveAttribute('aria-valuenow', '50')
    await expect(meter).toHaveAttribute('aria-valuemax', '200')
    await expect(meter).toHaveAttribute('data-variant', 'bar')
    await expect(meter).toHaveAttribute('data-tone', 'primary')
    await expect(meter).toHaveAttribute('data-size', 'default')
  },
}

export const ClampsTheValueToTheRange: Story = {
  render: () => (
    <div className="grid gap-4">
      <Gauge aria-label="Over" value={140} />
      <Gauge aria-label="Under" value={-20} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('meter', { name: 'Over' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    )
    await expect(canvas.getByRole('meter', { name: 'Under' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    )
  },
}

export const FillsSegmentsByRatio: Story = {
  render: () => (
    <Gauge
      aria-label="Returning leads"
      max={252}
      segments={30}
      value={198}
      variant="segmented"
    />
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Returning leads',
    })
    await expect(
      meter.querySelectorAll('[data-slot="gauge-segment"]'),
    ).toHaveLength(30)
    await expect(
      meter.querySelectorAll('[data-slot="gauge-segment"][data-filled="true"]'),
    ).toHaveLength(24)
  },
}

export const DrawsARingWithCenteredContent: Story = {
  render: () => (
    <Gauge aria-label="Course progress" value={72} variant="ring">
      <span className="font-medium text-xs tabular-nums">72%</span>
    </Gauge>
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Course progress',
    })
    await expect(meter.querySelectorAll('circle')).toHaveLength(2)
    await expect(meter).toHaveTextContent('72%')
    await expect(meter.getBoundingClientRect().width).toBe(56)
  },
}

export const MarksEmptyApartFromZero: Story = {
  render: () => (
    <div className="grid gap-4">
      <Gauge aria-label="Zero" value={0} variant="ring" />
      <Gauge aria-label="Empty" empty value={0} variant="ring" />
      <Gauge aria-label="Empty bar" empty value={0} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const zero = canvas.getByRole('meter', { name: 'Zero' })
    const empty = canvas.getByRole('meter', { name: 'Empty' })
    await expect(zero).not.toHaveAttribute('data-empty')
    await expect(zero.querySelectorAll('circle')).toHaveLength(2)
    await expect(empty).toHaveAttribute('data-empty', 'true')
    await expect(empty.querySelectorAll('circle')).toHaveLength(1)
    await expect(
      canvas
        .getByRole('meter', { name: 'Empty bar' })
        .querySelector('[data-slot="gauge-indicator"]'),
    ).toBeNull()
  },
}

export const SizesSetTheThickness: Story = {
  render: () => (
    <div className="grid gap-4">
      <Gauge aria-label="Small" size="sm" value={40} />
      <Gauge aria-label="Large" size="lg" value={40} />
      <Gauge aria-label="Small ring" size="sm" value={40} variant="ring" />
      <Gauge aria-label="Large ring" size="lg" value={40} variant="ring" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const height = (name: string) =>
      slotIn(
        canvas.getByRole('meter', { name }),
        'gauge-track',
      ).getBoundingClientRect().height
    const width = (name: string) =>
      canvas.getByRole('meter', { name }).getBoundingClientRect().width
    await expect(height('Small')).toBe(4)
    await expect(height('Large')).toBe(12)
    await expect(width('Small ring')).toBe(40)
    await expect(width('Large ring')).toBe(80)
  },
}

export const TonesPaintTheFill: Story = {
  render: () => (
    <div className="grid gap-3">
      {gaugeTones.map((tone) => (
        <Gauge aria-label={tone} key={tone} tone={tone} value={60} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const tone of gaugeTones) {
      const meter = canvas.getByRole('meter', { name: tone })
      await expect(meter).toHaveAttribute('data-tone', tone)
      await expect(slotIn(meter, 'gauge-indicator')).toHaveClass(`bg-${tone}`)
    }
  },
}

export const ColorWinsOverTone: Story = {
  render: () => (
    <div className="grid gap-4">
      <Gauge
        aria-label="Bar"
        color="rgb(37, 99, 235)"
        tone="success"
        value={60}
      />
      <Gauge
        aria-label="Segments"
        color="rgb(37, 99, 235)"
        segments={4}
        value={50}
        variant="segmented"
      />
      <Gauge
        aria-label="Ring"
        color="rgb(37, 99, 235)"
        value={60}
        variant="ring"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bar = canvas.getByRole('meter', { name: 'Bar' })
    await expect(bar).toHaveAttribute('data-tone', 'success')
    await expect(slotIn(bar, 'gauge-indicator').style.backgroundColor).toBe(
      'rgb(37, 99, 235)',
    )
    const segments = canvas
      .getByRole('meter', { name: 'Segments' })
      .querySelectorAll<HTMLElement>('[data-slot="gauge-segment"]')
    await expect(segments[0]?.style.backgroundColor).toBe('rgb(37, 99, 235)')
    await expect(segments[3]?.style.backgroundColor).toBe('')
    const arc = canvas
      .getByRole('meter', { name: 'Ring' })
      .querySelector<SVGElement>('[data-slot="gauge-indicator"]')
    await expect(arc?.style.stroke).toBe('rgb(37, 99, 235)')
  },
}

export const DecorativeRingHasNoMeter: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <GaugeRing ratio={0.3} size="sm" />
      <span>30% complete</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot="gauge-ring"]')
    await expect(within(canvasElement).queryByRole('meter')).toBeNull()
    await expect(ring).toHaveAttribute('aria-hidden', 'true')
    await expect(ring?.textContent).toBe('')
    await expect(ring?.querySelectorAll('circle')).toHaveLength(2)
  },
}

export const StackReadsEachPart: Story = {
  render: () => (
    <GaugeStack
      aria-label="Subscribers by plan"
      parts={[
        { id: 'free', label: 'Free 58%', value: 58 },
        { id: 'pro', label: 'Pro 31%', value: 31 },
        { color: 'var(--foreground)', id: 'none', label: 'Lost 0%', value: -4 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Subscribers by plan',
    })
    const parts = within(list).getAllByRole('listitem')
    await expect(parts.map((part) => part.textContent)).toEqual([
      'Free 58%',
      'Pro 31%',
      'Lost 0%',
    ])
    await expect(parts[0]?.style.flexGrow).toBe('58')
    await expect(parts[2]?.style.flexGrow).toBe('0')
    await expect(parts[2]?.style.backgroundColor).toBe('var(--foreground)')
  },
}
