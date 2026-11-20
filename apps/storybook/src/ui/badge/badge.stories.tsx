import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@tc96/ui/badge'
import { expect, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../.storybook/docs-page.tsx'
import { IconSlot, Slot } from '../../patterns/records/group/fixtures/slot'
import { badgeApi, badgeSizeNames, badgeVariantNames } from './badge-api.ts'

const usage = `
import { Badge } from '@acme/ui/badge'

<Badge variant="outline" size="default">
  <CheckIcon aria-hidden="true" />
  Verified
</Badge>
`

const docs = {
  api: [badgeApi.Badge],
  description: {
    component:
      'A badge is a short label that sits next to the thing it describes: a status, a category, a count, a plan. It is a `span` by default and can render as a link or a button through `render`. `UI/Badge/Behavior` shows each variant, size and element, `UI/Badge/API Reference/Badge` has the controls, and `UI/Badge/Usages` places badges in context. Reference: [coss ui Badge](https://coss.com/ui/docs/components/badge).',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const meta = {
  args: {
    children: 'Badge',
    size: 'default',
    variant: 'primary',
  },
  argTypes: {
    size: { control: 'inline-radio', options: badgeSizeNames },
    variant: { control: 'select', options: badgeVariantNames },
  },
  component: Badge,
  parameters: { docs, layout: 'centered' },
  title: 'UI/Badge',
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('Badge')
    await expect(badge.tagName).toBe('SPAN')
    await expect(badge).toHaveAttribute('data-slot', 'badge')
  },
}

export const Anatomy: Story = {
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('[data-slot="badge"]')
    if (!(badge instanceof HTMLElement))
      throw new Error('The badge did not render.')
    await expect(badge.querySelector('[data-anatomy="leading"]')).not.toBeNull()
    await expect(within(badge).getByText('children')).toBeVisible()
  },
  render: (args) => (
    <Badge {...args} size="large" variant="outline">
      <IconSlot />
      <Slot name="children" />
    </Badge>
  ),
}
