import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@tc96/ui/card'
import type { CSSProperties } from 'react'
import { expect, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../.storybook/docs-page.tsx'

const usage = `
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@acme/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardPanel>Content</CardPanel>
  <CardFooter>Footer</CardFooter>
</Card>
`

const docs = {
  api: [
    {
      description:
        'Root surface: the `card` and `card-foreground` tokens, the COSS border, shadow and inner edge, and the radius of the `--card-radius` theme token (`rounded-card`). Supports `render`.',
      name: 'Card',
    },
    {
      description:
        'Header block for the title, the description and an optional `CardAction`.',
      name: 'CardHeader',
    },
    { description: 'Title text.', name: 'CardTitle' },
    {
      description: 'Supporting text under the title.',
      name: 'CardDescription',
    },
    {
      description: 'Action buttons, placed at the end of the header.',
      name: 'CardAction',
    },
    {
      description: 'Main content area, also exported as `CardContent`.',
      name: 'CardPanel',
    },
    { description: 'Footer section.', name: 'CardFooter' },
  ],
  description: {
    component:
      'COSS Card (https://coss.com/ui/docs/components/card). Groups a header, content and footer on one surface. `CardFrame` groups cards under a shared header: see `UI/Card/Frame`.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  title: 'UI/Card',
  component: Card,
  decorators: [
    (Story) => (
      <div className="w-full max-w-xs">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardPanel>Content</CardPanel>
      <CardFooter>Footer</CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const cardIn = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="card"]') as HTMLElement

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const card = cardIn(canvasElement)
    await expect(card).toHaveClass(
      'bg-card',
      'text-card-foreground',
      'border',
      'rounded-card',
      'shadow-xs/5',
    )
    for (const slot of [
      'card-header',
      'card-title',
      'card-description',
      'card-panel',
      'card-footer',
    ])
      await expect(
        card.querySelector(`[data-slot="${slot}"]`),
      ).toBeInTheDocument()
    await expect(within(card).getByText('Content')).toBeVisible()
  },
}

export const RenderedAsSection: Story = {
  args: { render: <section aria-label="Billing" /> },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole('region', { name: 'Billing' })
    await expect(card).toHaveAttribute('data-slot', 'card')
    await expect(card).toHaveClass('bg-card')
  },
}

export const RadiusFromTheToken: Story = {
  args: { style: { '--card-radius': '3px' } as CSSProperties },
  play: async ({ canvasElement }) => {
    const card = cardIn(canvasElement)
    await expect(getComputedStyle(card).borderRadius).toBe('3px')
    await expect(getComputedStyle(card, '::before').borderRadius).toBe('2px')
  },
}

export const RadiusFromClassName: Story = {
  args: { className: 'rounded-none' },
  play: async ({ canvasElement }) => {
    const card = cardIn(canvasElement)
    await expect(card).not.toHaveClass('rounded-card')
    await expect(getComputedStyle(card).borderRadius).toBe('0px')
  },
}
