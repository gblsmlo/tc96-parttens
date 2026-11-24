import { InfoIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { expect, fn, userEvent, within } from 'storybook/test'
import { AlertCanvas } from './alert-frame.tsx'
import {
  ActionAlert,
  ParagraphsAlert,
  StatusIcon,
  TitleOnlyAlert,
} from './alert-layouts.tsx'
import { alertStatusIcons, alertVariantNames } from './alert-variants.ts'

interface BehaviorArgs {
  onConfirm: () => void
  onDismiss: () => void
}

const meta = {
  args: { onConfirm: fn(), onDismiss: fn() },
  argTypes: {
    onConfirm: { control: false },
    onDismiss: { control: false },
  },
  decorators: [AlertCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Alert/Behavior',
} satisfies Meta<BehaviorArgs>

export default meta

type Story = StoryObj<BehaviorArgs>

export const AnnouncedOnInsert: Story = {
  render: () => <TitleOnlyAlert />,
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await expect(alert).toHaveAttribute('data-slot', 'alert')
    await expect(within(alert).getByText('Heads up!')).toBeVisible()
  },
}

export const StandingNotice: Story = {
  render: () => (
    <Alert role="status">
      <AlertTitle>Scheduled maintenance on Sunday</AlertTitle>
      <AlertDescription>Sync pauses from 02:00 to 03:00 UTC.</AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('alert')).toBeNull()
    await expect(canvas.getByRole('status')).toHaveAttribute(
      'data-slot',
      'alert',
    )
  },
}

export const StatusIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {alertVariantNames.map((variant) => (
        <Alert key={variant} variant={variant}>
          <StatusIcon aria-hidden="true" variant={variant} />
          <AlertTitle>{variant}</AlertTitle>
        </Alert>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const alerts = within(canvasElement).getAllByRole('alert')
    await expect(alerts).toHaveLength(alertVariantNames.length)
    for (const [index, variant] of alertVariantNames.entries()) {
      const alert = alerts[index] as HTMLElement
      await expect(
        within(alert).getByRole('img', {
          name: alertStatusIcons[variant].label,
        }),
      ).toBe(alert.querySelector('svg'))
    }
  },
}

export const DecorativeIcon: Story = {
  render: () => (
    <Alert>
      <InfoIcon aria-hidden="true" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Describe what can be done about it here.
      </AlertDescription>
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    const icon = alert.querySelector('svg')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    const iconBox = icon?.getBoundingClientRect()
    await expect(iconBox?.width).toBe(16)
    const title = within(alert).getByText('Heads up!').getBoundingClientRect()
    const description = within(alert)
      .getByText('Describe what can be done about it here.')
      .getBoundingClientRect()
    await expect(title.left).toBeGreaterThan(iconBox?.right ?? 0)
    await expect(description.left).toBe(title.left)
  },
}

export const Actions: Story = {
  render: ({ onConfirm, onDismiss }) => (
    <ActionAlert onConfirm={onConfirm} onDismiss={onDismiss} />
  ),
  play: async ({ args, canvasElement }) => {
    const alert = within(canvasElement).getByRole('alert')
    await userEvent.click(within(alert).getByRole('button', { name: 'Ok' }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await expect(args.onDismiss).not.toHaveBeenCalled()
    await userEvent.click(
      within(alert).getByRole('button', { name: 'Dismiss' }),
    )
    await expect(args.onDismiss).toHaveBeenCalledOnce()
  },
}

export const ParagraphGap: Story = {
  render: () => <ParagraphsAlert />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas
      .getByText('Describe what happened here.')
      .getBoundingClientRect()
    const second = canvas
      .getByText('Describe what can be done about it here.')
      .getBoundingClientRect()
    await expect(second.top - first.bottom).toBe(10)
  },
}
