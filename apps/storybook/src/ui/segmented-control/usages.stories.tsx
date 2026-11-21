import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroupPrimitive, RadioPrimitive } from '@tc96/ui/radio-group'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tc96/ui/segmented-control'
import { TogglePrimitive } from '@tc96/ui/toggle'
import { ToggleGroupPrimitive } from '@tc96/ui/toggle-group'
import { KanbanIcon, ListIcon, TableIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, within } from 'storybook/test'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/SegmentedControl/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const plans = {
  monthly: { note: 'billed every month', price: '$12' },
  yearly: { note: 'billed $120 once a year', price: '$10' },
} as const

type Period = keyof typeof plans

const isBillingPeriod = (value: unknown): value is Period =>
  value === 'monthly' || value === 'yearly'

const ProPlanPrice = () => {
  const [period, setPeriod] = useState<Period>('yearly')
  const plan = plans[period]

  return (
    <div className="flex w-72 flex-col items-start gap-4 rounded-lg border p-4">
      <SegmentedControl
        aria-label="Billing period"
        render={
          <RadioGroupPrimitive
            onValueChange={(value) => {
              if (isBillingPeriod(value)) setPeriod(value)
            }}
            value={period}
          />
        }
      >
        <SegmentedControlItem render={<RadioPrimitive.Root value="monthly" />}>
          Monthly
        </SegmentedControlItem>
        <SegmentedControlItem render={<RadioPrimitive.Root value="yearly" />}>
          Yearly
        </SegmentedControlItem>
      </SegmentedControl>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-2xl">
          {plan.price}
          <span className="font-normal text-muted-foreground text-sm">
            {' '}
            per seat a month
          </span>
        </span>
        <span className="text-muted-foreground text-sm">{plan.note}</span>
      </div>
    </div>
  )
}

export const BillingPeriod: Story = {
  render: () => <ProPlanPrice />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('radiogroup', { name: 'Billing period' }),
    ).toBeVisible()
    await expect(canvas.getByRole('radio', { name: 'Yearly' })).toBeChecked()
    await expect(canvas.getByText('billed $120 once a year')).toBeVisible()
  },
}

const sections = [
  { href: '#overview', label: 'Overview' },
  { href: '#activity', label: 'Activity' },
  { href: '#members', label: 'Members' },
  { href: '#settings', label: 'Settings' },
]

export const ProjectSections: Story = {
  render: () => (
    <div className="flex w-md max-w-full flex-col gap-3">
      <h2 className="font-semibold text-lg">Website redesign</h2>
      <SegmentedControl aria-label="Project sections" render={<nav />}>
        {sections.map(({ href, label }) => (
          <SegmentedControlItem
            key={href}
            render={(props) => (
              <a
                {...props}
                aria-current={label === 'Activity' ? 'page' : undefined}
                href={href}
              />
            )}
          >
            {label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Project sections',
    })
    await expect(
      within(nav).getByRole('link', { name: 'Activity' }),
    ).toHaveAttribute('aria-current', 'page')
  },
}

export const IssueStatusFilter: Story = {
  render: () => (
    <div className="flex w-md max-w-full items-center justify-between gap-3">
      <span className="font-medium text-sm">Issues</span>
      <SegmentedControl
        aria-label="Status"
        render={<ToggleGroupPrimitive defaultValue={['open']} />}
        size="sm"
      >
        <SegmentedControlItem render={<TogglePrimitive value="open" />}>
          Open 12
        </SegmentedControlItem>
        <SegmentedControlItem render={<TogglePrimitive value="closed" />}>
          Closed 48
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Status' })
    await expect(
      within(group).getByRole('button', { name: 'Open 12' }),
    ).toHaveAttribute('aria-pressed', 'true')
  },
}

export const ChartRange: Story = {
  render: () => (
    <div className="flex w-md max-w-full flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-medium text-sm">Revenue</span>
          <span className="font-semibold text-xl">$48,210</span>
        </div>
        <SegmentedControl
          aria-label="Chart range"
          render={<RadioGroupPrimitive defaultValue="30d" />}
          size="sm"
        >
          <SegmentedControlItem render={<RadioPrimitive.Root value="7d" />}>
            7D
          </SegmentedControlItem>
          <SegmentedControlItem render={<RadioPrimitive.Root value="30d" />}>
            30D
          </SegmentedControlItem>
          <SegmentedControlItem render={<RadioPrimitive.Root value="90d" />}>
            90D
          </SegmentedControlItem>
        </SegmentedControl>
      </div>
      <span className="text-muted-foreground text-sm">
        Up 12% from the previous 30 days
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('radio', { name: '30D' }),
    ).toBeChecked()
  },
}

const views = [
  { icon: ListIcon, label: 'List', value: 'list' },
  { icon: KanbanIcon, label: 'Board', value: 'board' },
  { icon: TableIcon, label: 'Table', value: 'table' },
]

export const TaskView: Story = {
  render: () => (
    <SegmentedControl
      aria-label="Task view"
      render={<RadioGroupPrimitive defaultValue="board" />}
    >
      {views.map(({ icon: Icon, label, value }) => (
        <SegmentedControlItem
          aria-label={label}
          key={value}
          render={<RadioPrimitive.Root value={value} />}
        >
          <Icon aria-hidden="true" />
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('radiogroup', {
      name: 'Task view',
    })
    await expect(within(group).getAllByRole('radio')).toHaveLength(3)
    await expect(
      within(group).getByRole('radio', { name: 'Board' }),
    ).toBeChecked()
  },
}
