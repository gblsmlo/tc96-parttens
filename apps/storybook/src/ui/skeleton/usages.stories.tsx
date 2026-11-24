import { UserPlusIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import { Skeleton } from '@tc96/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { expect, within } from 'storybook/test'
import { ProfileRowSkeleton } from './skeleton-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Skeleton/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const invoiceColumns = ['Invoice', 'Customer', 'Status', 'Amount'] as const

const invoiceRows = ['inv-row-1', 'inv-row-2', 'inv-row-3', 'inv-row-4']

export const PeopleToFollow: Story = {
  render: () => (
    <section aria-labelledby="people-to-follow" className="flex w-80 flex-col">
      <h2 className="mb-3 font-medium text-sm" id="people-to-follow">
        People to follow
      </h2>
      <output className="sr-only">Loading more people…</output>
      <ul aria-busy="true" className="flex flex-col gap-4">
        <li className="flex items-center gap-4">
          <Avatar className="[--avatar-size:--spacing(10)]">
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="line-clamp-1 font-medium text-sm">
              Sarah Johnson
            </span>
            <span className="text-muted-foreground text-xs">
              1.2k followers
            </span>
          </div>
          <Button size="xs" variant="outline">
            <UserPlusIcon aria-hidden="true" />
            Follow
          </Button>
        </li>
        <li aria-hidden="true">
          <ProfileRowSkeleton />
        </li>
        <li aria-hidden="true">
          <ProfileRowSkeleton />
        </li>
      </ul>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('list')
    await expect(list).toHaveAttribute('aria-busy', 'true')
    await expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    await expect(canvas.getByText('Sarah Johnson')).toBeVisible()
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Loading more people…',
    )
  },
}

export const InvoicesLoading: Story = {
  render: () => (
    <div className="w-xl max-w-full">
      <output className="sr-only">Loading invoices…</output>
      <Table>
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            {invoiceColumns.map((column) => (
              <TableHead
                className={column === 'Amount' ? 'text-end' : undefined}
                key={column}
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody aria-busy="true">
          {invoiceRows.map((row) => (
            <TableRow aria-hidden="true" key={row}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="ms-auto h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const table = canvas.getByRole('table', { name: 'Recent invoices' })
    await expect(within(table).getAllByRole('columnheader')).toHaveLength(
      invoiceColumns.length,
    )
    await expect(within(table).queryAllByRole('cell')).toHaveLength(0)
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Loading invoices…',
    )
  },
}

export const RevenueLoading: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>November 2026</CardDescription>
      </CardHeader>
      <CardPanel>
        <div aria-busy="true" className="flex flex-col gap-2">
          <output className="sr-only">Loading revenue…</output>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardPanel>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Monthly revenue')).toBeVisible()
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Loading revenue…',
    )
  },
}
