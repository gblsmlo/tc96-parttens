import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import {
  CardFrame,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
} from '@tc96/ui/card'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { TableCanvas } from './table-frame.tsx'

const meta = {
  decorators: [TableCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Table/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const invoices = [
  { amount: '$250.00', date: 'Nov 1', id: 'INV-1042', status: 'Paid' },
  { amount: '$150.00', date: 'Oct 1', id: 'INV-1031', status: 'Paid' },
  { amount: '$350.00', date: 'Sep 1', id: 'INV-1020', status: 'Refunded' },
]

const statusDots: Record<string, string> = {
  Paid: 'bg-success',
  Refunded: 'bg-muted-foreground',
}

export const Invoices: Story = {
  render: () => (
    <CardFrame>
      <CardFrameHeader>
        <CardFrameTitle>Invoices</CardFrameTitle>
        <CardFrameDescription>
          Billed monthly to the card ending in 4242.
        </CardFrameDescription>
      </CardFrameHeader>
      <Table aria-label="Invoices" variant="card">
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${statusDots[invoice.status]}`}
                  />
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total billed</TableCell>
            <TableCell className="text-right">$750.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </CardFrame>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'Invoices',
    })
    await expect(within(table).getByText('$750.00')).toBeVisible()
  },
}

const members = [
  { email: 'ana@northwind.io', name: 'Ana Souza', role: 'Owner' },
  { email: 'li@northwind.io', name: 'Li Wei', role: 'Admin' },
  { email: 'omar@northwind.io', name: 'Omar Haddad', role: 'Member' },
]

const TeamMembersTable = () => {
  const [selected, setSelected] = useState<string[]>(['li@northwind.io'])
  const allSelected = selected.length === members.length
  const toggle = (email: string, checked: boolean) =>
    setSelected((current) =>
      checked ? [...current, email] : current.filter((item) => item !== email),
    )
  return (
    <Table>
      <TableCaption>Members of the Northwind workspace.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Select all members"
              checked={allSelected}
              indeterminate={selected.length > 0 && !allSelected}
              onCheckedChange={(checked) =>
                setSelected(checked ? members.map((item) => item.email) : [])
              }
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const isSelected = selected.includes(member.email)
          return (
            <TableRow
              data-state={isSelected ? 'selected' : undefined}
              key={member.email}
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${member.name}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => toggle(member.email, checked)}
                />
              </TableCell>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{member.role}</Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export const TeamMembers: Story = {
  render: () => <TeamMembersTable />,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'Members of the Northwind workspace.',
    })
    await expect(
      within(table).getByRole('checkbox', { name: 'Select Li Wei' }),
    ).toBeChecked()
  },
}

const deployments = [
  {
    branch: 'main',
    commit: 'a1f9c3e',
    duration: '1m 12s',
    status: 'Ready',
    variant: 'success',
  },
  {
    branch: 'fix/login-redirect',
    commit: '7d24b08',
    duration: '58s',
    status: 'Failed',
    variant: 'error',
  },
  {
    branch: 'main',
    commit: 'c0e5a71',
    duration: '1m 05s',
    status: 'Ready',
    variant: 'success',
  },
] as const

export const DeploymentHistory: Story = {
  render: () => (
    <Table>
      <TableCaption>The last three deployments of the web app.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Commit</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.map((deployment) => (
          <TableRow key={deployment.commit}>
            <TableCell className="font-mono">{deployment.commit}</TableCell>
            <TableCell>{deployment.branch}</TableCell>
            <TableCell>
              <Badge variant={deployment.variant}>{deployment.status}</Badge>
            </TableCell>
            <TableCell className="text-right">{deployment.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', {
      name: 'The last three deployments of the web app.',
    })
    await expect(within(table).getByText('Failed')).toBeVisible()
  },
}

const usage = [
  { included: '10', resource: 'Seats', used: '8' },
  { included: '50 GB', resource: 'Storage', used: '31.4 GB' },
  { included: '100,000', resource: 'API calls', used: '64,210' },
]

export const UsageThisMonth: Story = {
  render: () => (
    <Table>
      <TableCaption>Usage of the Team plan in November.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Resource</TableHead>
          <TableHead className="text-right">Used</TableHead>
          <TableHead className="text-right">Included</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usage.map((item) => (
          <TableRow key={item.resource}>
            <TableHead scope="row">{item.resource}</TableHead>
            <TableCell className="text-right">{item.used}</TableCell>
            <TableCell className="text-right">{item.included}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('rowheader', { name: 'Storage' }),
    ).toBeVisible()
  },
}
