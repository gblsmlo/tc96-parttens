import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '@tc96/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { Text } from '@tc96/ui/text'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Text/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const invoices = [
  {
    description: 'Annual subscription, Business plan, 24 seats, renewal 2027',
    number: 'INV-2041',
  },
  {
    description: 'Onboarding workshop for the finance and operations teams',
    number: 'INV-2042',
  },
  { description: 'Extra storage', number: 'INV-2043' },
] as const

export const PageHeading: Story = {
  render: () => (
    <header className="flex w-96 flex-col gap-2">
      <Text
        family="heading"
        render={(props) => <h1 {...props} />}
        size="3xl"
        tracking="tight"
        weight="bold"
      >
        Billing
      </Text>
      <Text foreground="muted" render={<p />} size="sm">
        Manage your plan, payment method and the invoices of the workspace.
      </Text>
    </header>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Billing' }),
    ).toHaveClass('font-heading', 'text-3xl')
    await expect(canvas.getByText(/Manage your plan/)).toHaveClass(
      'text-muted-foreground',
    )
  },
}

export const SettingsRow: Story = {
  render: () => (
    <div className="flex w-96 items-center justify-between gap-6 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <Text id="digest-label" render={<p />} size="sm" weight="medium">
          Weekly digest
        </Text>
        <Text
          foreground="muted"
          id="digest-description"
          render={<p />}
          size="xs"
        >
          A summary of activity in your projects, every Monday at 9:00.
        </Text>
      </div>
      <Switch
        aria-describedby="digest-description"
        aria-labelledby="digest-label"
        defaultChecked
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('switch', { name: 'Weekly digest' }),
    ).toBeChecked()
  },
}

export const TruncatedCell: Story = {
  render: () => (
    <Table className="w-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(({ description, number }) => (
          <TableRow key={number}>
            <TableCell>
              <Text family="mono" size="xs">
                {number}
              </Text>
            </TableCell>
            <TableCell>
              <div className="w-56">
                <Text render={<p />} truncate>
                  {description}
                </Text>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const long = canvas.getByText(/Annual subscription/)
    await expect(long.scrollWidth).toBeGreaterThan(long.clientWidth)
    const short = canvas.getByText('Extra storage')
    await expect(short.scrollWidth).toBeLessThanOrEqual(short.clientWidth)
  },
}
