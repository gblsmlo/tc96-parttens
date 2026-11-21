import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { expect, within } from 'storybook/test'
import { FormattingToolbar, ViewSwitcher } from './toggle-group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ToggleGroup/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TextFormatting: Story = {
  render: () => (
    <div className="flex w-md max-w-full flex-col gap-2 rounded-lg border p-2">
      <FormattingToolbar />
      <p className="px-1 text-sm">
        <strong>Release notes:</strong> the export now keeps the column order
        you set in the table.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Text formatting',
    })
    await expect(
      within(group).getByRole('button', { name: 'Bold' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(
      within(group).getByRole('button', { name: 'Strikethrough' }),
    ).toHaveAttribute('aria-pressed', 'false')
  },
}

export const ProjectViews: Story = {
  render: () => (
    <div className="flex w-xl max-w-full items-center justify-between gap-4">
      <div className="flex flex-col">
        <h2 className="font-semibold text-base">Website relaunch</h2>
        <p className="text-muted-foreground text-sm">24 tasks, 6 overdue</p>
      </div>
      <ViewSwitcher />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'View' })
    await expect(
      within(group).getByRole('button', { name: 'Board' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(within(group).getAllByRole('button')).toHaveLength(3)
  },
}

const periods = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
]

export const ChartPeriod: Story = {
  render: () => (
    <div className="flex w-md max-w-full flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-medium text-sm">Revenue</h2>
        <ToggleGroup aria-label="Period" defaultValue={['30d']} size="sm">
          {periods.map(({ label, value }) => (
            <ToggleGroupItem key={value} value={value}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <p className="font-semibold text-2xl">$48,250</p>
      <p className="text-muted-foreground text-sm">
        Up 12% from the previous 30 days
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: '30 days' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByText('$48,250')).toBeVisible()
  },
}
