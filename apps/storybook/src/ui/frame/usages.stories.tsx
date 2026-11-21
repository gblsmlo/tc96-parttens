import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@tc96/ui/frame'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { expect, within } from 'storybook/test'
import { FrameCanvas } from './frame-frame.tsx'
import { TeamMembersFrame } from './frame-layouts.tsx'

const invoices = [
  { amount: '$240.00', date: 'Nov 1, 2026', id: 'INV-1042', status: 'Paid' },
  { amount: '$240.00', date: 'Oct 1, 2026', id: 'INV-1031', status: 'Paid' },
  {
    amount: '$192.00',
    date: 'Sep 1, 2026',
    id: 'INV-1019',
    status: 'Refunded',
  },
]

const meta = {
  decorators: [FrameCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Frame/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TeamMembers: Story = {
  render: () => <TeamMembersFrame />,
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Team members',
    })
    await expect(within(section).getAllByRole('listitem')).toHaveLength(3)
    await expect(
      within(section).getByRole('button', { name: 'Invite member' }),
    ).toBeVisible()
  },
}

export const BillingOverview: Story = {
  render: () => (
    <section aria-labelledby="billing-title">
      <Frame>
        <FrameHeader>
          <FrameTitle>
            <h2 id="billing-title">Billing</h2>
          </FrameTitle>
          <FrameDescription>
            Your plan and the card it is charged to.
          </FrameDescription>
        </FrameHeader>
        <FramePanel className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-medium text-sm">Team plan</span>
            <span className="text-muted-foreground text-sm">
              $24 per seat a month, renews on Dec 1, 2026
            </span>
          </div>
          <Button size="sm" variant="outline">
            Change plan
          </Button>
        </FramePanel>
        <FramePanel className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-medium text-sm">Visa ending in 4242</span>
            <span className="text-muted-foreground text-sm">
              Expires 08/2028
            </span>
          </div>
          <Button size="sm" variant="outline">
            Update card
          </Button>
        </FramePanel>
      </Frame>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Billing',
    })
    await expect(within(section).getByText('Team plan')).toBeVisible()
    await expect(within(section).getByText('Visa ending in 4242')).toBeVisible()
  },
}

export const Invoices: Story = {
  render: () => (
    <section aria-labelledby="invoices-title">
      <Frame>
        <FrameHeader>
          <FrameTitle>
            <h2 id="invoices-title">Invoices</h2>
          </FrameTitle>
          <FrameDescription>
            Billing history for the last quarter.
          </FrameDescription>
        </FrameHeader>
        <Table variant="card">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(({ amount, date, id, status }) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{id}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell className="text-end">{amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <FrameFooter>
          <p className="text-muted-foreground text-sm">
            Invoices are also emailed to billing@northwind.example.
          </p>
        </FrameFooter>
      </Frame>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const section = within(canvasElement).getByRole('region', {
      name: 'Invoices',
    })
    const table = within(section).getByRole('table')
    await expect(within(table).getAllByRole('row')).toHaveLength(4)
  },
}
