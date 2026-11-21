import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@tc96/ui/pagination'
import { useState } from 'react'
import { expect, within } from 'storybook/test'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Pagination/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const searchHref = (page: number) => `?q=invoice&page=${page}`

export const SearchResults: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-sm">
        Showing results 41–50 of 118 for “invoice”
      </p>
      <Pagination aria-label="Search results pages">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={searchHref(4)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={searchHref(1)}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {[4, 5, 6].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={searchHref(page)}
                isActive={page === 5 || undefined}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={searchHref(12)}>12</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={searchHref(6)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Search results pages',
    })
    await expect(within(nav).getByRole('link', { name: '5' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}

const invoices = [
  { amount: '$1,240.00', customer: 'Northwind Traders', id: 'INV-1042' },
  { amount: '$310.50', customer: 'Lumen Studio', id: 'INV-1041' },
  { amount: '$8,900.00', customer: 'Harbor Logistics', id: 'INV-1040' },
  { amount: '$72.00', customer: 'Pine & Co.', id: 'INV-1039' },
  { amount: '$2,015.75', customer: 'Atlas Dental', id: 'INV-1038' },
  { amount: '$499.00', customer: 'Bright Path School', id: 'INV-1037' },
  { amount: '$1,100.00', customer: 'Kite Analytics', id: 'INV-1036' },
]

const invoicesPerPage = 3

const InvoiceList = () => {
  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(invoices.length / invoicesPerPage)
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)
  const visible = invoices.slice(
    (page - 1) * invoicesPerPage,
    page * invoicesPerPage,
  )

  return (
    <div className="flex w-sm max-w-full flex-col gap-3">
      <ul className="divide-y rounded-lg border">
        {visible.map((invoice) => (
          <li
            className="flex justify-between gap-4 p-3 text-sm"
            key={invoice.id}
          >
            <span>
              <span className="font-medium">{invoice.id}</span>{' '}
              <span className="text-muted-foreground">{invoice.customer}</span>
            </span>
            <span className="tabular-nums">{invoice.amount}</span>
          </li>
        ))}
      </ul>
      <Pagination aria-label="Invoice pages">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(page - 1)}
              render={<Button disabled={page === 1} variant="ghost" />}
            />
          </PaginationItem>
          {pages.map((item) => (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === page || undefined}
                onClick={() => setPage(item)}
                render={
                  <Button
                    size="icon"
                    variant={item === page ? 'outline' : 'ghost'}
                  />
                }
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(page + 1)}
              render={<Button disabled={page === pageCount} variant="ghost" />}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export const InvoicesOnTheClient: Story = {
  render: () => <InvoiceList />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Invoice pages',
    })
    await expect(
      within(nav).getByRole('button', { name: 'Go to previous page' }),
    ).toBeDisabled()
    await expect(
      within(nav).getByRole('button', { name: '1' }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(within(canvasElement).getByText('INV-1042')).toBeVisible()
  },
}

export const BlogArchive: Story = {
  render: () => (
    <Pagination aria-label="Blog archive pages">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="/blog/page/1" />
        </PaginationItem>
        <PaginationItem>
          <span className="px-2 text-muted-foreground text-sm">
            Page 2 of 6
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/blog/page/3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Blog archive pages',
    })
    await expect(within(nav).getByText('Page 2 of 6')).toBeVisible()
    await expect(
      within(nav).getByRole('link', { name: 'Go to next page' }),
    ).toHaveAttribute('href', '/blog/page/3')
  },
}
