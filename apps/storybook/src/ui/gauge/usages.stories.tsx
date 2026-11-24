import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardPanel } from '@tc96/ui/card'
import { Gauge, GaugeRing, GaugeStack } from '@tc96/ui/gauge'
import { useId } from 'react'
import { expect, within } from 'storybook/test'

const meta = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Gauge/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function StorageQuota() {
  const labelId = useId()
  return (
    <Card>
      <CardPanel className="grid gap-3 p-5">
        <div className="flex justify-between text-sm">
          <span className="font-medium" id={labelId}>
            Storage
          </span>
          <span className="text-muted-foreground tabular-nums">
            38.2 GB of 50 GB
          </span>
        </div>
        <Gauge
          aria-labelledby={labelId}
          getAriaValueText={() => '38.2 GB of 50 GB'}
          max={50}
          value={38.2}
        />
      </CardPanel>
    </Card>
  )
}

function ComplianceChecks() {
  const labelId = useId()
  return (
    <Card>
      <CardPanel className="grid gap-3 p-5">
        <div className="flex justify-between text-sm">
          <span className="font-medium" id={labelId}>
            Compliance checks
          </span>
          <span className="text-muted-foreground tabular-nums">
            17 of 20 passing
          </span>
        </div>
        <Gauge
          aria-labelledby={labelId}
          getAriaValueText={() => '17 of 20 passing'}
          max={20}
          segments={20}
          tone="success"
          value={17}
          variant="segmented"
        />
      </CardPanel>
    </Card>
  )
}

function CourseProgress() {
  return (
    <Card>
      <CardPanel className="flex items-center gap-4 p-5">
        <GaugeRing ratio={0.72}>
          <span className="font-medium text-xs tabular-nums">72%</span>
        </GaugeRing>
        <div className="grid gap-0.5 text-sm">
          <span className="font-medium">Design systems course</span>
          <span className="text-muted-foreground">
            72% complete · 13 of 18 lessons
          </span>
        </div>
      </CardPanel>
    </Card>
  )
}

const plans = [
  { id: 'free', name: 'Free', share: '58%', value: 1740 },
  { id: 'pro', name: 'Pro', share: '31%', value: 930 },
  { id: 'enterprise', name: 'Enterprise', share: '11%', value: 330 },
]

function SubscribersByPlan() {
  return (
    <Card>
      <CardPanel className="grid gap-3 p-5">
        <span className="font-medium text-sm">Subscribers by plan</span>
        <GaugeStack
          aria-label="Subscribers by plan"
          parts={plans.map(({ id, name, share, value }) => ({
            id,
            label: `${name} ${share}`,
            value,
          }))}
        />
        <ul
          aria-hidden="true"
          className="flex gap-4 text-muted-foreground text-xs"
        >
          {plans.map(({ id, name, share }, index) => (
            <li className="flex items-center gap-1.5" key={id}>
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: `var(--chart-${index + 1})` }}
              />
              {name} {share}
            </li>
          ))}
        </ul>
      </CardPanel>
    </Card>
  )
}

export const StorageQuotaBar: Story = {
  render: () => <StorageQuota />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('meter', { name: 'Storage' }),
    ).toHaveAttribute('aria-valuetext', '38.2 GB of 50 GB')
  },
}

export const ComplianceChecksSegments: Story = {
  render: () => <ComplianceChecks />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('meter', { name: 'Compliance checks' }),
    ).toHaveAttribute('aria-valuetext', '17 of 20 passing')
  },
}

export const CourseProgressRing: Story = {
  render: () => <CourseProgress />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('meter')).toBeNull()
    await expect(canvasElement).toHaveTextContent('13 of 18 lessons')
  },
}

export const SubscribersByPlanStack: Story = {
  render: () => <SubscribersByPlan />,
  play: async ({ canvasElement }) => {
    await expect(
      within(
        within(canvasElement).getByRole('list', {
          name: 'Subscribers by plan',
        }),
      ).getAllByRole('listitem'),
    ).toHaveLength(3)
  },
}
