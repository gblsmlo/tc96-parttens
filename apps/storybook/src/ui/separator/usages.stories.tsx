import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@tc96/ui/breadcrumb'
import { Button } from '@tc96/ui/button'
import { Separator } from '@tc96/ui/separator'
import { PanelLeftIcon } from 'lucide-react'
import { Fragment } from 'react'
import { expect, within } from 'storybook/test'
import { SeparatorCanvas } from './separator-frame.tsx'

const meta = {
  decorators: [SeparatorCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Separator/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const orderLines = [
  { amount: '$120.00', label: 'Subtotal' },
  { amount: '$8.00', label: 'Shipping' },
  { amount: '$10.24', label: 'Tax' },
] as const

const footerLinks = ['Privacy', 'Terms', 'Status', 'Contact'] as const

const workspaceLinks = ['Members', 'Billing', 'Settings'] as const

const OrderSummary = () => (
  <div className="flex flex-col gap-4 text-sm">
    <dl className="flex flex-col gap-2">
      {orderLines.map((line) => (
        <div className="flex justify-between gap-4" key={line.label}>
          <dt className="text-muted-foreground">{line.label}</dt>
          <dd>{line.amount}</dd>
        </div>
      ))}
    </dl>
    <Separator />
    <dl className="flex justify-between gap-4 font-medium">
      <dt>Total</dt>
      <dd>$138.24</dd>
    </dl>
  </div>
)

const FooterLinks = () => (
  <nav aria-label="Legal" className="flex items-center gap-3 text-sm">
    {footerLinks.map((link, index) => (
      <Fragment key={link}>
        {index > 0 ? <Separator orientation="vertical" /> : null}
        <a
          className="text-muted-foreground underline-offset-4 hover:underline"
          href={`#${link.toLowerCase()}`}
        >
          {link}
        </a>
      </Fragment>
    ))}
  </nav>
)

const PageHeader = () => (
  <div className="flex h-14 items-center gap-2 border-b px-4">
    <Button
      aria-label="Toggle sidebar"
      className="-ms-1"
      size="icon-sm"
      variant="ghost"
    >
      <PanelLeftIcon aria-hidden="true" />
    </Button>
    <Separator className="me-2 h-4" orientation="vertical" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#billing">Billing</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Invoices</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
)

const WorkspaceCard = () => (
  <div className="flex flex-col text-sm">
    <div className="flex flex-col gap-1">
      <span className="font-medium">Northwind Studio</span>
      <span className="text-muted-foreground">
        12 members on the Team plan, renewing on March 1.
      </span>
    </div>
    <Separator className="my-4" />
    <div className="flex items-center gap-4">
      {workspaceLinks.map((link, index) => (
        <Fragment key={link}>
          {index > 0 ? <Separator orientation="vertical" /> : null}
          <span>{link}</span>
        </Fragment>
      ))}
    </div>
  </div>
)

export const OrderTotal: Story = {
  render: () => <OrderSummary />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Total')).toBeVisible()
    await expect(canvas.getByText('$138.24')).toBeVisible()
    await expect(canvas.getAllByRole('separator')).toHaveLength(1)
  },
}

export const FooterNavigation: Story = {
  render: () => <FooterLinks />,
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', {
      name: 'Legal',
    })
    await expect(within(nav).getAllByRole('link')).toHaveLength(
      footerLinks.length,
    )
    await expect(within(nav).getAllByRole('separator')).toHaveLength(
      footerLinks.length - 1,
    )
  },
}

export const HeaderBreadcrumb: Story = {
  render: () => <PageHeader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const breadcrumb = canvas.getByRole('navigation', { name: 'breadcrumb' })
    await expect(
      canvas.getByRole('button', { name: 'Toggle sidebar' }),
    ).toBeVisible()
    await expect(canvas.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    )
    await expect(within(breadcrumb).getByRole('link')).toHaveTextContent(
      'Billing',
    )
    await expect(within(breadcrumb).getByText('Invoices')).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}

export const WorkspaceSummary: Story = {
  render: () => <WorkspaceCard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const separators = canvas.getAllByRole('separator')
    await expect(canvas.getByText('Northwind Studio')).toBeVisible()
    await expect(
      separators.filter(
        (separator) =>
          separator.getAttribute('aria-orientation') === 'vertical',
      ),
    ).toHaveLength(workspaceLinks.length - 1)
  },
}
